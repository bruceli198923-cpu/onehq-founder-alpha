# OneHQ Architecture Notes

## Product Identity

OneHQ is a company operating layer. The main object is not an agent. The main object is a company.

```text
Founder Account
  Company
    AI CEO
    Company Brain
    AI Workforce
    Projects
    Tasks
    Deliverables
    Tool Registry
    Authority Matrix
    Audit Log
```

## Data Boundaries

Each company must keep separate:

- CEO identity and operating style
- Brain entries
- Workforce roster
- Project and task state
- Deliverables
- Approvals
- Tool access
- Memory
- Audit history

The platform assistant may help with setup and product usage, but must not operate a company.

## AI Employee Model

An AI Employee is not a model.

```text
AI Employee =
  Role
  + Responsibilities
  + Knowledge
  + SOP
  + Memory
  + Authority
  + Tools
  + AI Engines
  + Performance
```

The same employee may route work to different AI engines or agent tools depending on task type, cost, risk and required quality.

## Agent Protocol

### Task Contract

- Goal
- Owner
- Context
- Success criteria
- Authority boundary
- Required inputs
- Expected deliverable

### Handoff Contract

- From
- To
- Reason
- Current state
- Work products
- Open risks
- Next decision

### Deliverable Contract

- Type
- Executive summary
- Source tasks
- Review chain
- Evidence
- Decision requested

### Review

- Employee self-review
- Manager review when applicable
- AI CEO review
- Rework loop
- Founder approval when required

### Escalation

Escalate to Founder by default for:

- Money
- Legal
- Sensitive data access
- External publication
- Tool access above granted authority
- Low confidence or irreversible actions

## Tool System

The Tool Registry is company-scoped. AI staff can request and use tools only within their company authority.

Tool adapters should eventually expose:

- `id`
- `name`
- `capabilities`
- `risk_level`
- `required_authority`
- `input_schema`
- `output_schema`
- `cost_model`
- `audit_policy`
- `execution_handler`

Every tool call should record:

- Company
- Project
- Task
- Employee
- Tool
- AI engine
- Reason
- Inputs summary
- Outputs summary
- Cost
- Status
- Review state
