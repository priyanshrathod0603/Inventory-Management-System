# Technology Stack

## Frontend
* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* TanStack Query
* React Hook Form
* Zod

Important:
Next.js does NOT replace React.
Next.js is the React framework used by the project.
The frontend is therefore:
Next.js + React + TypeScript
## Backend
* NestJS
* TypeScript

The backend must use a modular architecture.
Major business modules should remain separated logically, including areas such as:
* Auth
* Users
* Roles
* Permissions
* Products
* Categories
* Brands
* Customers
* Suppliers
* Sales
* Purchases
* Inventory
* Payments
* Returns
* Invoices
* Reports
* Notifications
* Audit
* Settings

Do not create unnecessary modules that are not required by the project requirements.
## Database
* PostgreSQL

PostgreSQL is the primary production database.
The system is relational and requires strong transactional consistency for:
* sales
* purchases
* inventory
* stock movements
* payments
* returns
* invoices
* customers
* suppliers
* reporting

Database integrity is more important than convenience.
## ORM
* Prisma ORM

Prisma will be the primary ORM/database access layer for the NestJS backend.
Raw SQL may be used only when justified for complex reporting, performance-critical queries, PostgreSQL-specific functionality, or other documented reasons.
Do not bypass the data-access architecture unnecessarily.
## Authentication
Use secure server-side/session-based authentication.
Preferred implementation:
* Secure cookies
* HttpOnly
* Secure in production
* Appropriate SameSite policy
* Server-side authentication/session validation
Do NOT store authentication tokens in localStorage by default.
Authentication and authorization must follow the existing security rules.
## Authorization
Use:
* RBAC
* Granular permissions
Roles include the project’s existing roles such as:
* Admin
* Manager
* Staff
Authorization must be enforced on the backend/server side.
Frontend permission checks are only for UI/UX and must NEVER be treated as the security boundary.
## API
* REST API
* OpenAPI / Swagger documentation

The backend is the authoritative business/API layer.
Frontend must consume the defined API contracts rather than duplicating business logic.
Existing .ai/API_CONTRACTS.md remains authoritative for API conventions.
## POS
The POS will be a web-based application using the Next.js frontend and NestJS backend.
Primary barcode strategy:
* USB barcode scanners
* Bluetooth barcode scanners
* Keyboard-style scanner input
Camera barcode scanning can be introduced later if required.
Do not add unnecessary POS hardware dependencies at this stage.
POS priority:
Product search/barcode
→ Cart
→ Quantity
→ Discount
→ Tax
→ Payment
→ Sale confirmation
→ Invoice/receipt
The final sale operation must preserve transactional consistency.
## Inventory
Inventory must preserve historical stock movement information.
Do NOT rely only on a mutable product stock number without historical movement tracking.
Important inventory events include:
* Purchase
* Sale
* Sale return
* Purchase return
* Stock adjustment
* Transfer
* Other approved inventory movements
Inventory-changing operations must be transactionally consistent with the related business operation.
## Sales / Financial Integrity
Critical business operations must be transactional.
For example, a sale may involve:
* Sale record
* Sale items
* Stock reduction
* Stock movement
* Payment
* Customer history
* Profit/reporting data where applicable
* Invoice/receipt generation workflow
The system must not leave partially completed financial/inventory operations.
Do not silently delete financial records.
Use appropriate cancellation/void/return mechanisms with reasons, user information, timestamps, and audit history according to the existing project rules.
## Reporting
Reports should be generated primarily on the backend using PostgreSQL/database-level aggregation where appropriate.
Do not send huge raw datasets to the browser and perform important financial/business calculations only on the frontend.
Reporting architecture may use:
* SQL queries
* Aggregations
* Database views
* Materialized views where justified
Do not introduce a separate analytics database unless the project genuinely requires it.
## Cache
* Redis

But Redis is NOT mandatory for every feature.
Introduce caching only where it provides a real benefit, such as:
* frequently accessed data
* sessions if required
* rate limiting
* temporary state
* expensive repeated reads
* other justified workloads
Do not introduce unnecessary infrastructure.
## Background Jobs / Queues
* BullMQ
* Redis

