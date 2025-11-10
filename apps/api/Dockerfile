FROM oven/bun:1.3.2-alpine AS base
ENV NODE_ENV=production
WORKDIR /app

# ---------- builder ----------
FROM base AS builder
RUN apk add --no-cache libc6-compat git
WORKDIR /app
COPY . .
RUN bunx turbo prune api --docker

# ---------- installer ----------
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1) JSON prunados
COPY --from=builder /app/out/json/ ./

# 2) instalar deps (con dev para compilar)
ENV NODE_ENV=development
RUN bun install --frozen-lockfile

# 3) código prunado completo
COPY --from=builder /app/out/full/ ./

# 4) AQUI: define DATABASE_URL ANTES de generate
#    - valor dummy: generate no conecta a DB
ARG DATABASE_URL="mysql://user:pass@localhost:3306/dummy"
ENV DATABASE_URL=${DATABASE_URL}

# 5) generate y build con la env inline para blindarlo
RUN DATABASE_URL="${DATABASE_URL}" bunx turbo run db:generate --filter=@repo/database
RUN bunx turbo run build --filter=api...

# ---------- runner ----------
FROM base AS runner
WORKDIR /app
RUN addgroup -S appgroup -g 1001 && adduser -S appuser -u 1001 -G appgroup
USER appuser
COPY --from=installer --chown=appuser:appgroup /app ./
EXPOSE 3001
CMD ["bun", "apps/api/dist/main.js"]
