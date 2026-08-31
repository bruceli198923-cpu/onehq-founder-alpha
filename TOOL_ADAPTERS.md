# Tool Adapters

Tool adapters turn AI staff from visual roles into functional operators.

## Adapter Interface

```ts
type ToolAdapter = {
  id: string;
  name: string;
  capabilities: string[];
  riskLevel: "low" | "medium" | "high";
  requiredAuthority: string[];
  inputSchema: unknown;
  outputSchema: unknown;
  estimateCost(input: unknown): Promise<ToolCost>;
  execute(context: ToolExecutionContext, input: unknown): Promise<ToolResult>;
};
```

## Execution Context

```ts
type ToolExecutionContext = {
  founderId: string;
  companyId: string;
  projectId?: string;
  taskId?: string;
  employeeId: string;
  employeeRole: string;
  authorityGrantIds: string[];
  auditId: string;
};
```

## First Tool Categories

### GitHub

Purpose:

- Create and update source files.
- Open issues.
- Review pull requests.
- Read repository history.
- Attach code work to deliverables.

Founder controls:

- Repo access.
- Branch write access.
- Merge authority.
- Public release approval.

### Codex

Purpose:

- Execute engineering tasks.
- Modify code.
- Run tests.
- Produce implementation summaries.

Founder controls:

- Which repository or worktree can be changed.
- Whether Codex may commit, open PRs or deploy.

### OpenAI API

Purpose:

- Route work to language, reasoning, coding, multimodal and voice models.
- Power AI CEO planning and employee execution.

Founder controls:

- Budget.
- Model tiers.
- Data policy.
- Tool-call approval thresholds.

### Browser / Research

Purpose:

- Inspect public web pages.
- Research competitors.
- Collect market references.

Founder controls:

- Domains allowed.
- Whether findings may be stored in Company Brain.
- Whether browsing can trigger external actions.

### Documents

Purpose:

- Generate reports, PRDs, memos and board packs.
- Convert deliverables into files.

Founder controls:

- External sharing.
- Legal or financial document approval.

## Execution Flow

```text
Employee requests capability
  AI CEO checks task contract
  Authority matrix checks risk
  Tool adapter estimates cost
  Founder approval if required
  Tool executes
  Audit log records result
  Work product enters review
  Deliverable is produced
```
