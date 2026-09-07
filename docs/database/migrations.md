# Database Migrations Guide

## 1. Migration Strategy
IMS uses **Prisma Migrate** to manage declarative, version-controlled PostgreSQL schema migrations.

## 2. Standard Migration Workflow

### Generating Migrations in Development:
```bash
# From workspace root
pnpm --filter @ims/api prisma:migrate
```
* Generates a new migration SQL file in `apps/api/prisma/migrations/<timestamp>_<migration_name>/migration.sql`.
* Automatically regenerates the Prisma Client.

### Applying Migrations in Staging / Production:
```bash
pnpm --filter @ims/api exec prisma migrate deploy
```

---

## 3. Migration Safety Rules
* **Never Edit Historical Migrations**: Once committed, previous migration folders are immutable.
* **Pre-Migration Backup**: Production database migrations must always be preceded by an automated `pg_dump` snapshot.
* **Zero Destructive Drops**: Renaming columns must use structured transition migrations rather than simple drop/create cycles to avoid data loss.

---

## Source Reference
* Authoritative Specification: [.ai/DATABASE.md](../../.ai/DATABASE.md)
