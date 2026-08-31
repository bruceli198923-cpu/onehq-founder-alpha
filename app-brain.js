(function () {
  if (window.__ONEHQ_NATIVE_BRAIN) return;

  let selectedStaffId = null;
  let brainMode = "local-ui";

  function bootBrainLayer() {
    injectBrainUi();
    wireCommandBrain();
    wireStaffBrain();
    checkBrain();
  }

  function injectBrainUi() {
    if (!document.getElementById("brainLayerStyles")) {
      document.head.insertAdjacentHTML("beforeend", `
        <style id="brainLayerStyles">
          .mode-chip{min-height:38px;display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:8px;padding:0 12px;color:var(--muted);background:rgba(255,255,255,.56);font-size:13px}
          .staff-chat-card{width:min(760px,calc(100vw - 32px))}
          .transcript{max-height:320px;overflow:auto;display:grid;gap:10px}
          .message{border:1px solid var(--line);border-radius:8px;padding:12px;background:white;white-space:pre-wrap;line-height:1.55}
          .message strong{display:block;margin-bottom:6px}
          .message.founder{background:#f7f8f6}
        </style>
      `);
    }
    const topActions = document.querySelector(".top-actions");
    if (topActions && !document.getElementById("aiEngineBtn")) {
      const button = document.createElement("button");
      button.id = "aiEngineBtn";
      button.className = "quiet-btn";
      button.textContent = "AI Engine";
      topActions.insertBefore(button, topActions.firstElementChild?.nextSibling || topActions.firstElementChild);
    }
    if (topActions && !document.getElementById("brainMode")) {
      const chip = document.createElement("span");
      chip.id = "brainMode";
      chip.className = "mode-chip";
      chip.textContent = "Brain: checking";
      topActions.insertBefore(chip, topActions.lastElementChild);
    }
    if (!document.getElementById("staffDialog")) {
      document.body.insertAdjacentHTML("beforeend", `
        <dialog id="staffDialog">
          <form method="dialog" class="dialog-card staff-chat-card">
            <h3 id="staffDialogTitle">Talk to Staff</h3>
            <div id="staffTranscript" class="transcript"></div>
            <textarea id="staffMessageInput" rows="4" placeholder="Ask this AI employee to think, report, or execute a scoped task..."></textarea>
            <div class="command-actions">
              <button id="runStaffTaskBtn" class="quiet-btn">Execute Task</button>
              <button id="sendStaffMessageBtn" class="primary-btn">Send</button>
            </div>
          </form>
        </dialog>
      `);
    }
    if (!document.getElementById("aiEngineDialog")) {
      document.body.insertAdjacentHTML("beforeend", `
        <dialog id="aiEngineDialog">
          <form method="dialog" class="dialog-card">
            <h3>AI Engine</h3>
            <input id="apiKeyInput" type="password" placeholder="OpenAI API Key">
            <input id="modelInput" placeholder="Model, e.g. gpt-4.1-mini">
            <p class="dialog-note">Key is stored only in this browser session for local testing. It is not written to GitHub or local files.</p>
            <div class="command-actions">
              <button id="clearEngineBtn" class="quiet-btn danger">Clear</button>
              <button id="saveEngineBtn" class="primary-btn">Connect</button>
            </div>
          </form>
        </dialog>
      `);
    }
  }

  function wireCommandBrain() {
    const oldButton = document.getElementById("sendCommandBtn");
    if (!oldButton) return;
    const button = oldButton.cloneNode(true);
    oldButton.replaceWith(button);
    button.addEventListener("click", sendCommandWithBrain);
  }

  function wireStaffBrain() {
    document.addEventListener("click", event => {
      const talk = event.target.closest("[data-talk]");
      if (!talk) return;
      event.preventDefault();
      event.stopPropagation();
      const employeeItem = company().employees.find(member => member.id === talk.dataset.talk);
      if (employeeItem) openStaffDialog(employeeItem);
    }, true);
    document.getElementById("sendStaffMessageBtn")?.addEventListener("click", event => {
      event.preventDefault();
      sendStaffMessage(false);
    });
    document.getElementById("runStaffTaskBtn")?.addEventListener("click", event => {
      event.preventDefault();
      sendStaffMessage(true);
    });
    document.getElementById("aiEngineBtn")?.addEventListener("click", () => {
      const settings = engineSettings();
      document.getElementById("apiKeyInput").value = settings.apiKey;
      document.getElementById("modelInput").value = settings.model;
      document.getElementById("aiEngineDialog").showModal();
    });
    document.getElementById("saveEngineBtn")?.addEventListener("click", event => {
      event.preventDefault();
      const apiKey = document.getElementById("apiKeyInput").value.trim();
      const model = document.getElementById("modelInput").value.trim() || "gpt-4.1-mini";
      if (apiKey) sessionStorage.setItem("onehq-openai-api-key", apiKey);
      sessionStorage.setItem("onehq-openai-model", model);
      brainMode = apiKey ? `openai:${model}` : "local-brain";
      document.getElementById("aiEngineDialog").close();
      renderBrainMode();
    });
    document.getElementById("clearEngineBtn")?.addEventListener("click", event => {
      event.preventDefault();
      sessionStorage.removeItem("onehq-openai-api-key");
      sessionStorage.removeItem("onehq-openai-model");
      brainMode = "local-brain";
      document.getElementById("aiEngineDialog").close();
      renderBrainMode();
    });
  }

  async function sendCommandWithBrain() {
    const input = document.getElementById("commandInput");
    const text = input.value.trim();
    if (!text) return;
    const currentCompany = company();
    input.value = "";
    currentCompany.activity.unshift(activity(`${currentCompany.ceo.name} is thinking with company brain, staff roles, authority and tool access...`));
    render();
    const result = await api("/api/company-command", { company: currentCompany, command: text });
    if (!result?.ok) {
      input.value = text;
      window.sendCommand?.();
      return;
    }
    if (result.project) currentCompany.projects.unshift(result.project);
    if (result.deliverable) currentCompany.deliverables.unshift(result.deliverable);
    (result.employeeUpdates || []).forEach(update => {
      const employeeItem = currentCompany.employees.find(e => e.id === update.id);
      if (!employeeItem) return;
      if (update.currentTask) employeeItem.currentTask = update.currentTask;
      if (update.memory) employeeItem.memory.unshift(update.memory);
    });
    (result.brainLessons || []).forEach(lesson => currentCompany.brain.lessons.unshift(lesson));
    (result.activity || []).forEach(textItem => currentCompany.activity.unshift(activity(textItem)));
    brainMode = result.mode || brainMode;
    render();
    renderBrainMode();
  }

  function openStaffDialog(employeeItem) {
    selectedStaffId = employeeItem.id;
    document.getElementById("staffDialogTitle").textContent = `${employeeItem.name} / ${employeeItem.role}`;
    document.getElementById("staffTranscript").innerHTML = `
      <div class="message"><strong>${escapeHtml(employeeItem.name)}</strong>${escapeHtml(staffIntro(employeeItem))}</div>
    `;
    document.getElementById("staffMessageInput").value = "";
    document.getElementById("staffDialog").showModal();
  }

  async function sendStaffMessage(executeTask) {
    const currentCompany = company();
    const employeeItem = currentCompany.employees.find(e => e.id === selectedStaffId);
    const input = document.getElementById("staffMessageInput");
    const message = input.value.trim();
    if (!employeeItem || !message) return;
    appendMessage("Founder", message, true);
    input.value = "";
    appendMessage(employeeItem.name, "Working...");
    const result = await api(executeTask ? "/api/run-task" : "/api/staff-chat", executeTask
      ? { company: currentCompany, employee: employeeItem, task: message }
      : { company: currentCompany, employee: employeeItem, message });
    removeWorkingMessage();
    if (!result?.ok) {
      appendMessage(employeeItem.name, "I can discuss this in UI fallback mode, but the working brain server is not connected. Open http://localhost:4177 for real execution.");
      return;
    }
    brainMode = result.mode || brainMode;
    if (result.reply) appendMessage(employeeItem.name, result.reply);
    if (result.memory) employeeItem.memory.unshift(result.memory);
    if (result.deliverable) {
      currentCompany.deliverables.unshift(result.deliverable);
      appendMessage(employeeItem.name, `Produced deliverable: ${result.deliverable.title}`);
    }
    if (result.activity) currentCompany.activity.unshift(activity(result.activity));
    render();
    renderBrainMode();
  }

  function staffIntro(employeeItem) {
    return [
      `Current task: ${employeeItem.currentTask}`,
      `Engine: ${employeeItem.engine}`,
      `Authority: ${employeeItem.authority}`,
      "I can discuss the work, or execute a scoped task and produce a deliverable."
    ].join("\n");
  }

  function appendMessage(author, text, founder = false) {
    const transcript = document.getElementById("staffTranscript");
    transcript.insertAdjacentHTML("beforeend", `<div class="message ${founder ? "founder" : ""}"><strong>${escapeHtml(author)}</strong>${escapeHtml(text)}</div>`);
    transcript.scrollTop = transcript.scrollHeight;
  }

  function removeWorkingMessage() {
    const messages = [...document.querySelectorAll("#staffTranscript .message")];
    const last = messages[messages.length - 1];
    if (last && last.textContent.includes("Working...")) last.remove();
  }

  async function api(path, payload) {
    if (location.protocol === "file:") return null;
    try {
      const settings = engineSettings();
      const headers = { "Content-Type": "application/json" };
      if (settings.apiKey) headers["x-onehq-openai-key"] = settings.apiKey;
      if (settings.model) headers["x-onehq-model"] = settings.model;
      const response = await fetch(path, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }

  async function checkBrain() {
    if (location.protocol === "file:") {
      brainMode = "local-ui";
      renderBrainMode();
      return;
    }
    try {
      const settings = engineSettings();
      const headers = {};
      if (settings.apiKey) headers["x-onehq-openai-key"] = settings.apiKey;
      if (settings.model) headers["x-onehq-model"] = settings.model;
      const response = await fetch("/api/health", { headers });
      const data = await response.json();
      brainMode = settings.apiKey ? `openai:${settings.model}` : data.mode || "local-brain";
    } catch {
      brainMode = "local-ui";
    }
    renderBrainMode();
  }

  function renderBrainMode() {
    const label = document.getElementById("brainMode");
    if (label) label.textContent = `Brain: ${brainMode}`;
  }

  function engineSettings() {
    return {
      apiKey: sessionStorage.getItem("onehq-openai-api-key") || "",
      model: sessionStorage.getItem("onehq-openai-model") || "gpt-4.1-mini"
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootBrainLayer);
  } else {
    bootBrainLayer();
  }
})();
