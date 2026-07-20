FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package requirements
COPY package.json package-lock.json* ./
# Clean install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Production image, copy the static export and serve it
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static files and the exported site
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/out ./out
COPY --from=builder --chown=nextjs:nodejs /app/server.js ./server.js

# Switch to non-root user
USER nextjs

# Expose standard Cloud Run port
EXPOSE 8080
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

# Start the static export server
CMD ["node", "server.js"]
