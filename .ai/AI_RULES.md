# AI Rules & Development Constitution

This document is the permanent constitution governing all current and future AI coding agents working on the Inventory Management System (IMS) project.

## 1. Cardinal Rule: The .ai/ Project Brain is Supreme

The `.ai/` directory is the permanent single source of truth for all business requirements, architecture, technical stack decisions, database schemas, API contracts, security rules, and UI/UX design specifications.

1. **Never Assume**: Always read and verify against the `.ai/` documentation before planning, modifying code, or answering structural questions.
2. **User-Approved Decisions Win**: User-approved requirements and architectural decisions override generic AI suggestions, external prompt trends, and personal coding preferences.
3. **Preserve History**: Never delete or rewrite historical records, changelogs, or past decisions in `.ai/` files. Always update by appending and maintaining full chronological context.

---

## 2. Before Any Modification (Mandatory Pre-Flight)

Before writing or editing a single line of code or documentation, AI MUST:

1. Read `PROJECT_CONTEXT.md` for master scope and principles.
2. Read `PRODUCT_REQUIREMENTS.md` for detailed feature workflows and business rules.
3. Read `ARCHITECTURE.md` and `TECH_STACK.md` for technical boundaries.
4. Read `DATABASE.md` and `API_CONTRACTS.md` for relational schemas and endpoint contracts.
5. Read `UI_RULES.md` for locked design system, fonts, colors, and layout rules.
6. Read `SECURITY_RULES.md` and `CODING_RULES.md` for security and engineering standards.
7. Read `CURRENT_STATE.md` and `TASKS.md` to identify active stage and pending scope.
8. Inspect existing source code and directory structure to verify actual implementation reality.

---

## 3. Strict Scope & Layer Boundaries

* **Frontend vs. Backend Discipline**:
  * If a task is Backend-only: Inspect frontend contracts, but DO NOT modify frontend code.
  * If a task is Frontend-only: Inspect API contracts, but DO NOT modify backend controllers/services.
  * Cross-layer modifications require explicit justification and minimal scope.
* **Locked Visual Design System**:
  * The approved fonts (`Plus Jakarta Sans`, `IBM Plex Mono`), palette (Refined Indigo, Emerald, Amber, Rose), Top-Navigation layout, and Desktop-first scope are **STRICTLY LOCKED**.
  * Never introduce new fonts, dark themes, sidebars, mobile layouts, or neon glassmorphism.

---

## 4. Prohibition on Fake / Mock Data

* AI must NEVER generate fake business entities (fake products, fake invoices, demo numbers) or fake API success simulations when real functionality is expected.
* Render proper loading skeletons, clean empty states, or error retry states when data is absent.

---

## 5. Change Discipline & Non-Destructive Refactoring

* **Minimum Change Principle**: Make only the smallest change necessary to fulfill the authorized user request.
* **No Unsolicited "Cleanup"**: Do not refactor unrelated working components, rename files, upgrade dependencies, or restructure folders without explicit authorization.
* **No Silent Feature Removal**: Never remove fields, buttons, tables, routes, or permissions from existing specifications or code.

---

## 6. Post-Change Protocol (Mandatory After-Action)

Upon completing any development or documentation step, AI MUST:

1. Run the appropriate validation commands (typechecks, linting, automated tests) to verify zero regressions.
2. Verify that no secrets, credentials, or `.env` files are exposed.
3. Update `CURRENT_STATE.md` by appending the latest accurate state.
4. Update `TASKS.md` (move completed items to Completed; keep implementation tasks in Pending).
5. Update `CHANGELOG.md` with a chronological entry.
6. Update `SESSION_STATE.md` summarizing the session.
7. Record any newly established user decisions in `DECISIONS.md`.
8. Run `git status` and relevant `git diff` inspection commands to verify working tree changes.
9. Clearly report changed files and validation results to the user.
10. **STOP**. Do NOT stage, commit, or push changes automatically.

---

## 7. Git Safety & Version Control Rules

Git operations must remain under explicit human control.

The AI must NEVER automatically stage, commit, or push changes.

### Strictly Forbidden

The AI must NOT automatically execute:
* `git add .`
* `git add -A`
* `git add --all`
* `git commit`
* `git push`
* `git reset --hard`
* `git clean -fd`
* `git rebase`
* `git merge`
* `git cherry-pick`

The AI must also NOT:
* Automatically stage files
* Automatically create commits
* Automatically push to remote repositories
* Automatically rewrite Git history
* Automatically amend commits
* Automatically force-push
* Automatically delete branches
* Automatically modify remote configuration

### Allowed Git Operations

The AI MAY perform read-only Git inspection such as:
* `git status`
* `git branch`
* `git log`
* `git diff`
* `git diff --stat`
* `git diff --name-only`
* `git remote -v`
* `git show`
* `git ls-files`

These commands are allowed for understanding repository state and validating changes.

### After Making Code Changes

After completing requested changes, the AI must:
1. Run the appropriate validation commands.
2. Run `git status`.
3. Run relevant `git diff` / diff inspection.
4. Clearly report what files were changed.
5. Clearly report validation results.
6. **STOP**.

The AI must NOT stage or commit the changes automatically.

### Commit Policy

Git commits must be created manually by the human unless the human explicitly gives a direct instruction to create a commit.

For example, the AI may create a commit ONLY after an explicit instruction such as:
> *"Create a Git commit for these changes."*

Without such explicit permission:
* `git add`
* `git commit`
* `git push`

must NOT be executed.

### Staging Policy

* Never use `git add .` automatically.
* Never stage all repository files automatically.
* Never stage unrelated changes.
* If the human explicitly asks the AI to prepare a commit, the AI must first inspect the working tree and identify exactly which files belong to that commit.

### Push Policy

* Never push automatically.
* Even when a commit has been explicitly requested, pushing requires a separate explicit instruction.
* For example:
  * *"Create the commit, but do not push."* → means commit only.
  * *"Commit and push these changes."* → explicitly authorizes both operations.

### Destructive Git Operations

The AI must NEVER perform destructive Git operations without explicit confirmation.

This includes:
* `git reset --hard`
* `git clean`
* force push
* history rewriting
* deleting branches
* destructive rebases
* discarding uncommitted changes

If such an operation appears necessary, STOP and ask for explicit human approval.

### Mandatory Workflow Principle

The default workflow is:
```
Inspect
   ↓
Modify
   ↓
Validate
   ↓
git status
   ↓
git diff
   ↓
Report
   ↓
STOP
```

**NOT:**
```
Modify
   ↓
git add .
   ↓
git commit
   ↓
git push
```

The human owns Git history and release control.
The AI owns implementation and validation only unless explicitly authorized otherwise.