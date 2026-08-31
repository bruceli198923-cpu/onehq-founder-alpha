const storeKey = "onehq-founder-alpha-v1";

const seed = {
  activeCompanyId: "onehq",
  companies: [
    {
      id: "onehq",
      name: "OneHQ",
      purpose: "Build the AI-native Company Operating System for founders.",
      type: "Dogfood company",
      ceo: { name: "Mira Chen", style: "Decisive operator, product-first, careful with founder authority." },
      budget: 1240,
      brain: {
        knowledge: ["OneHQ is not an Agent Builder.", "Every company owns its CEO, Brain, Workforce, Projects, Memory and authority boundary."],
        principles: ["Founder / Chairman is the highest authority.", "AI CEO recommends; Founder hires, fires and grants authority.", "No task is complete without a real deliverable."],
        decisions: ["V1 will prioritize Founder Alpha usability over marketplace, templates or heavy 3D.", "Money and Legal require Founder approval by default."],
        lessons: ["Real usage is the best product review.", "Living Office must mirror task state, not decorative avatars."],
        feedback: ["Reduce SaaS form feeling.", "Make CEO command the primary control surface."]
      },
      employees: [
        employee("e1", "Mira Chen", "AI CEO", "Executive", "Founder", "Running company operating cadence", "CEO Orchestrator", "full_except_money_legal"),
        employee("e2", "Ari Tan", "Chief Product Architect", "Product", "AI CEO", "Founder Alpha system model", "GPT-5.6 Product", "recommend_and_draft"),
        employee("e3", "Noah Park", "Engineering Lead", "Technology", "AI CEO", "Prototype implementation plan", "Codex", "build_and_review_code"),
        employee("e4", "Leah Stone", "Growth Strategist", "Growth", "AI CEO", "Founder onboarding narrative", "Research Router", "market_research"),
        employee("e5", "Iris Wu", "Company Memory Lead", "Brain", "AI CEO", "Brain taxonomy and training intake", "Long-memory Synthesizer", "memory_write_proposal")
      ],
      projects: [
        project("p1", "Founder Alpha Operating Loop", "Design and test the core OneHQ loop from CEO command to reviewed deliverable.", "in_progress", ["e2", "e3", "e5"], 67)
      ],
      deliverables: [
        deliverable("d1", "Founder Alpha Product Constitution", "Decision", "OneHQ must behave like a company operating system, where AI employees are role-based operating units, not model wrappers.", "approved", ["Ari Tan", "Mira Chen"])
      ],
      approvals: [
        approval("a1", "Money", "Approve $500 model-routing budget for deeper product architecture runs.", "pending", "AI CEO")
      ],
      tools: [
        tool("t1", "Codex", "Build, edit and review the OneHQ codebase.", "Technology", "medium", ["e3"]),
        tool("t2", "GitHub", "Store source code, issues, pull requests and engineering history.", "Technology", "medium", ["e3"]),
        tool("t3", "OpenAI API", "Route staff tasks to language, reasoning and multimodal engines.", "Executive", "high", ["e1", "e2"]),
        tool("t4", "Browser", "Research public pages and inspect web products.", "Growth", "low", ["e4"])
      ],
      activity: [
        activity("AI CEO initialized OneHQ as Bruce's first dogfood company."),
        activity("Company Brain loaded product philosophy and Founder constraints."),
        activity("Founder Alpha project is active with Product, Engineering and Brain staff assigned.")
      ]
    },
    {
      id: "venture-lab",
      name: "Venture Lab",
      purpose: "Explore new founder-led AI business ideas.",
      type: "Portfolio company",
      ceo: { name: "Selene Rao", style: "Market-aware, analytical, low-drama." },
      budget: 380,
      brain: {
        knowledge: ["This company explores opportunities before incorporation."],
        principles: ["Validate demand before building.", "Founder approves capital commitments."],
        decisions: ["Keep Venture Lab separate from OneHQ dogfood operations."],
        lessons: ["Early research should end in a clear go/no-go memo."],
        feedback: []
      },
      employees: [
        employee("v1", "Selene Rao", "AI CEO", "Executive", "Founder", "Waiting for next venture thesis", "CEO Orchestrator", "full_except_money_legal"),
        employee("v2", "Kai Morgan", "Research Analyst", "Strategy", "AI CEO", "Market scan queue", "Research Router", "research")
      ],
      projects: [],
      deliverables: [],
      approvals: [],
      tools: [
        tool("vt1", "Research Browser", "Research market and competitor signals.", "Strategy", "low", ["v2"])
      ],
      activity: [activity("Venture Lab is ready for a Founder thesis.")]
    }
  ]
};

