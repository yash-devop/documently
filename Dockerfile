FROM node:22-slim AS builder

WORKDIR /app

COPY ./package.json ./pnpm-workspace.yaml ./turbo.json ./pnpm-lock.yaml ./
COPY apps/server/package.json apps/server/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/embeddings/package.json packages/embeddings/package.json
COPY packages/env/package.json packages/env/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/schemas/package.json packages/schemas/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/utils/package.json packages/utils/package.json


RUN npm install -g pnpm@9.7.0 \
    && pnpm install --frozen-lockfile

COPY . .

RUN pnpm turbo run build --filter=server --filter=worker


FROM node:22-slim AS prod

WORKDIR /app

COPY ./package.json ./pnpm-workspace.yaml ./turbo.json ./pnpm-lock.yaml ./
COPY apps/server/package.json apps/server/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/embeddings/package.json packages/embeddings/package.json
COPY packages/env/package.json packages/env/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/schemas/package.json packages/schemas/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/utils/package.json packages/utils/package.json

RUN npm install -g pnpm@9.7.0 \
    && pnpm install --frozen-lockfile --prod


COPY --from=builder /app/apps/server/dist /app/apps/server/dist
COPY --from=builder /app/apps/worker/dist /app/apps/worker/dist