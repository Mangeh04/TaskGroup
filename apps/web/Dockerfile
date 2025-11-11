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

ENV PORT=3000

COPY --from=builder /app/out/json/ .
COPY bun.lock bun.lock
RUN bun install
COPY --from=builder /app/out/full .

RUN bunx turbo run build --filter=web...

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

EXPOSE 3000

CMD ["bun", "apps/web/server.js"]
