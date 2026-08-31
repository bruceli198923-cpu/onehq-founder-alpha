const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const root = __dirname;
const port = Number(process.env.PORT || 4177);
const model = process.env.ONEHQ_MODEL || "gpt-4.1-mini";
const apiKey = process.env.OPENAI_API_KEY;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "GET" && url.pathname === "/api/health") {
      return json(res, { ok: true, mode: apiKey ? "openai" : "local-brain", model });
    }
    if (req.method === "POST" && url.pathname === "/api/company-command") {
      return json(res, await handleCompanyCommand(await readJson(req)));
    }
    if (req.method === "POST" && url.pathname === "/api/staff-chat") {
      return json(res, await handleStaffChat(await readJson(req)));
    }
    if (req.method === "POST" && url.pathname === "/api/run-task") {
      return json(res, await handleRunTask(await readJson(req)));
    }
    serveStatic(url.pathname, res);
  } catch (error) {
    json(res, { ok: false, error: error.message }, 500);
  }
});

server.listen(port, () => {
  console.log(`OneHQ Founder Alpha running at http://localhost:${port}`);
  console.log(`AI mode: ${apiKey ? `OpenAI ${model}` : "local-brain fallback"}`);
});

function serveStatic(requestPath, res) {
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(root, safePath));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}

async function handleCompanyCommand(payload) {
  const { company, command } = payload;
  const ceo = company.ceo?.name || "AI CEO";
  const staff = selectTeam(company, command);
  const tools = selectTools(company, command);
  const prompt = [
    `You are ${ceo}, the independent AI CEO of ${company.name}.`,
    `Company purpose: ${company.purpose}`,
    `Founder principles: ${(company.brain?.principles || []).join("; ")}`,
    `Knowledge: ${(company.brain?.knowledge || []).join("; ")}`,
    `Available staff: ${company.employees.map(e => `${e.name} (${e.role}, ${e.dept})`).join("; ")}`,
    `Available tools: ${tools.map(t => `${t.name} (${t.risk} risk)`).join("; ") || "none"}`,
    `Founder command: ${command}`,
    "Return a concise executive work plan with task contracts, team assignments, risks, and a deliverable summary."
  ].join("\n");

  const aiText = await complete(prompt, localCeoWork(company, command, staff, tools));
  const title = inferTitle(command);
  const deliverable = buildDeliverable(`${title} - CEO Work Brief`, "CEO Plan / Task Contracts", aiText, [staff.map(e => e.name).join(" -> "), ceo].filter(Boolean));

  return {
    ok: true,
    mode: apiKey ? "openai" : "local-brain",
    project: {
      id: id(), name: title, summary: command, status: "in_progress", team: staff.map(e => e.id), progress: 34, phase: "AI staff working",
      tasks: staff.map(e => ({ id: id(), title: `${e.role}: ${title}`, owner: e.id, state: "in_progress", expectedDeliverable: deliverable.title }))
    },
    deliverable,
    employeeUpdates: staff.map(e => ({ id: e.id, currentTask: `Executing task contract for ${title}`, memory: `${ceo} assigned task contract: ${command.slice(0, 160)}` })),
    brainLessons: [`${ceo} converted Founder command into task contracts and a reviewed deliverable: ${title}.`],
    activity: [
      `${ceo} understood the Founder command and opened a real work plan.`,
      `Team assigned: ${staff.map(e => e.name).join(", ") || ceo}.`,
      `Tools routed: ${tools.map(t => t.name).join(", ") || "No approved external tools needed yet"}.`,
      `Deliverable produced for review: ${deliverable.title}.`
    ]
  };
}

async function handleStaffChat(payload) {
  const { company, employee, message } = payload;
  const prompt = [
    `You are ${employee.name}, ${employee.role} in ${company.name}.`,
    `Department: ${employee.dept}. Reports to: ${employee.reportsTo}.`,
    `Responsibilities/current task: ${employee.currentTask}`,
    `Authority: ${employee.authority}`,
    `SOP: ${(employee.sop || []).join(" -> ")}`,
    `Memory: ${(employee.memory || []).slice(0, 6).join("; ")}`,
    `Company principles: ${(company.brain?.principles || []).join("; ")}`,
    `Founder asks: ${message}`,
    "Answer as this employee. Include current view, proposed action, risk, and deliverable you can produce."
  ].join("\n");
  return { ok: true, mode: apiKey ? "openai" : "local-brain", reply: await complete(prompt, localStaffReply(company, employee, message)), memory: `Founder conversation: ${message.slice(0, 140)}` };
}

async function handleRunTask(payload) {
  const { company, employee, task } = payload;
  const tools = selectTools(company, `${employee.role} ${task}`);
  const prompt = [
    `You are ${employee.name}, ${employee.role}. Execute this task for ${company.name}.`,
    `Task: ${task}`,
    `Use company brain: ${(company.brain?.knowledge || []).concat(company.brain?.principles || []).join("; ")}`,
    `Approved tools: ${tools.map(t => t.name).join(", ") || "none"}`,
    "Produce a practical work product, not a status update. Include assumptions, output, QA, and next decision."
  ].join("\n");
  const work = await complete(prompt, localTaskOutput(company, employee, task, tools));
  return { ok: true, mode: apiKey ? "openai" : "local-brain", deliverable: buildDeliverable(`${employee.name} Work Product`, "Employee Work Product", work, [employee.name]), memory: `Executed task: ${task.slice(0, 150)}`, activity: `${employee.name} executed a task and produced a work product.` };
}

