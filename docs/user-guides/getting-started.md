# Getting Started Guide

## 1. Quick Start for Developers

### Prerequisites:
* **Node.js**: v20+ or v24
* **pnpm**: v11+
* **Docker**: Desktop / Engine

### Setup Instructions:
```bash
# 1. Clone the project repository
git clone <repository_url>
cd SMS

# 2. Copy environment file
cp .env.example .env

# 3. Start local database services
docker compose up -d

# 4. Install all workspace dependencies
pnpm install

# 5. Generate Prisma client
pnpm --filter @sms/api prisma:generate

# 6. Run the applications in development mode
# Terminal 1: Backend API (runs on port 3001)
pnpm run dev:api

# Terminal 2: Frontend Web (runs on port 3000)
pnpm run dev:web
```

---

## 2. Default Access Points
* **Web UI**: `http://localhost:3000`
* **Backend API**: `http://localhost:3001/api/v1`
* **Swagger API Docs**: `http://localhost:3001/api/docs`
* **Health Check**: `http://localhost:3001/api/v1/health`

---

## Source Reference
* Authoritative Specification: [.ai/PROJECT_CONTEXT.md](../../.ai/PROJECT_CONTEXT.md)
