# AGENTS.md

## What this project is

**Documently** — a "chat with your PDFs" app. Upload documents, ask questions, and get answers grounded only in those documents.

- User uploads PDFs → they're stored in S3 and queued for processing.
- A BullMQ **worker** downloads the file, parses text, chunks it, generates embeddings, and stores chunks + vectors in Postgres (pgvector).
- The **server** runs vector-similarity retrieval over the chat's attached docs and streams a Gemini response to the web client.
- The **web** app is the chat UI (composer, message list, documents popover, sidebar).

## Monorepo layout

pnpm workspaces + Turborepo. `apps/*` and `packages/*`.

### Apps

- `apps/web` — **Next.js 16 (App Router, client-heavy) chat UI**. Port 3000. Uses TanStack Query, axios (with toasts on errors), `@tabler/icons-react`, `tailwindcss` v4, `@repo/ui`.
- `apps/server` — **Express 5 API**. Port 8000, mounted at `/api/v1` (see `apps/server/src/modules/version.routes.ts`). Better-auth for auth, BullMQ producer, Prisma, multer for uploads, S3.
- `apps/worker` — **BullMQ consumer** for the `document-queue`. Pipeline: `downloadFromS3 → pdfParser → cleanText → chunkText → getEmbeddings → insert chunks ($executeRaw with ::vector) → mark document READY`.

### Packages

- `packages/ui` — shadcn/ui components (base-ui based) + shared hooks. **Source of truth for all UI components.** Exports from `src/index.tsx`; components live in `src/components/ui/`, hooks in `src/hooks/`.
- `packages/db` — Prisma 7 client. Multi-file schema in `packages/db/prisma/*.prisma` (split: chat, chunk, document, message, schema). Client generated to `packages/db/generated/prisma`. Exports `prisma` and `Prisma` from `packages/db/client.ts`.
- `packages/env` — zod-validated env for each target: `serverEnv`, `workerEnv`, `awsEnv`, plus a shared `resolveEnvFile()` used by all three (and by the Prisma config) to locate the repo-root env file.
- `packages/embeddings` — `getEmbeddings()` (transformer-based, 384-dim vectors, loaded quantized `dtype: "q8"`), plus `RetryableError`/`NonRetryableError`.
- `packages/schemas` — shared zod schemas + inferred types (`attachDocumentSchema`, `ChatPayload`, etc.).
- `packages/utils` — S3 helpers (`uploadToS3`, `downloadFromS3`, `deleteFileFromS3`, `getPresignedUrl`).
- `packages/eslint-config`, `packages/typescript-config` — shared configs.

## Common commands

Run from the repo root:

```sh
pnpm install
pnpm dev            # turbo dev (web next dev; server/worker tsup --watch → node dist/index.mjs)
pnpm build          # turbo build (web next build; server/worker tsup bundle to dist/)
pnpm start          # turbo start (prod runners: web next start; server/worker node dist/index.mjs; needs a prior build)
pnpm lint           # turbo lint
pnpm check-types    # turbo check-types
pnpm format         # prettier over ts/tsx/md

pnpm compose:infra  # only db + redis (use this for local dev)
pnpm compose:up     # all services in Docker, NODE_ENV=production
pnpm compose:up:dev # all services in Docker, NODE_ENV=development (verbose Prisma errors)
pnpm compose:up:prod
pnpm compose:down

pnpm prisma:generate
pnpm prisma:dev     # db push, pinned to .env.local
pnpm prisma:prod    # migrate deploy, pinned to .env.production (run on EC2 before restarting new code)
pnpm prisma:reset   # destructive
```

Per-app (faster for iteration):

```sh
pnpm --filter web check-types
pnpm --filter web lint
pnpm --filter server check-types
```

Requires: Node >= 22, pnpm 9. Env files live in the **repo root** (gitignored): `.env.local` (dev) and `.env.production` (prod), plus `apps/web/.env` for the two client vars. Templates: `.env.local.example`, `.env.production.example`. `packages/env` locates them with `find-up` walking up from `process.cwd()`, choosing the file by `NODE_ENV`.

Local dev uses Docker for **only** db + redis (`pnpm compose:infra`); server/worker/web run on the host via `pnpm dev`. Never run `compose:up` together with `pnpm dev` — both bind port 8000 and both workers poll the same BullMQ queue.

## Architecture & data flow

- **New chat (welcome screen)**: `/dashboard` has no chat yet. Documents are staged client-side in local state (`components/chat/new-chat-documents.tsx`; the page owns `files` + `libraryIds`). On the first message the page: `POST /chats` to create the chat → uploads staged files + attaches staged library docs → invalidates document keys → sends the message → redirects to `/dashboard/chats/:id`. The composer paperclip stages files too while `chatId` is missing.

