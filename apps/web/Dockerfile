# -----------------------------
# Global build args
# -----------------------------
ARG NEXT_PUBLIC_API_URL
ARG PORT
ARG NODE_ENV

FROM oven/bun:1.3.2-alpine AS base

# -----------------------------
# Builder stage
# -----------------------------
FROM base AS builder
WORKDIR /app
RUN bun install -g turbo
COPY . .
COPY bun.lock bun.lock
RUN turbo prune web --docker

# -----------------------------
# Installer stage
# -----------------------------
FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY bun.lock bun.lock
RUN bun install
COPY --from=builder /app/out/full .

# redeclaramos para este stage
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN bunx turbo run build --filter=web

# -----------------------------
# Runner stage
# -----------------------------
FROM base AS runner
WORKDIR /app

RUN adduser -S nextjs -G bun
USER nextjs

COPY --from=installer --chown=nextjs:bun /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:bun /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:bun /app/apps/web/public ./apps/web/public

ARG PORT
ARG NODE_ENV

ENV NEXT_PORT=${PORT}
ENV PORT=${PORT}     
ENV NODE_ENV=${NODE_ENV}

EXPOSE ${PORT}

CMD ["bun", "apps/web/server.js"]
