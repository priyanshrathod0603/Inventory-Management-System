# Environment Variables Reference

This document catalogs all environment variables used across IMS.

## 1. Backend Environment Variables (`apps/api`)

| Variable | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | String | Yes | PostgreSQL connection string with schema parameter | `postgresql://user:pass@host:5432/sms_db?schema=public` |
| `PORT` | Number | No | Port for the NestJS API server (default `3001`) | `3001` |
| `NODE_ENV` | String | No | Application runtime environment (`development`, `production`) | `production` |
| `SESSION_SECRET` | String | Yes | 64-character secret key used to sign session cookies | `random-64-character-hex-string` |
| `SESSION_EXPIRY_DAYS`| Number | No | Maximum validity duration for remember-me sessions | `30` |
| `REDIS_HOST` | String | No | Redis host for caching and background queues | `localhost` |
| `REDIS_PORT` | Number | No | Redis port (default `6379`) | `6379` |
| `CORS_ORIGIN` | String | No | Allowed frontend origin for CORS | `http://localhost:3000` |

---

## 2. Frontend Environment Variables (`apps/web`)

| Variable | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL`| String | Yes | Public REST API base URL accessible from browser | `http://localhost:3001/api/v1` |

---

## Source Reference
* Template File: [.env.example](../../.env.example)
* Security Policy: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