async function complete(prompt, fallback) {
  if (!apiKey) return fallback;
  try {
    const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ model, input: prompt, max_output_tokens: 1200 }) });
    if (!response.ok) return `${fallback}\n\n[OpenAI adapter note: ${response.status} ${await response.text()}]`;
    const data = await response.json();
    return data.output_text || data.output?.flatMap(item => item.content || []).map(part => part.text).filter(Boolean).join("\n") || fallback;
  } catch (error) {
    return `${fallback}\n\n[OpenAI adapter note: ${error.message}]`;
  }
}

function selectTeam(company, command) {
  const text = command.toLowerCase();
  const employees = company.employees || [];
  const matches = employees.filter(e => `${e.name} ${e.role} ${e.dept} ${e.currentTask}`.toLowerCase().split(/\s+/).some(word => text.includes(word) && word.length > 3));
  const defaults = [employees.find(e => /product|architect/i.test(e.role)), employees.find(e => /engineer|technology|code/i.test(`${e.role} ${e.dept}`)), employees.find(e => /brain|memory/i.test(`${e.role} ${e.dept}`)), employees.find(e => /growth|research|strategy/i.test(`${e.role} ${e.dept}`))].filter(Boolean);
  return uniqueBy([...matches, ...defaults, employees[0]].filter(Boolean), "id").slice(0, 4);
}

function selectTools(company, command) {
  const text = command.toLowerCase();
  return (company.tools || []).filter(t => t.status === "available").filter(t => /build|code|github|research|browser|api|document|prd|report|market|tool/.test(text) || `${t.name} ${t.purpose} ${t.owner}`.toLowerCase().split(/\s+/).some(word => word.length > 4 && text.includes(word)));
}

function localCeoWork(company, command, staff, tools) {
  return [`Executive Summary: I will treat this as a company-level objective for ${company.name}, not as a chat request.`, "", `Founder Command: ${command}`, "", "Task Contracts:", ...staff.map((e, index) => `${index + 1}. ${e.name} / ${e.role}: produce a concrete work product using ${e.engine}; authority ${e.authority}.`), "", `Tool Routing: ${tools.length ? tools.map(t => `${t.name} (${t.risk})`).join(", ") : "No external tool is required before the first internal work product."}`, "", "Review Chain: employee self-review -> relevant manager/lead review -> AI CEO review -> Founder decision.", "", "Risks: unclear budget, legal exposure, sensitive data, or external publishing must be escalated before execution.", "", "Next Founder Decision: approve the plan, train the company with corrections, or ask a staff member to execute a narrower task."].join("\n");
}

function localStaffReply(company, employee, message) {
  return [`${employee.name} / ${employee.role}: I understand the request.`, "", `My current lens: ${employee.currentTask}`, `Company principle I will obey: ${(company.brain?.principles || ["Founder is highest authority."])[0]}`, "", `Proposed action: I can turn "${message}" into a specific work product, then hand it to ${employee.reportsTo} for review.`, "", "Risk: I will not spend money, make legal claims, publish externally, or access sensitive systems unless the authority matrix allows it.", "", "Deliverable I can produce: a scoped memo with assumptions, output, QA notes and next decision."].join("\n");
}

function localTaskOutput(company, employee, task, tools) {
  return [`Work Product by ${employee.name} / ${employee.role}`, "", `Task: ${task}`, "", "Assumptions:", `- Company: ${company.name}`, `- Authority: ${employee.authority}`, `- Tools available: ${tools.map(t => t.name).join(", ") || "none"}`, "", "Output:", `- Converted the task into a practical deliverable aligned with ${company.purpose}.`, "- Identified what can be done now versus what needs Founder approval.", "- Prepared this artifact for review rather than marking the task complete silently.", "", "QA:", "- Uses company brain context.", "- Names authority limits.", "- Produces an inspectable artifact.", "", "Next Decision:", "- CEO should review, then Founder can approve, revise, or train the employee."].join("\n");
}

function buildDeliverable(title, type, content, reviewers) {
  return { id: id(), title, type, summary: content.split("\n").find(Boolean)?.slice(0, 220) || title, status: "ready_for_founder", reviewers, createdAt: new Date().toLocaleString(), content };
}
function inferTitle(text) { const cleaned = text.replace(/[。！？.!?]/g, " ").trim(); const words = cleaned.split(/\s+/).slice(0, 10).join(" "); return words.length <= 42 ? words || "Founder Objective" : `${words.slice(0, 42)}...`; }
function uniqueBy(items, key) { const seen = new Set(); return items.filter(item => { if (seen.has(item[key])) return false; seen.add(item[key]); return true; }); }
function id() { return randomUUID(); }
function readJson(req) { return new Promise((resolve, reject) => { let body = ""; req.on("data", chunk => { body += chunk; if (body.length > 1_000_000) req.destroy(); }); req.on("end", () => resolve(body ? JSON.parse(body) : {})); req.on("error", reject); }); }
function json(res, data, status = 200) { res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" }); res.end(JSON.stringify(data, null, 2)); }