function employee(id, name, role, dept, reportsTo, currentTask, engine, authority) {
  return {
    id, name, role, dept, reportsTo, currentTask, engine, authority,
    sop: ["Receive task contract", "Produce work product", "Self-review", "Handoff to manager or CEO"],
    memory: [`${name} created for ${dept} responsibilities.`],
    performance: { quality: 88, speed: 82, rework: 11 }
  };
}

function project(id, name, summary, status, team, progress) {
  return {
    id, name, summary, status, team, progress,
    phase: status === "completed" ? "CEO reviewed" : "Execution",
    tasks: [
      { title: "Clarify intent", state: "completed" },
      { title: "Plan operating team", state: "completed" },
      { title: "Produce reviewed deliverable", state: status === "completed" ? "completed" : "in_progress" }
    ]
  };
}

function deliverable(id, title, type, summary, status, reviewers) {
  return {
    id, title, type, summary, status, reviewers,
    createdAt: new Date().toLocaleString(),
    content: [
      `Executive Summary: ${summary}`,
      "",
      "Task Contract: Founder intent was converted into a company-level objective with assigned owner, context, success criteria and authority boundary.",
      "Handoff: Employee work products were reviewed by manager-level role and escalated to AI CEO where appropriate.",
      "QA: Completion requires a visible artifact, explicit review chain and a decision or next action.",
      "Founder Decision Requested: Approve, revise, or train the company with feedback."
    ].join("\n")
  };
}

function approval(id, type, text, status, requestedBy) {
  return { id, type, text, status, requestedBy, createdAt: new Date().toLocaleString() };
}

function tool(id, name, purpose, owner, risk, allowedEmployees) {
  return {
    id, name, purpose, owner, risk, allowedEmployees,
    status: risk === "high" ? "requires_founder_approval" : "available",
    audit: [`${name} registered for ${owner}.`]
  };
}

function activity(text) {
  return { id: crypto.randomUUID(), text, at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
}

let state = load();

function load() {
  try {
    const saved = localStorage.getItem(storeKey);
    return saved ? JSON.parse(saved) : structuredClone(seed);
  } catch {
    return structuredClone(seed);
  }
}

function save() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}

function company() {
  return state.companies.find(c => c.id === state.activeCompanyId) || state.companies[0];
}

function byId(id) {
  return document.getElementById(id);
}

function render() {
  const c = company();
  byId("companyName").textContent = c.name;
  byId("companyType").textContent = c.type;
  byId("ceoName").textContent = c.ceo.name;
  renderCompanies();
  renderBriefing();
  renderActivity();
  renderMetrics();
  renderProjects();
  renderApprovals();
  renderOffice();
  renderTools();
  renderDeliverables();
  renderBrain();
  renderGovernance();
  save();
}

