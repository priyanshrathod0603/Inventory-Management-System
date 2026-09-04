# Monitoring & Observability

## 1. Health Checks
* **Endpoint**: `GET /api/v1/health`
* **Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-09-04T20:58:37.000Z",
  "service": "sms-api",
  "environment": "production"
}
```
* **Docker Healthcheck**: Automated health checks configured in `docker-compose.yml` verifying container readiness.

## 2. Advanced APM / Distributed Tracing
* **Status**: Planned / Not yet implemented.

---

## Source Reference
* Authoritative Specification: [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
