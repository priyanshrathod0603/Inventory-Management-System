# Deployment Environments

## 1. Environment Topology

| Environment | Purpose | Database | Base URLs |
| :--- | :--- | :--- | :--- |
| **Development** | Local engineering and unit testing | Local Docker PostgreSQL (`localhost:5432`) | API: `http://localhost:3001`<br/>Web: `http://localhost:3000` |
| **Staging** | Pre-production QA & integration validation | Managed Staging PostgreSQL instance | Configured via staging env |
| **Production** | Live retail counter operations | High-availability PostgreSQL with automated backups | Configured via production env |

---

## Source Reference
* Authoritative Specification: [.ai/TECH_STACK.md](../../.ai/TECH_STACK.md)