function renderTools() {
  const c = company();
  byId("toolList").innerHTML = (c.tools || []).map(t => {
    const staff = (t.allowedEmployees || []).map(id => c.employees.find(e => e.id === id)?.name).filter(Boolean).join(", ") || t.owner;
    return `
      <article class="tool-card">
        <div>
          <small>${escapeHtml(t.owner)} / ${escapeHtml(t.status.replaceAll("_", " "))}</small>
          <h3>${escapeHtml(t.name)}</h3>
          <p>${escapeHtml(t.purpose)}</p>
          <div class="tag-row">
            <span class="tag ${t.risk === "high" ? "blocked" : t.risk === "medium" ? "review" : "done"}">${escapeHtml(t.risk)} risk</span>
            <span class="tag">Allowed: ${escapeHtml(staff)}</span>
          </div>
        </div>
        ${t.status === "requires_founder_approval" ? `<button class="quiet-btn" data-enable-tool="${t.id}">Approve</button>` : `<button class="quiet-btn" data-tool-audit="${t.id}">Audit</button>`}
      </article>
    `;
  }).join("") || `<article class="tool-card"><div><h3>No tools registered</h3><p>Add capabilities that AI staff may request and use under company authority.</p></div></article>`;
}

function renderCompanies() {
  byId("companyList").innerHTML = state.companies.map(c => `
    <button class="company-item ${c.id === state.activeCompanyId ? "active" : ""}" data-company="${c.id}">
      <span class="company-dot"></span>
      <span><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.purpose)}</small></span>
    </button>
  `).join("");
}

function renderBriefing() {
  const c = company();
  const active = c.projects.filter(p => p.status !== "completed").length;
  const pending = c.approvals.filter(a => a.status === "pending").length;
  const latest = c.deliverables[0]?.title || "No deliverables yet";
  byId("briefing").innerHTML = `
    <strong>${c.ceo.name} briefing</strong><br>
    ${c.name} has ${active} active project${active === 1 ? "" : "s"}, ${c.employees.length} AI staff, ${c.deliverables.length} reviewed deliverable${c.deliverables.length === 1 ? "" : "s"}, and ${pending} Founder approval${pending === 1 ? "" : "s"} waiting.<br>
    Latest result: ${escapeHtml(latest)}.
  `;
}

function renderActivity() {
  byId("activityFeed").innerHTML = company().activity.slice(0, 12).map(item => `
    <article class="feed-item"><time>${item.at}</time><p>${escapeHtml(item.text)}</p></article>
  `).join("");
}

function renderMetrics() {
  const c = company();
  const avg = c.employees.length ? Math.round(c.employees.reduce((sum, e) => sum + e.performance.quality, 0) / c.employees.length) : 0;
  byId("metrics").innerHTML = [
    ["Companies", state.companies.length],
    ["Active Projects", c.projects.filter(p => p.status !== "completed").length],
    ["AI Workforce", c.employees.length],
    ["Deliverables", c.deliverables.length],
    ["Quality", `${avg}%`]
  ].map(([label, value]) => `<article class="metric"><span>${label}</span><strong>${value}</strong></article>`).join("");
}

function renderProjects() {
  const c = company();
  byId("projectList").innerHTML = c.projects.length ? c.projects.map(p => {
    const team = p.team.map(id => c.employees.find(e => e.id === id)?.name).filter(Boolean).join(", ");
    return `
      <article class="project-card">
        <small>${p.phase} / ${p.progress}%</small>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.summary)}</p>
        <div class="tag-row">
          <span class="tag ${p.status === "completed" ? "done" : ""}">${p.status.replace("_", " ")}</span>
          <span class="tag review">${escapeHtml(team || "CEO only")}</span>
        </div>
      </article>
    `;
  }).join("") : `<article class="project-card"><h3>No active projects</h3><p>Talk to the company AI CEO to create work from a natural-language goal.</p></article>`;
}

function renderApprovals() {
  const c = company();
  byId("approvalList").innerHTML = c.approvals.length ? c.approvals.map(a => `
    <article class="approval-card">
      <small>${a.type} / requested by ${a.requestedBy}</small>
      <h3>${escapeHtml(a.text)}</h3>
      <div class="tag-row">
        <span class="tag ${a.status === "pending" ? "blocked" : "done"}">${a.status}</span>
        ${a.status === "pending" ? `<button class="quiet-btn" data-approve="${a.id}">Approve</button>` : ""}
      </div>
    </article>
  `).join("") : `<article class="approval-card"><h3>Clear</h3><p>No money or legal decision is waiting for Founder approval.</p></article>`;
}

