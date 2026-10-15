# Multi-stage Dockerfile for SiteSentinel
FROM node:22-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy package descriptors
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies across all workspaces
RUN npm ci

# Copy source code and assets
COPY shared/ ./shared/
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY demo/ ./demo/
COPY tsconfig*.json ./

# Build shared, backend, and frontend bundles
RUN npm run build

# Production runtime stage
FROM node:22-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=5000
ENV DATA_MODE=local
ENV CLIENT_URL=http://localhost:5173

# Copy root package files
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy compiled code from builder
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/demo ./demo

# Initialize storage and data directories
RUN mkdir -p /app/data /app/uploads

EXPOSE 5000

CMD ["node", "backend/dist/index.js"]
