# Networking Specification

## 1. Network Topology & Ports

| Service | Internal Container Port | Host Port | Protocol | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Next.js Web** | `3000` | `3000` | HTTP/HTTPS | Frontend user interface |
| **NestJS API** | `3001` | `3001` | HTTP/HTTPS | REST API and Swagger docs |
| **PostgreSQL** | `5432` | `5432` | TCP | Relational database connection |
| **Redis** | `6379` | `6379` | TCP | In-memory cache & queues |

---

## 2. Security & CORS Rules
* Internal database and Redis ports should be bound to `127.0.0.1` on production hosts to prevent external access.
* CORS headers are restricted to the authorized domain name configured in `CORS_ORIGIN`.

---

## Source Reference
* Authoritative Specification: [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
