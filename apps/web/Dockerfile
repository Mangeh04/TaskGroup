# Base image: official Bun image
FROM oven/bun:1.3.2-alpine AS base

# -----------------------------
# Builder stage
# -----------------------------
FROM base AS builder

# Set working directory
WORKDIR /app

# Install Turbo globally using Bun
RUN bun install -g turbo

# Copy the entire monorepo
COPY . .

# Copy Bun lockfile explicitly so it's included during prune
COPY bun.lock bun.lock

# Prune the workspace to isolate the "web" app
RUN turbo prune web --docker

# -----------------------------
# Installer stage
# -----------------------------
FROM base AS installer

# Set working directory
WORKDIR /app

# Copy pruned package manifests
COPY --from=builder /app/out/json/ .

# Copy Bun lockfile (Turbo prune doesn't include it automatically)
COPY bun.lock bun.lock

# Install dependencies using Bun lockfile
RUN bun install

# Copy full source code for the build
COPY --from=builder /app/out/full .

# Copy environment variables if needed
COPY packages/database/.env ./packages/database/.env

# Build the project using Turbo
RUN bunx turbo build

# -----------------------------
# Runner stage
# -----------------------------
FROM base AS runner

# Set working directory
WORKDIR /app

# Create a non-root user
RUN adduser -S nextjs -G bun
USER nextjs

# Copy build output from installer
COPY --from=installer --chown=nextjs:bun /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:bun /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:bun /app/apps/web/public ./apps/web/public

# Start the server with Bun
CMD ["bun", "apps/web/server.js"]
