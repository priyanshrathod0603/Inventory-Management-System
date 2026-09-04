# Rollback Strategy

## 1. Application Rollback
* In containerized environments, redeploy the previous tagged Docker image tag (e.g. `sms-api:v1.0.2` → `sms-api:v1.0.1`).
* Instant container swap maintains continuous uptime.

## 2. Database Migration Rollback
* **Safety Rule**: Never run destructive down-migrations in production without a pre-migration `pg_dump` snapshot.
* If a migration fails or causes regression:
  1. Restore the pre-migration database snapshot.
  2. Revert the API container to the previous compatible version.
  3. Log incident in audit log.

---

## Source Reference
* Authoritative Specification: [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
