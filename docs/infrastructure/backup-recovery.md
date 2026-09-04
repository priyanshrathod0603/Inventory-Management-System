# Backup & Disaster Recovery

## 1. Automated Database Snapshot Policy
* **Tool**: PostgreSQL native `pg_dump`.
* **Frequency**: Nightly automated full snapshot.
* **Encryption**: Backups encrypted using AES-256 before storage.
* **Retention Schedule**:
  * 7 Daily snapshots
  * 4 Weekly archives
  * 12 Monthly archives

---

## 2. Recovery Procedure (Restore Drill)

```bash
# 1. Stop application containers to prevent active writes
docker compose stop api web

# 2. Decrypt backup archive
openssl enc -d -aes-256-cbc -in backup_20260904.sql.enc -out backup_20260904.sql

# 3. Restore database snapshot
cat backup_20260904.sql | docker exec -i sms-postgres psql -U postgres -d sms_db

# 4. Verify data integrity and restart containers
docker compose start api web
```

---

## Source Reference
* Authoritative Specification: [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
* Security Policy: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
