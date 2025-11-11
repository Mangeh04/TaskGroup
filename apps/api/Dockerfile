# ---- Base ----
FROM oven/bun:1.3.2-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# ---- Builder ----
FROM base AS builder
RUN apk add --no-cache libc6-compat git
WORKDIR /app

COPY . .
RUN bunx turbo prune api --docker

# ---- Installer ----
FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ ./
RUN bun install --frozen-lockfile
COPY --from=builder /app/out/full/ ./

# Prisma y build del API
RUN bunx turbo run db:generate --filter=@repo/database
RUN bunx turbo run build --filter=api

# ---- Runner ----
FROM base AS runner
WORKDIR /app

RUN addgroup -S appgroup -g 1001 && adduser -S appuser -u 1001 -G appgroup
USER appuser

COPY --from=installer --chown=appuser:appgroup /app ./

EXPOSE 3001
CMD ["bun", "apps/api/dist/main.js"]