function renderOffice(selectedId) {
  const c = company();
  byId("officeFloor").innerHTML = c.employees.map((e, index) => `
    <article class="desk">
      <div class="person" style="background:${["#0f6b5f","#245c9a","#b58a2b","#7a4f9a","#b7442e"][index % 5]}">${initials(e.name)}</div>
      <strong>${escapeHtml(e.name)}</strong>
      <small>${escapeHtml(e.role)} / ${escapeHtml(e.dept)}</small>
      <p>${escapeHtml(e.currentTask)}</p>
      <button data-employee="${e.id}">Inspect ${escapeHtml(e.name)}</button>
    </article>
  `).join("");
  const selected = c.employees.find(e => e.id === selectedId) || c.employees[0];
  byId("employeeInspector").innerHTML = selected ? `
    <div class="avatar">${initials(selected.name)}</div>
    <h2>${escapeHtml(selected.name)}</h2>
    <small>${escapeHtml(selected.role)} reports to ${escapeHtml(selected.reportsTo)}</small>
    <div class="tag-row">
      <span class="tag">${escapeHtml(selected.engine)}</span>
      <span class="tag review">${escapeHtml(selected.authority)}</span>
    </div>
    <h3>Current Task</h3>
    <p>${escapeHtml(selected.currentTask)}</p>
    <h3>SOP</h3>
    <p>${selected.sop.map(escapeHtml).join(" -> ")}</p>
    <h3>Memory</h3>
    <p>${selected.memory.map(escapeHtml).join(" ")}</p>
    <button class="primary-btn" data-talk="${selected.id}">Talk</button>
  ` : "";
}

function renderDeliverables() {
  const c = company();
  byId("deliverableList").innerHTML = c.deliverables.length ? c.deliverables.map(d => `
    <article class="deliverable-card">
      <div>
        <small>${d.type} / ${d.createdAt}</small>
        <h3>${escapeHtml(d.title)}</h3>
        <p>${escapeHtml(d.summary)}</p>
        <div class="tag-row">
          <span class="tag ${d.status === "approved" ? "done" : "review"}">${d.status}</span>
          <span class="tag">Reviewed by ${escapeHtml(d.reviewers.join(" -> "))}</span>
        </div>
      </div>
      <button class="quiet-btn" data-toggle-deliverable="${d.id}">View Work</button>
      <pre hidden id="deliverable-${d.id}">${escapeHtml(d.content)}</pre>
    </article>
  `).join("") : `<article class="deliverable-card"><div><h3>No deliverables yet</h3><p>Send a CEO command and let the company produce a reviewed result.</p></div></article>`;
}

function renderBrain() {
  const c = company();
  byId("trainingTarget").innerHTML = `<option value="company">Company Brain</option>` + c.employees.map(e => `<option value="${e.id}">${escapeHtml(e.name)} / ${escapeHtml(e.role)}</option>`).join("");
  const labels = { knowledge: "Knowledge", principles: "Founder / Business Principles", decisions: "Decisions", lessons: "Experience / Lessons", feedback: "Feedback" };
  byId("brainColumns").innerHTML = Object.entries(labels).map(([key, label]) => `
    <article class="brain-card">
      <h3>${label}</h3>
      <ul>${(c.brain[key] || []).map(item => `<li>${escapeHtml(item)}</li>`).join("") || "<li>Empty</li>"}</ul>
    </article>
  `).join("");
}

function renderGovernance() {
  const rows = [
    ["Money", "Founder approval required by default"],
    ["Legal", "Founder approval required by default"],
    ["Hiring / firing AI staff", "Founder decides; AI CEO recommends"],
    ["Project creation", "AI CEO may create from Founder command"],
    ["Task assignment", "AI CEO and managers may assign within company boundary"],
    ["Memory write", "Allowed with traceable source and Founder feedback channel"],
    ["External publication", "Escalate unless company grants explicit authority"]
  ];
  byId("authorityMatrix").innerHTML = rows.map(([scope, rule]) => `
    <article class="matrix-card"><strong>${scope}</strong><p>${rule}</p></article>
  `).join("");
}

