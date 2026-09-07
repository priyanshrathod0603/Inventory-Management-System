# Infrastructure Architecture

## 1. Overview
The Phase 1 infrastructure is built around containerized local and staging environments using Docker and Docker Compose, targeting Linux/macOS host environments.

## 2. Containerized Services (`docker-compose.yml`)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: sms-postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d sms_db"]

  redis:
    image: redis:7-alpine
    container_name: sms-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
```

## 3. Node.js & Package Management Foundation
* **Node Runtime**: Node.js 20+ (Active LTS) / Node 24.
* **Package Manager**: pnpm v11 workspace managing `@ims/api` and `@ims/web`.

## 4. Production Deployment Topology (Planned)
* **API Service**: Containerized standalone Node.js production server running NestJS compiled artifacts.
* **Web Service**: Containerized standalone Next.js server with static asset optimization.
* **Database**: Managed PostgreSQL 16+ instance with daily automated backups (`pg_dump`).
* **Cache**: Managed Redis instance for session state and rate limiting.

---

## Source Reference
* Authoritative Specification: [.ai/TECH_STACK.md](../../.ai/TECH_STACK.md) and [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
