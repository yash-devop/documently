# Documently Handbook

Everything you need to run this project: local development, testing the production
build locally, and shipping to EC2.

---

# The 30-second mental model

The project has **6 pieces**. This table explains where each one runs and why.

| Piece         | What it does                | Runs where (day-to-day)                              |
| ------------- | --------------------------- | ---------------------------------------------------- |
| **web**       | Next.js chat UI             | `pnpm dev` on your laptop                            |
| **server**    | Express API                 | `pnpm dev` on your laptop                            |
| **worker**    | Parses PDFs, writes vectors | `pnpm dev` on your laptop                            |
| **db**        | Postgres + pgvector         | **Docker** locally, **managed (Neon)** in production |
| **redis**     | Job queue (BullMQ)          | **Docker**                                           |
| **env files** | Secrets and URLs            | Repo root, gitignored                                |

**The one rule to remember:**

> Locally, databases and queues live in Docker and your code runs on your laptop.
> In production it's inverted: the code runs in Docker and the database is managed.

That split is deliberate. Your code reloads instantly with `tsup --watch` and Next.js
hot reload; databases must persist between restarts. Docker gives you both.

**The second rule:**

> Never run the app twice. Docker containers and `pnpm dev` both want port `8000`.

---

# Part 1 — Local development

## What you need

- **Node 22+** — `node -v`
- **pnpm 9** — `pnpm -v`
- **Docker Desktop**, running

## First time only

```sh
pnpm install
pnpm prisma:generate
```

## Every day (3 commands)

```sh
pnpm compose:infra    # 1. start Postgres + Redis
pnpm prisma:dev       # 2. push the schema into the database
pnpm dev              # 3. start web + server + worker
```

Then open **http://localhost:3000**

### What each URL gives you

| URL                          | What it is                        |
| ---------------------------- | --------------------------------- |
| http://localhost:3000        | the web app                       |
| http://localhost:8000/api/v1 | the API (returns `401` = healthy) |
| `localhost:5432`             | Postgres                          |
| `localhost:6379`             | Redis                             |

### Do I need `prisma:dev` every time?

Only when you change `packages/db/prisma/*.prisma`. It's harmless to run daily.

---

# Part 2 — Test the production build locally

Use this before deploying, to catch problems on your own machine.

## Option A — production build, no Docker (fastest)

```sh
pnpm build
pnpm start
```

`pnpm start` runs the **real** production bundles: `next start` for the web app and
`node dist/index.mjs` for the server and worker.

## Option B — the actual Docker image (closest to EC2)

```sh
pnpm compose:up          # production mode
pnpm compose:up:dev      # same, but development mode (verbose Prisma errors)
```

This **builds the image** and runs all four services, so it exercises the same
artifact EC2 will run. Use it when you want to be sure the Docker build works.

> **Known limitation:** `.env.local` sets `DATABASE_URL` to `localhost:5432`,
> which is correct for code running on your host (Option A and `pnpm dev`). Inside
> a container, `localhost` means _the container itself_, so the server and worker
> cannot reach the database this way.
>
> This is a deliberate trade-off: a single `DATABASE_URL` guarantees migrations and
> the app never disagree, in any environment. It does mean all-in-Docker local runs
> need the database reachable by hostname. If you want Option B to work locally,
> add a one-line override to the `server` and `worker` services in
> `docker-compose.yml`:
>
> ```yaml
> DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
> ```
>
> Leave it commented out for production, where Neon must be used.

## ⚠️ Stop `pnpm dev` first

Both options need ports `3000` and `8000`. If `pnpm dev` is running you will see:

```
Error: listen EADDRINUSE: address already in use :::3000
```

Stop the dev server (`Ctrl+C`) before starting production mode.

## How to tell which mode you're in

| Command               | `NODE_ENV` in container | Prisma errors                 |
| --------------------- | ----------------------- | ----------------------------- |
| `pnpm compose:up`     | `production`            | terse (safe for users)        |
| `pnpm compose:up:dev` | `development`           | detailed (good for debugging) |

## Shut everything down

```sh
pnpm compose:down
```

Your data survives this — it lives in Docker volumes.

---

# Part 3 — Deploy to EC2

## Step 1 — Prepare the server

```sh
# An Ubuntu EC2 instance, Docker installed:
sudo apt update && sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable --now docker
```

In the AWS console, open the security group's inbound rules:

| Port | Why                                     |
| ---- | --------------------------------------- |
| 22   | SSH                                     |
| 8000 | the API                                 |
| 3000 | the web app (only if you host it there) |

> Tip: in production, keep `8000` private and put Nginx in front to terminate TLS.
> Then only `80`/`443` need to be open.

## Step 2 — Get the code

```sh
sudo mkdir -p /opt/documently
sudo chown $USER /opt/documently
git clone <your-repo-url> /opt/documently
cd /opt/documently
```