function sendCommand() {
  const input = byId("commandInput");
  const text = input.value.trim();
  if (!text) return;
  const c = company();
  const projectId = crypto.randomUUID();
  const productLead = c.employees.find(e => e.role.includes("Product")) || c.employees[1] || c.employees[0];
  const techLead = c.employees.find(e => e.role.includes("Engineering")) || c.employees[0];
  const memoryLead = c.employees.find(e => e.dept === "Brain") || c.employees[0];
  const team = [...new Set([productLead?.id, techLead?.id, memoryLead?.id].filter(Boolean))];
  const title = inferTitle(text);
  c.projects.unshift(project(projectId, title, text, "in_progress", team, 18));
  const availableTools = (c.tools || []).filter(t => t.status === "available").map(t => t.name).slice(0, 3);
  team.forEach(id => {
    const e = c.employees.find(member => member.id === id);
    if (e) {
      e.currentTask = `Working on ${title}`;
      e.memory.unshift(`Assigned by ${c.ceo.name}: ${text.slice(0, 120)}`);
    }
  });
  c.activity.unshift(activity(`Founder command received. ${c.ceo.name} created project "${title}", assigned ${team.length} staff, and opened a deliverable contract.`));
  if (availableTools.length) c.activity.unshift(activity(`CEO capability routing: ${availableTools.join(", ")} available for this project under current authority.`));
  c.activity.unshift(activity("CEO protocol: intent parsed -> project created -> team assembled -> review chain scheduled."));
  input.value = "";
  render();
}

function advanceWork() {
  const c = company();
  const p = c.projects.find(projectItem => projectItem.status !== "completed");
  if (!p) {
    c.activity.unshift(activity(`${c.ceo.name}: No active project to advance. Send me a new objective.`));
    render();
    return;
  }
  p.progress = Math.min(100, p.progress + 27);
  if (p.progress >= 100) {
    p.status = "completed";
    p.phase = "CEO reviewed";
    p.tasks.forEach(t => t.state = "completed");
    const d = deliverable(crypto.randomUUID(), `${p.name} - Reviewed Founder Brief`, "Report / PRD / Decision Memo", `CEO-reviewed output for ${p.summary}`, "ready_for_founder", [teamNames(c, p), c.ceo.name].filter(Boolean));
    c.deliverables.unshift(d);
    c.brain.lessons.unshift(`Completed ${p.name}: every project must end in a reviewable artifact and a Founder decision.`);
    c.activity.unshift(activity(`${c.ceo.name} completed CEO review and produced deliverable "${d.title}".`));
  } else if (p.progress >= 72) {
    p.phase = "Manager review";
    c.activity.unshift(activity(`${p.name} moved into manager review. Rework loop is open before CEO sign-off.`));
  } else {
    c.activity.unshift(activity(`${p.name} advanced to ${p.progress}%. Staff work products updated and handed off.`));
  }
  render();
}

function teamNames(c, p) {
  return p.team.map(id => c.employees.find(e => e.id === id)?.name).filter(Boolean).join(" -> ");
}

function saveTraining() {
  const text = byId("trainingInput").value.trim();
  if (!text) return;
  const c = company();
  const target = byId("trainingTarget").value;
  if (target === "company") {
    c.brain.feedback.unshift(text);
    c.activity.unshift(activity("Founder trained the Company Brain. Feedback is now part of future CEO context."));
  } else {
    const e = c.employees.find(member => member.id === target);
    if (e) {
      e.memory.unshift(text);
      c.activity.unshift(activity(`Founder trained ${e.name}. Employee memory updated.`));
    }
  }
  byId("trainingInput").value = "";
  render();
}

