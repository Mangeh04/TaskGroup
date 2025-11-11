FROM oven/bun:1.3.2-alpine AS base
ENV NODE_ENV=production
WORKDIR /app

FROM base AS builder
RUN apk add --no-cache libc6-compat git
WORKDIR /app
COPY . .
RUN bunx turbo prune api --docker

FROM base AS installer
ENV NODE_ENV=development
WORKDIR /app

COPY --from=builder /app/out/json/ ./
RUN bun install --frozen-lockfile
COPY --from=builder /app/out/full/ ./

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN echo "DATABASE_URL=$DATABASE_URL"

RUN bunx turbo run db:generate --filter=@repo/database
RUN bunx turbo run build --filter=api

ENV DATABASE_URL=
FROM base AS runner
WORKDIR /app
RUN addgroup -S appgroup -g 1001 && adduser -S appuser -u 1001 -G appgroup
USER appuser
COPY --from=installer --chown=appuser:appgroup /app ./
EXPOSE 3001
CMD ["bun", "apps/api/dist/main.js"]