## Step 3 — Create the production env file

`.env*` files are **gitignored**, so they never arrive with `git clone`. Create it:

```sh
cp .env.production.example .env.production
nano .env.production
```

You must change these:

| Key                        | Set it to                            |
| -------------------------- | ------------------------------------ |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://yourdomain.com`             |
| `BETTER_AUTH_URL`          | `https://api.yourdomain.com`         |
| `BETTER_AUTH_SECRET`       | a long random string                 |
| `DATABASE_URL`             | your managed Postgres connection URL |
| `GOOGLE_*` / `GITHUB_*`    | your real OAuth client id + secret   |
| `GOOGLE_GEMINI_API_KEY`    | your real key                        |
| `AWS_*`                    | your real S3 bucket + IAM keys       |

Generate a secret:

```sh
openssl rand -base64 32
```

Also add your callback URLs in the Google and GitHub consoles:

```
<BETTER_AUTH_URL>/callback/google
<BETTER_AUTH_URL>/callback/github
```

### One database URL — that's the whole trick

`DATABASE_URL` is the only variable that matters, and **everything reads it**:

| Consumer                        | Reads          |
| ------------------------------- | -------------- |
| `pnpm prisma:prod` (host)       | `DATABASE_URL` |
| server + worker **containers**  | `DATABASE_URL` |
| local `pnpm dev` + `prisma:dev` | `DATABASE_URL` |

Compose does **not** override it. So the app and the migrations physically cannot
end up on different databases — the failure mode where you migrate one database and
the app reads another is designed out.

Two notes:

- **Use the direct connection string, not a pooler.** Transaction-mode poolers
  (Neon's `-pooler.` hostname) can break `prisma migrate deploy`. Neon gives you
  both; use the direct one here.
- **The `db` container is unused in production** but still starts. That's why
  `POSTGRES_*` must stay filled in — the postgres image refuses to boot without a
  password, and the server waits on it. The values are ignored by the app.

## Step 4 — Build and start

```sh
docker compose --env-file .env.production up -d --build
docker compose ps
```

You should see `db`, `redis`, `server`, and `worker` all `Up`.

## Step 5 — Run database migrations

**Required, and it does not happen automatically.**

The production image deliberately does not contain the Prisma CLI or your
migrations, so this must run on the host:

```sh
cd /opt/documently
pnpm prisma:prod
```

## Step 6 — Check it worked

```sh
docker compose logs -f server worker
```

Then sign in at your domain, upload a PDF, and wait for it to reach `READY`. That
one test exercises S3, the queue, the worker, and the vector search together.

## Deploying again later

```sh
cd /opt/documently
git pull
pnpm prisma:prod                            # only if the schema changed
docker compose --env-file .env.production up -d --build
```

Always run migrations **before** restarting the new code.

## If you host the web app on the same server

The Docker setup only covers the backend. Run Next.js directly:

```sh
pnpm install && pnpm build
cd apps/web && pnpm start                   # listens on :3000
```

Alternatively host the web app on **Vercel** — set `NEXT_PUBLIC_BACKEND_URL` and
`NEXT_PUBLIC_FRONTEND_URL` as project environment variables there.

> `NEXT_PUBLIC_*` values are baked in **at build time**. Change them on Vercel, then
> redeploy. Restarting is not enough.

---

# Email verification

Sign-up is gated on a verified address (`emailAndPassword.requireEmailVerification`).
Mail goes out over Gmail's SMTP server.

## Env vars

Add both to `.env.local` and `.env.production` (examples already contain them):

```sh
SMTP_USER=you@gmail.com
SMTP_PASS=your-16-char-app-password
```

- `SMTP_USER` — the Google account that sends the mail. It is also the From
  address, because Gmail rejects any sender that is not the authenticated
  account or one of its aliases.
- `SMTP_PASS` — an **App Password**, not the account password. Enable 2FA, then
  create one at <https://myaccount.google.com/apppasswords> and paste it with
  the spaces removed. Ordinary passwords are refused by Gmail.
- **Without credentials in development** the server does not error: it logs the
  whole email, including the verification link, to the API console. Use that to
  test the flow without touching a mail account at all.
- **In production missing credentials throw** when the first verification mail
  is requested. Set them before deploying or signup will break.
- Transport is hardcoded to `smtp.gmail.com:465` with implicit TLS. That caps
  you at roughly 500 sends/day and ties the From address to a `@gmail.com`
  account, which is fine for a beta but should move to SES/Brevo/Mailgun before
  a public launch.

## How the flow behaves

This trips people up, so it is worth knowing:

1. `POST /api/auth/sign-up/email` returns the user but **no session cookie** —
   better-auth always skips auto sign-in when verification is required.
2. The web app redirects to `/verify-email?email=...`. That screen must not
   require a session, because the visitor has none yet.
3. `POST /api/auth/send-verification-email` works with or without a session and
   always returns `200`, whether or not the address exists. That is deliberate —
   it stops the endpoint being used to discover which emails have accounts.
4. Clicking the emailed link hits `/api/auth/verify-email`, which flips
   `emailVerified` and (via `autoSignInAfterVerification`) issues a session.
5. `authMiddleware` returns `403` `EMAIL_NOT_VERIFIED` for any protected API
   call made with a session whose email is unverified.

> Existing users keep sessions from before this was switched on, so some will
> suddenly get `403` until they verify. The `/verify-email` screen handles the
> resend, and resending works without a session.

## Testing it locally

1. Leave `SMTP_USER` and `SMTP_PASS` empty in `.env.local` and run `pnpm dev`.
2. Sign up at `http://localhost:3000/signup`.
3. Copy the verification link out of the API console.
4. Open it. You should land on `/dashboard` already signed in.
5. Confirm a protected route works: `curl -i http://localhost:8000/api/v1/chats`
   with your cookie returns `200`.

To confirm the API gate itself, flip the flag directly in the database and call
a protected route with the same session — you should get `403`:

```sh
docker exec -i documently_db psql -U postgres -d documently_db -tA \
  <<< 'UPDATE "user" SET "emailVerified" = false WHERE email = '\''you@example.com'\'''
```

---

# Troubleshooting

### `Cannot resolve environment variable: DATABASE_URL`

The env file wasn't found. Check that `.env.local` (or `.env.production`) exists in
the **repo root** and contains `DATABASE_URL`. Commands pick the file based on
`NODE_ENV`: production → `.env.production`, anything else → `.env.local`.

### `Can't reach database server at localhost:5432`

Docker isn't running, or the db container is down:

```sh
pnpm compose:infra
docker compose ps
```

### `EADDRINUSE : address already in use`

Two apps want the same port. Stop `pnpm dev` before `pnpm start` or `compose:up`.

### Worker seems stuck on first run

It downloads a ~22 MB AI model on first boot. Give it a minute, then watch
`docker compose logs -f worker`.

### Documents stuck on `PROCESSING`

Check the worker logs, and confirm the db has the `vector` extension:

```sh
docker compose exec db psql -U postgres -d documently_db -c "\dx"
```

You should see `vector` in the list.

---

# Command reference

| Command                | What it does                                       |
| ---------------------- | -------------------------------------------------- |
| `pnpm dev`             | Run web + server + worker with hot reload          |
| `pnpm build`           | Build everything for production                    |
| `pnpm start`           | Run the production build locally                   |
| `pnpm compose:infra`   | Start **only** db + redis                          |
| `pnpm compose:up`      | Start everything in Docker (production mode)       |
| `pnpm compose:up:dev`  | Same, but `NODE_ENV=development`                   |
| `pnpm compose:up:prod` | Everything using `.env.production`                 |
| `pnpm compose:down`    | Stop all containers (data is kept)                 |
| `pnpm prisma:generate` | Rebuild the Prisma client after schema edits       |
| `pnpm prisma:format`   | Format the Prisma schema files                     |
| `pnpm prisma:dev`      | Push schema to the local database                  |
| `pnpm prisma:prod`     | Apply migrations (production)                      |
| `pnpm prisma:reset`    | Drop and recreate the database — **destroys data** |
| `pnpm check-types`     | Type-check every package                           |
| `pnpm lint`            | Lint every package                                 |

---

# How env files work

Two files live in the **repo root** (never in `apps/`, and never committed):

| File              | Used by                                |
| ----------------- | -------------------------------------- |
| `.env.local`      | development — `pnpm dev`, `prisma:dev` |
| `.env.production` | production — EC2, `compose:up:prod`    |

These hold the **backend** secrets: database URL, OAuth, S3, Gemini, Redis.

> **The web app is the exception.** Its two client variables live in a separate
> file, `apps/web/.env`:
>
> ```
> NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
> NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
> ```
>
> This is deliberate — Next.js inlines `NEXT_PUBLIC_*` at build time, so they must
> live where the web app can find them. It is gitignored, and when the web app is
> hosted on Vercel you set these as Vercel project variables instead.

The app finds them by walking **up** from the working directory until it finds one
(`packages/env/src/resolve-env-file.ts`). Which file it looks for depends on
`NODE_ENV`:

- `NODE_ENV=production` → `.env.production`
- anything else, including unset → `.env.local`

This means `NODE_ENV` must never be set **inside** the env file — the file is
chosen _because of_ `NODE_ENV`. Set it in the shell or in `docker-compose.yml`
instead (which is what the `compose:*` scripts do).

Each file also contains an `ENV_FILE` key. Docker reads that to know which file to
inject into the server and worker containers — this is why `docker compose --env-file
.env.production` correctly picks the production secrets.

`.env.local.example` and `.env.production.example` are committed as templates.
Copy one to get started.
