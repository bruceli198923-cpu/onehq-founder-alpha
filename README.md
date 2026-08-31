# OneHQ V1 - Founder Alpha

OneHQ is an AI-native Company Operating System for founders.

It is not an agent builder, chat wrapper, traditional project management tool, or virtual office game. The Founder / Chairman owns final authority. Each company has an independent AI CEO, Company Brain, AI Workforce, Projects, Deliverables, Memory, authority boundary, and tool access policy.

This repository starts with Founder Alpha: a local-first working prototype that makes the operating model testable before backend orchestration is connected.

## Core Loop

```text
Command -> Observe -> Deliver -> Govern
```

1. Founder talks to a company AI CEO.
2. AI CEO turns natural-language intent into projects, teams, task contracts and deliverable contracts.
3. AI staff execute through role, knowledge, SOP, memory, authority, tools, AI engines and performance.
4. Deliverables are reviewed before work is considered complete.
5. Money, legal, sensitive access and irreversible actions escalate to Founder approval.

## Current Alpha

- Local web app with a lightweight Node.js brain server.
- Multiple companies under one Founder account.
- Independent AI CEO, workforce, projects, brain, approvals and tools per company.
- CEO Command creates projects, task contracts and reviewed deliverables.
- AI staff can hold role-aware conversations.
- AI staff can execute scoped tasks and produce work products.
- Living Office reflects real task state.
- Deliverables Center stores reviewed results.
- Company Brain supports training company and employees.
- Tool Registry models external capability access for AI staff.

## Run

For full AI staff brain mode:

```bash
npm start
```

Then open:

```text
http://localhost:4177
```

Optional:

```bash
OPENAI_API_KEY=your_key npm start
```

Without an API key, OneHQ uses the built-in local Alpha brain. Opening `index.html` directly still works, but it runs in local UI fallback mode.

## GitHub Roadmap

The next phase is to move from local prototype to a GitHub-backed product codebase:

- Add a real application framework.
- Add database persistence and accounts.
- Deepen CEO Command orchestration beyond the current local brain/OpenAI adapter.
- Implement tool adapters for GitHub, Codex, OpenAI API, browser research and document generation.
- Add audit logging for every tool call.
- Add project deliverable storage and review workflow.
- Add deployment pipeline.