1. `web` uploads PDFs → `POST /api/v1/chats/:chatId/documents` (multer `.array("files")`).
2. `document.service.ts` creates the `Document` (status `PROCESSING`), uploads to S3, enqueues `process-document` on BullMQ.
3. `worker` processes the job; on success marks `READY`, on failure `FAILED` with `errorCode`/`errorMessage`. Non-retryable errors skip retries; others are retried by BullMQ.
4. `web` polls/Documents list (status badges, auto-refetch while any doc is `PROCESSING`).
5. Sending a message: server generates an embedding for the question, finds the 5 closest chunks via `<=>` (cosine) over chunks belonging to the chat's attached docs (`chat_document` join) with `status = 'READY'`, builds a grounded prompt with conversation history, and streams the Gemini answer (SSE) back to the client.
6. Attaching (`POST /api/v1/chats/:chatId/documents/attach`) and detaching (`DELETE /api/v1/chats/:chatId/documents/:documentId/detach`) only create/remove the `chat_document` join row (detach keeps the file in the library). `DELETE /api/v1/chats/:chatId/documents/:documentId` is the hard delete (S3 file + DB row).

## Server conventions

- **Modules** are feature-scoped: each has `*.route.ts`, `*.controller.ts`, `*.service.ts` (e.g. `modules/chat/`, `modules/chat-message/`, `modules/document-processing/`, `modules/llm/`). Register new routers in `modules/version.routes.ts`.
- **Auth**: every route uses `authMiddleware` (sets `req.user`). Guard every query with `userId` — never trust `chatId`/`documentId` alone.
- **Response envelope** (success): `{ status, data, message, error: null }`. Errors: throw `AppError(msg, status, code, meta?)` and let `errorMiddleware` format `{ status, error: { code, message }, meta }` (also handles Zod and Prisma errors).
- Shared prisma: `import { prisma, Prisma } from "@repo/db"`.
- LLM access via `LLMService` in `modules/llm/llm.service.ts` (`generateAnswer`, `generateAnswerStream`) — never call Gemini directly elsewhere.

## Web conventions

- **React Query everywhere**: backend calls go in `lib/query/api/*` (typed, unwrap `{ data }` from the envelope), react-query mutations/queries wrapped in `hooks/chats/*`, keys centralized in `lib/query/keys.ts`. Invalidate the relevant keys (`queryKeys.chats.documents(chatId)`, `queryKeys.documents.all()`) after changes.
- **Optimistic + streaming**: `use-send-message.ts` shows an optimistic user bubble + empty streaming placeholder, appends tokens via `setQueryData`, and swaps in the real assistant message on completion.
- **Markdown answers**: assistant messages render through `react-markdown` + `remark-gfm` via `components/chat/markdown-content.tsx` (styled headings/lists/code/tables). Don't render assistant text as raw pre-wrap; user messages stay plain text.
- **Toasts**: use the custom `toast({ title, type })` from `@/components/toasts/index` (or via the axios error interceptor + `getApiError`). Do not use window.alert.
- **Icons**: `@tabler/icons-react`.
- **Path alias**: `@/` → `apps/web` root.
- Server-side/data-intent heavy code belongs in hooks; keep components presentational.

## UI components

- Always use components from `@repo/ui` (`packages/ui`) first.
- If the needed component is not present there, add it by pulling the shadcn/ui implementation (base-ui based) into `packages/ui/src/components/ui/` and export it from `packages/ui/src/index.tsx`.
- If still not available after that, ask the user for further instructions.

## Database notes

- `DocumentChunk.embedding` is an `Unsupported("vector")` column — never pass it through normal Prisma calls; use raw SQL (`prisma.$queryRaw` / `$executeRaw`) and cast `::vector`.
- Uploads scope documents and chats to a `userId`; the `chat_document` join table links a chat to its documents (composite PK `[chatId, documentId]`).
- Prisma 7 is configured via `packages/db/prisma7.config.ts`; schema is split across multiple `.prisma` files.

## Code style

- Do not add comments unless asked.
- Follow existing patterns (service/controller shape, envelope, query-keys + hooks flow) over inventing new ones.
- Reset per-route state with `key` remounts (e.g. the chat view remounts per `chatId`) instead of `setState` inside `useEffect` — lint enforces `react-hooks/set-state-in-effect`.
- Keep changes type-clean: run the targeted `check-types`/`lint` before finishing.

## Commit conventions

- When the user says "commit all changes", split the work into **separate logical commits** (grouped by feature/area) instead of one big commit.
- Use conventional-commit style messages (e.g. `feat(server): ...`, `feat(web): ...`, `chore(packages): ...`) matching the existing repo history.
- Only commit when the user explicitly asks.

## Docs

- Long-form reference and decision records live in `docs/`, not here. Keep this file as the short always-on index.
- Local dev, local production testing, EC2 deploy, and troubleshooting → `docs/DEPLOYMENT.md` (start here).
