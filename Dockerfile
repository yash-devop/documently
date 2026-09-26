FROM node:22-slim AS builder

# Prisma's engine postinstall probes for libssl and warns (and can fall back to
# openssl-1.1.x) when it is missing. openssl is already in the base image's apt
# index, so this is cheap; removing the apt lists again keeps the layer small.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

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


# ONNXRUNTIME_NODE_INSTALL_CUDA=skip: the CPU runtime (211MB of .so/.dll) ships
# bundled inside the onnxruntime-node package, and its postinstall only ADDS the
# CUDA binaries on top. We have no GPU, so that download is pure waste -- it was
# large enough to get the build OOM-killed. Note this is the *CUDA* flag: setting
# ONNXRUNTIME_NODE_INSTALL=skip would skip the bundled files too and break
# embeddings at runtime.
RUN ONNXRUNTIME_NODE_INSTALL_CUDA=skip npm install -g pnpm@9.7.0 \
    && ONNXRUNTIME_NODE_INSTALL_CUDA=skip pnpm install --frozen-lockfile

COPY . .

RUN pnpm turbo run build --filter=server --filter=worker


FROM node:22-slim AS prod

# See builder stage above for why openssl is installed.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

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

# See builder stage above: keeps the OOM-killing CUDA download out of the build.
RUN ONNXRUNTIME_NODE_INSTALL_CUDA=skip npm install -g pnpm@9.7.0 \
    && ONNXRUNTIME_NODE_INSTALL_CUDA=skip pnpm install --frozen-lockfile --prod


COPY --from=builder /app/apps/server/dist /app/apps/server/dist
COPY --from=builder /app/apps/worker/dist /app/apps/worker/dist