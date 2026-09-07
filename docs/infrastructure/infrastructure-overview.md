# Infrastructure Overview

## 1. Scope & Architecture
IMS is designed to run on self-hosted Linux/macOS server hardware, on-premises retail server nodes, or cloud virtual private servers (VPS) using standard Docker containerization.

## 2. Infrastructure Components
* **Host OS**: Linux (Ubuntu 22.04+ / Debian 12+) or macOS.
* **Containers**: Docker Engine & Docker Compose.
* **Database Engine**: PostgreSQL 16+ on dedicated volume storage.
* **In-Memory Cache**: Redis 7 on dedicated volume storage.
* **Reverse Proxy**: NGINX / Caddy handling SSL termination and routing `/api/v1` to NestJS and `/` to Next.js.

---

## Source Reference
* Authoritative Specification: [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
* Infrastructure Plan: [.ai/TECH_STACK.md](../../.ai/TECH_STACK.md)