function createCompany() {
  const name = byId("companyNameInput").value.trim();
  const purpose = byId("companyPurposeInput").value.trim();
  if (!name) return;
  const id = slug(name);
  state.companies.unshift({
    id, name, purpose: purpose || "Founder-defined company.",
    type: "Portfolio company",
    ceo: { name: `${name} AI CEO`, style: "Founder-aligned operator." },
    budget: 0,
    brain: { knowledge: [], principles: ["Founder is highest authority."], decisions: [], lessons: [], feedback: [] },
    employees: [employee(`${id}-ceo`, `${name} AI CEO`, "AI CEO", "Executive", "Founder", "Setting up company operating system", "CEO Orchestrator", "full_except_money_legal")],
    projects: [], deliverables: [], approvals: [],
    tools: [tool(`${id}-router`, "Dynamic AI Router", "Route work to approved AI engines and agent tools.", "Executive", "high", [`${id}-ceo`])],
    activity: [activity(`${name} created with independent CEO, Brain, Workforce, Projects and authority boundary.`)]
  });
  state.activeCompanyId = id;
  byId("companyDialog").close();
  render();
}

function createTool() {
  const c = company();
  const name = byId("toolNameInput").value.trim();
  const purpose = byId("toolPurposeInput").value.trim();
  if (!name || !purpose) return;
  const owner = byId("toolOwnerInput").value.trim() || "Executive";
  const risk = byId("toolRiskInput").value;
  const ownerEmployee = c.employees.find(e => e.dept.toLowerCase() === owner.toLowerCase() || e.role.toLowerCase().includes(owner.toLowerCase())) || c.employees[0];
  const newTool = tool(`${slug(name)}-${crypto.randomUUID().slice(0, 6)}`, name, purpose, owner, risk, ownerEmployee ? [ownerEmployee.id] : []);
  c.tools = c.tools || [];
  c.tools.unshift(newTool);
  if (risk === "high") {
    c.approvals.unshift(approval(crypto.randomUUID(), "Tool Access", `Approve ${name} for ${owner}. Purpose: ${purpose}`, "pending", c.ceo.name));
  }
  c.activity.unshift(activity(`${name} added to ${c.name}'s Tool Registry with ${risk} risk policy.`));
  ["toolNameInput", "toolPurposeInput", "toolOwnerInput"].forEach(idValue => byId(idValue).value = "");
  byId("toolRiskInput").value = "low";
  byId("toolDialog").close();
  render();
}

function createEmployee() {
  const c = company();
  const name = byId("employeeNameInput").value.trim();
  const role = byId("employeeRoleInput").value.trim();
  if (!name || !role) return;
  const dept = byId("employeeDeptInput").value.trim() || "Founder-defined";
  const reportsTo = byId("employeeReportsInput").value.trim() || c.ceo.name;
  const task = byId("employeeTaskInput").value.trim() || `Own ${role} responsibilities for ${c.name}`;
  const engine = byId("employeeEngineInput").value.trim() || "Dynamic AI Router";
  const authority = byId("employeeAuthorityInput").value.trim() || "recommend_and_execute_within_scope";
  const id = `${slug(name)}-${crypto.randomUUID().slice(0, 6)}`;
  c.employees.push(employee(id, name, role, dept, reportsTo, task, engine, authority));
  c.activity.unshift(activity(`Founder hired ${name} as ${role}. ${c.ceo.name} may now assign work within the employee's authority.`));
  byId("employeeDialog").close();
  ["employeeNameInput", "employeeRoleInput", "employeeDeptInput", "employeeReportsInput", "employeeTaskInput", "employeeEngineInput", "employeeAuthorityInput"].forEach(idValue => byId(idValue).value = "");
  render();
}

function inferTitle(text) {
  const cleaned = text.replace(/[。！？.!?]/g, " ").trim();
  const words = cleaned.split(/\s+/).slice(0, 10).join(" ");
  if (words.length <= 34) return words || "Founder Objective";
  return `${words.slice(0, 34)}...`;
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || crypto.randomUUID();
}

