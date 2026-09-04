# Storage Architecture

## 1. Persistent Volumes
* **PostgreSQL Storage**: Mounted to persistent volume `postgres_data:/var/lib/postgresql/data`.
* **Redis Cache Storage**: Mounted to persistent volume `redis_data:/data`.
* **Generated Document Storage**: Stored locally under `storage/invoices/` for generated vector A4 PDF files.

---

## 2. File Retention Policy
* Generated PDF invoices are cached on server disk with immutable filenames matching `invoiceNumber.pdf`.
* Local backups are stored in encrypted archives under `backups/`.

---

## Source Reference
* Authoritative Specification: [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
