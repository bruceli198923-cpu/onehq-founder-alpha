# AI Staff Brain

Founder Alpha now includes a lightweight working brain layer.

## Modes

### Local Brain

If no `OPENAI_API_KEY` is configured, OneHQ uses a built-in local brain. It is deterministic, role-aware and company-aware. It can:

- Interpret Founder commands.
- Create project plans.
- Assign AI staff.
- Produce task contracts.
- Generate reviewed deliverables.
- Let Founder talk to individual AI employees.
- Let AI employees execute scoped tasks and produce work products.
- Write lessons and employee memory back into company state.

### OpenAI Adapter

If `OPENAI_API_KEY` is configured, the same endpoints call the OpenAI Responses API.

The current adapter uses:

```text
ONEHQ_MODEL or gpt-4.1-mini
```

## Endpoints

### `GET /api/health`

Returns current brain mode.

### `POST /api/company-command`

Turns a Founder command into:

- Project
- Task contracts
- Staff assignments
- Tool routing
- Deliverable
- Brain lessons
- Activity feed updates

### `POST /api/staff-chat`

Lets Founder talk directly to one AI employee. The response is generated from:

- Company purpose
- Company Brain
- Employee role
- Employee SOP
- Employee memory
- Authority boundary

### `POST /api/run-task`

Executes a scoped employee task and returns a work product deliverable.

## Important Boundary

The current system can think, plan, produce text work products and update company state. Real external actions such as writing GitHub files, browsing websites, generating documents, or running Codex worktrees still need dedicated tool adapters with credential and approval controls.