Use background jobs for tasks such as:
* PDF generation when appropriate
* Email delivery
* WhatsApp notifications
* large report generation
* scheduled jobs
* other non-critical asynchronous work

IMPORTANT:
Core POS, payment, inventory, and database correctness must NOT depend on an asynchronous queue.
Critical transactional business operations must complete transactionally in the main backend/database flow.
## Invoices / PDF
Invoice numbers must be generated by the server.
Invoice generation must be reliable and auditable.
Use server-side PDF generation.
Support the project’s required printing formats, including:
* A4 invoice
* 58mm thermal receipt
* 80mm thermal receipt
Printing should remain compatible with browser/OS/printer environments rather than unnecessarily tying the system to a single printer vendor.
## Email
Email should be implemented through an abstraction/adapter so the provider can be changed without rewriting business logic.
Use a transactional email provider in production.
Do not hard-code provider-specific logic throughout the application.
## WhatsApp
WhatsApp integration should use the official WhatsApp Business Platform/API.
Use an adapter/service abstraction so notification logic is separated from the core business modules.
Do not couple sales/invoice business logic directly to one WhatsApp provider implementation.
## Testing
Use:
Unit Testing
* Jest
API / Integration Testing
* Jest
* Supertest
End-to-End Testing
* Playwright
Critical workflows should receive strong automated test coverage, especially:
* authentication
* permissions
* product operations
* sales
* purchases
* inventory
* stock movements
* payments
* returns
* invoice generation
* critical reporting
## Deployment
* Docker
* GitHub Actions / CI/CD
* Development environment
* Staging environment
* Production environment
Prefer managed PostgreSQL in production when appropriate.
Redis should be deployed only where required.
## Existing Dockerfile — Important
The repository ALREADY contains a Dockerfile.
DO NOT create a replacement Dockerfile blindly.
First inspect the existing Dockerfile and existing Docker-related configuration.
Preserve the existing Docker setup unless changes are genuinely required by the finalized technology stack.
If the Dockerfile needs modification:
* make the minimum required changes
* preserve existing valid configuration
* do not unnecessarily rewrite it
* document the relevant Docker decision in the existing project documentation
* update .ai/FILE_MAP.md only if the repository structure actually requires it
Also inspect existing files such as:
* Dockerfile
* docker-compose files if present
* .dockerignore
* infrastructure configuration
* CI/CD configuration
* environment configuration
Do not create duplicate Docker infrastructure.

Note: Upon inspection, no Dockerfile currently exists in the repository. When Docker configuration is added, it should follow the approved technology stack.
## Package Management
* pnpm
Use a workspace/monorepo approach if this is consistent with the existing repository architecture.
Do not restructure an existing repository merely to introduce a monorepo.
## Architectural Principle
Frontend → Backend → Database → ORM flow
The frontend (Next.js) communicates with the backend (NestJS) via REST API. The backend handles all business logic and communicates with the database (PostgreSQL) through the ORM layer (Prisma). This separation ensures maintainability, scalability, and clear responsibility boundaries.
## Future AI Readiness
The application should be AI-ready, but DO NOT introduce unnecessary AI infrastructure now.
Do NOT add:
* Python service
* FastAPI service
* vector database
* ML infrastructure
* LLM infrastructure
* separate AI database
unless there is an actual current requirement.
The core architecture should simply remain extensible for future AI capabilities.
Future possibilities may include:
* dashboard summaries
* demand forecasting
* inventory predictions
* reorder recommendations
* natural-language reports
* AI assistant/chatbot
* sales analysis
If future ML workloads genuinely require Python, a separate Python/FastAPI AI service may be introduced later without replacing the core Next.js/NestJS/PostgreSQL architecture.
AI must never become the source of truth for:
* stock
* payments
* invoices
* financial records
* permissions
* core business transactions
AI recommendations should initially require appropriate human/business approval.
If the existing repository already follows a different valid structure, preserve it and document the approved structure.