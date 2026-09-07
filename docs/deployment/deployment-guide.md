# Deployment Guide

## 1. Overview
IMS is packaged and deployed using containerized Docker workloads with multi-stage builds for both the NestJS API server and Next.js frontend application.

## 2. Local & On-Premises Docker Deployment

```bash
# 1. Clone repository
git clone <repo_url>
cd IMS

# 2. Copy and configure environment variables
cp .env.example .env

# 3. Start PostgreSQL and Redis database containers
docker compose up -d

# 4. Install dependencies and generate Prisma client
pnpm install
pnpm --filter @ims/api prisma:generate

# 5. Run database migrations
pnpm --filter @ims/api prisma:migrate

# 6. Build and start applications
pnpm run build
pnpm run start
```

---

## Source Reference
* Authoritative Specification: [.ai/TECH_STACK.md](../../.ai/TECH_STACK.md) and [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