function initials(name) {
  return name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-view]");
  if (nav) {
    document.querySelectorAll(".nav-item").forEach(button => button.classList.toggle("active", button === nav));
    document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === nav.dataset.view));
  }
  const companyBtn = event.target.closest("[data-company]");
  if (companyBtn) {
    state.activeCompanyId = companyBtn.dataset.company;
    render();
  }
  const employeeBtn = event.target.closest("[data-employee]");
  if (employeeBtn) renderOffice(employeeBtn.dataset.employee);
  const approveBtn = event.target.closest("[data-approve]");
  if (approveBtn) {
    const item = company().approvals.find(a => a.id === approveBtn.dataset.approve);
    if (item) item.status = "approved";
    company().activity.unshift(activity(`Founder approved ${item.type}: ${item.text}`));
    render();
  }
  const enableToolBtn = event.target.closest("[data-enable-tool]");
  if (enableToolBtn) {
    const t = (company().tools || []).find(item => item.id === enableToolBtn.dataset.enableTool);
    if (t) {
      t.status = "available";
      t.audit.unshift(`Founder approved ${t.name}.`);
      company().activity.unshift(activity(`Founder approved tool access: ${t.name}.`));
      render();
    }
  }
  const auditToolBtn = event.target.closest("[data-tool-audit]");
  if (auditToolBtn) {
    const t = (company().tools || []).find(item => item.id === auditToolBtn.dataset.toolAudit);
    if (t) {
      alert(`${t.name} audit:\n\n${t.audit.join("\n")}`);
    }
  }
  const toggle = event.target.closest("[data-toggle-deliverable]");
  if (toggle) {
    const pre = byId(`deliverable-${toggle.dataset.toggleDeliverable}`);
    if (pre) pre.hidden = !pre.hidden;
  }
  const talk = event.target.closest("[data-talk]");
  if (talk) {
    const e = company().employees.find(member => member.id === talk.dataset.talk);
    byId("commandInput").value = `请 ${e.name} 以 ${e.role} 的身份向 CEO 汇报当前工作、风险和下一步需要的 deliverable。`;
    document.querySelector('[data-view="command"]').click();
  }
});

byId("sendCommandBtn").addEventListener("click", sendCommand);
byId("advanceWorkBtn").addEventListener("click", advanceWork);
byId("saveTrainingBtn").addEventListener("click", saveTraining);
byId("newCompanyBtn").addEventListener("click", () => byId("companyDialog").showModal());
byId("createCompanySubmit").addEventListener("click", createCompany);
byId("hireEmployeeBtn").addEventListener("click", () => byId("employeeDialog").showModal());
byId("createEmployeeSubmit").addEventListener("click", createEmployee);
byId("addToolBtn").addEventListener("click", () => byId("toolDialog").showModal());
byId("createToolSubmit").addEventListener("click", createTool);
byId("newProjectBtn").addEventListener("click", () => {
  byId("commandInput").value = "请你作为公司 AI CEO，根据当前公司目标自主创建一个高杠杆项目，组建团队，定义交付物，并在需要 Founder 批准的地方升级给我。";
  document.querySelector('[data-view="command"]').click();
});
byId("trainCompanyBtn").addEventListener("click", () => document.querySelector('[data-view="brain"]').click());
byId("resetBtn").addEventListener("click", () => {
  if (confirm("Reset Founder Alpha local data?")) {
    localStorage.removeItem(storeKey);
    state = structuredClone(seed);
    render();
  }
});
byId("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(company(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${company().name}-onehq-snapshot.json`;
  link.click();
  URL.revokeObjectURL(url);
});
byId("attachmentInput").addEventListener("change", event => {
  const files = [...event.target.files].map(file => file.name);
  if (files.length) {
    company().activity.unshift(activity(`Founder attached ${files.length} file(s): ${files.join(", ")}. CEO will treat them as training/context for this command.`));
    render();
  }
});

render();
