# Hosting Strategy

## 1. Hosting Architecture
* **Status**: Configured via Docker Compose for Development/Staging; Cloud/Bare-metal production platform selection is **Planned / Not yet defined**.
* **Containerized Deployment Model**:
  * `sms-web`: Port `3000` (Next.js Application)
  * `sms-api`: Port `3001` (NestJS REST API Server)
  * `sms-postgres`: Port `5432` (PostgreSQL Database)
  * `sms-redis`: Port `6379` (Redis Cache & Session Store)

---

## Source Reference
* Authoritative Specification: [.ai/TECH_STACK.md](../../.ai/TECH_STACK.md)
