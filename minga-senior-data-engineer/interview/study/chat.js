/* Study-guide tutor: a chat panel grounded in the guide on this page, plus a quiz mode.
   Uses the artifact `sample` capability (calls Claude on the viewer's own account). */
(function () {
  "use strict";

  var GUIDES = {
    sf: {
      name: "Snowflake Field Guide",
      summary: "Snowflake: a cloud data warehouse where storage and compute are separate. Compute comes from virtual warehouses (X-Small = 1 credit/hour, each size doubles; per-second billing with a 60-second minimum; AUTO_SUSPEND and AUTO_RESUME). No indexes: micro-partitions with min/max metadata enable pruning; clustering keys for big tables. Stitch loads RAW schemas with _sdc_ metadata columns; VARIANT holds JSON. Role-based access (LOADER, TRANSFORMER, REPORTER, ANALYST), masking and row access policies on Enterprise edition, key-pair auth for service users. Time Travel (1 day default, up to 90), Fail-safe 7 days, zero-copy clones.",
      starters: ["How is a virtual warehouse different from an Oracle instance?", "Walk me through how I'd find the cause of a cost spike.", "How would masking policies protect student names?"]
    },
    dbt: {
      name: "dbt Field Guide",
      summary: "dbt: the T in ELT. Models are SELECT statements in .sql files that dbt compiles and runs inside Snowflake. ref() and source() build the dependency graph. Layers: staging (stg_), intermediate (int_), marts (fct_/dim_). Materializations: view, table, incremental, ephemeral. Tests: unique, not_null, accepted_values, relationships, singular tests, unit tests, model contracts; source freshness on Stitch's _sdc_batched_at. Review workflow: dev schemas, pull requests, slim CI with state:modified+ and --defer. Snapshots (type 2 history), docs and exposures, grants as code, dbt Core vs dbt Cloud.",
      starters: ["Explain ref() like I know Oracle views.", "When should a model be incremental?", "What would slim CI look like for Minga?"]
    },
    af: {
      name: "Airflow Field Guide",
      summary: "Airflow: orchestration. Workflows are Python DAGs of tasks (operators, sensors, TaskFlow @task). The scheduler runs tasks when their schedule and upstream dependencies are met; workers execute; a metadata database stores state; Airflow 3 (April 2025) added a new UI, DAG versioning, assets and a Task Execution API, and catchup is off by default. Reliability: idempotent tasks, retries, timeouts, tested alerts, data intervals, secrets in Connections. Cosmos renders dbt models as tasks. Managed options: Astronomer, MWAA, Cloud Composer. Alternatives: Dagster (asset-centric), Prefect. n8n concepts map onto Airflow but are not the same tool.",
      starters: ["Why does Minga need orchestration if Stitch already has a schedule?", "What does idempotent mean for a pipeline task?", "Airflow or Dagster for a one-person data team?"]
    },
    py: {
      name: "Python Brush-Up",
      summary: "Python for data engineering: core syntax for an Oracle/C#/TypeScript developer (types, f-strings, comprehensions, type hints, truthiness, with, exceptions). Working with JSON and nested MongoDB-style documents, flattening dicts, UTC datetimes. Generators and itertools.batched for batching. Calling APIs with requests: cursor pagination (HubSpot paging.next.after), retries with exponential backoff, incremental loads by updated_since. DB-API with parameterized queries (never f-string SQL), snowflake-connector-python and write_pandas. pandas basics and when to push work into SQL instead. Idempotent, testable pipelines: pure functions, pytest, logging, config and secrets from the environment. Tooling: venv/uv, pyproject, ruff. Practice exercises: dedupe latest, flatten JSON, counts per school per day, validate a roster CSV, paginate an API.",
      starters: ["Quiz me on list and dict comprehensions.", "Why is an f-string SQL query dangerous, and what do I use instead?", "Walk me through writing a paginated API loader with retries."],
      note: "For this guide: his Python is pipeline and tooling scripting (for example a ~270-line generator that builds and deploys n8n workflows through a REST API), not years of Python-first data engineering. Never suggest he claim more than that."
    }
  };

  var MAX_TURNS = 12;

  var pageEl = document.querySelector(".page");
  if (!pageEl || !window.claude || typeof window.claude.use !== "function") return;
  var key = pageEl.classList.contains("dbt") ? "dbt" : pageEl.classList.contains("af") ? "af" : pageEl.classList.contains("py") ? "py" : "sf";
  var guide = GUIDES[key];

  /* ---------- Guide text extraction ---------- */
  var BLOCKS = "h1,h2,h3,p,li,pre,tr,figcaption,summary,blockquote,svg[aria-label]";
  function guideText() {
    var main = document.querySelector("main");
    if (!main) return "";
    var out = [];
    main.querySelectorAll(BLOCKS).forEach(function (el) {
      var parent = el.parentElement && el.parentElement.closest(BLOCKS);
      if (parent && main.contains(parent)) return;
      var tag = el.tagName.toLowerCase();
      var t;
      if (tag === "svg") { out.push("[Diagram: " + el.getAttribute("aria-label") + "]"); return; }
      if (tag === "tr") {
        t = Array.prototype.map.call(el.children, function (c) { return c.textContent.trim(); }).join(" | ");
      } else if (tag === "pre") {
        t = "```\n" + el.textContent.replace(/\s+$/, "") + "\n```";
      } else {
        t = el.textContent.replace(/\s+/g, " ").trim();
      }
      if (!t) return;
      if (tag === "h1") t = "# " + t;
      else if (tag === "h2") t = "\n## " + t;
      else if (tag === "h3") t = "### " + t;
      else if (tag === "li") t = "- " + t;
      else if (tag === "summary") t = "Flashcard Q: " + t;
      else if (tag === "figcaption") t = "Caption: " + t;
      out.push(t);
    });
    return out.join("\n");
  }

  function others() {
    return Object.keys(GUIDES).filter(function (k) { return k !== key; }).map(function (k) {
      return "- " + GUIDES[k].name + ": " + GUIDES[k].summary;
    }).join("\n");
  }

  var cachedText = null;
  function rules() {
    if (cachedText === null) cachedText = guideText();
    return [
      "You are a study tutor built into William Tucker's \"" + guide.name + "\". He is preparing for a Senior Data Engineer interview at Minga, a K-12 student behaviour platform whose data stack is Snowflake, Stitch and Metabase; the role would introduce dbt and orchestration. He is an experienced Oracle and PostgreSQL developer with 12 years of work around student data, but he has NOT used Snowflake, dbt or Airflow in production.",
      "",
      "Rules:",
      "1. Answer from the guide text below first. Mention the guide section by its heading when that helps him find it.",
      "2. If you add anything the guide does not cover, put it in a separate paragraph that starts with **Beyond the guide:** so he knows it is general knowledge. If you are not sure of a fact, say so.",
      "3. Never suggest he claim hands-on or production experience with Snowflake, dbt or Airflow. Interview phrasing must stay honest, in line with the guide's \"Keep it accurate\" notes.",
      "4. Write plain, direct English: short paragraphs, bullets where they help, short code in fenced blocks. Never use em dashes. Keep answers under about 250 words unless he asks for more.",
      "5. Oracle comparisons are welcome when they make an idea click.",
      guide.note ? "6. " + guide.note : "",
      "",
      "Other guides in the series (summaries only):",
      others(),
      "",
      "=== GUIDE TEXT: " + guide.name + " ===",
      cachedText,
      "=== END GUIDE TEXT ==="
    ].join("\n");
  }

  /* ---------- Small, safe markdown renderer ---------- */
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function inline(s) {
    var parts = s.split(/(`[^`]+`)/g);
    return parts.map(function (p) {
      if (/^`[^`]+`$/.test(p)) return "<code>" + esc(p.slice(1, -1)) + "</code>";
      return esc(p).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    }).join("");
  }
  function md(src) {
    var lines = src.replace(/\r/g, "").split("\n");
    var html = [], para = [], list = null, i = 0;
    function flushPara() { if (para.length) { html.push("<p>" + inline(para.join(" ")) + "</p>"); para = []; } }
    function flushList() { if (list) { html.push("<" + list.type + ">" + list.items.map(function (x) { return "<li>" + inline(x) + "</li>"; }).join("") + "</" + list.type + ">"); list = null; } }
    while (i < lines.length) {
      var line = lines[i];
      var fence = line.match(/^\s*```/);
      if (fence) {
        flushPara(); flushList();
        var code = []; i++;
        while (i < lines.length && !/^\s*```/.test(lines[i])) { code.push(lines[i]); i++; }
        html.push("<pre><code>" + esc(code.join("\n")) + "</code></pre>");
        i++; continue;
      }
      var h = line.match(/^#{1,4}\s+(.*)$/);
      var ul = line.match(/^\s*[-*]\s+(.*)$/);
      var ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
      if (h) { flushPara(); flushList(); html.push("<p class=\"chat-h\">" + inline(h[1]) + "</p>"); }
      else if (ul || ol) {
        flushPara();
        var type = ul ? "ul" : "ol";
        if (!list || list.type !== type) { flushList(); list = { type: type, items: [] }; }
        list.items.push((ul || ol)[1]);
      }
      else if (!line.trim()) { flushPara(); flushList(); }
      else if (list && /^\s{2,}\S/.test(line)) { list.items[list.items.length - 1] += " " + line.trim(); }
      else { flushList(); para.push(line.trim()); }
      i++;
    }
    flushPara(); flushList();
    return html.join("");
  }

  /* ---------- UI ---------- */
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }

  var launcher = el("button", { type: "button", class: "chat-launch", "aria-expanded": "false", "aria-controls": "chat-panel" }, "Ask this guide");
  launcher.hidden = true;

  var panel = el("section", { id: "chat-panel", class: "chat-panel", "aria-label": "Ask this guide" });
  panel.hidden = true;
  var head = el("div", { class: "chat-head" });
  var titles = el("div");
  titles.appendChild(el("p", { class: "chat-title" }, "Ask this guide"));
  titles.appendChild(el("p", { class: "chat-sub" }, "Answers come from the " + guide.name + ". Extras are labelled."));
  var closeBtn = el("button", { type: "button", class: "chat-icon", "aria-label": "Close" }, "×");
  head.appendChild(titles); head.appendChild(closeBtn);

  var tools = el("div", { class: "chat-tools" });
  var quizBtn = el("button", { type: "button", class: "chat-chip strong" }, "Quiz me");
  var clearBtn = el("button", { type: "button", class: "chat-chip" }, "Clear chat");
  tools.appendChild(quizBtn); tools.appendChild(clearBtn);

  var log = el("div", { class: "chat-log", "aria-live": "polite" });

  var form = el("form", { class: "chat-form" });
  var input = el("textarea", { id: "chat-input", rows: "2", placeholder: "Ask a question about this guide…", "aria-label": "Your question" });
  var sendBtn = el("button", { type: "submit", class: "chat-send" }, "Send");
  form.appendChild(input); form.appendChild(sendBtn);
  var note = el("p", { class: "chat-note" }, "Uses your own Claude usage. You'll be asked to allow it the first time.");

  panel.appendChild(head); panel.appendChild(tools); panel.appendChild(log); panel.appendChild(form); panel.appendChild(note);
  pageEl.appendChild(launcher); pageEl.appendChild(panel);

  /* ---------- State ---------- */
  var sample = null;
  var turns = [];          // chat history after the rules turn
  var busy = false;
  var ctl = null;
  var quiz = { awaiting: null, asked: [] };
  var disabled = false;

  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function bubble(role, content, isMd) {
    var b = el("div", { class: "chat-msg " + role });
    if (isMd) b.innerHTML = md(content); else b.textContent = content;
    log.appendChild(b); scrollDown();
    return b;
  }

  function showStarters() {
    if (log.children.length) return;
    var wrap = el("div", { class: "chat-starters" });
    wrap.appendChild(el("p", { class: "chat-sub" }, "Try one of these, or press Quiz me:"));
    guide.starters.forEach(function (q) {
      var b = el("button", { type: "button", class: "chat-chip" }, q);
      b.addEventListener("click", function () { input.value = q; send(); });
      wrap.appendChild(b);
    });
    log.appendChild(wrap);
  }
  function clearStarters() {
    var s = log.querySelector(".chat-starters");
    if (s) s.remove();
  }

  function setBusy(on) {
    busy = on;
    sendBtn.textContent = on ? "Stop" : "Send";
    sendBtn.type = on ? "button" : "submit";
    quizBtn.disabled = on || disabled;
    clearBtn.disabled = on;
    input.disabled = disabled;
  }

  function errorCopy(code) {
    switch (code) {
      case "not_granted": return "The chat needs permission to use Claude. The rest of the guide works without it.";
      case "sampling_disabled": return "Claude isn't available for this account, so the chat is off.";
      case "rate_limited": return "Too many questions too fast, or you've hit your usage limit. Wait a bit and try again.";
      case "session_expired": return "Your Claude session expired. Sign in again, then reload this page.";
      case "prompt_too_large": return "That conversation got too long. Press Clear chat and ask again.";
      case "refused": return "Claude declined that one. Try rephrasing the question.";
      case "empty_completion": return "No answer came back. Try asking in a simpler way.";
      case "invalid_json": return "The quiz question didn't come through properly. Press Quiz me again.";
      default: return "Something went wrong reaching Claude. Try again in a moment.";
    }
  }
  var PERMANENT = ["not_granted", "sampling_disabled", "not_declared", "capability_disabled", "capability_removed"];

  function handleError(e, b) {
    var code = (e && e.code) || "upstream_error";
    if (code === "cancelled") {
      if (e.text) { b.innerHTML = md(e.text); b.appendChild(el("p", { class: "chat-flag" }, "Stopped.")); }
      else b.remove();
      return null;
    }
    if (e.text && code !== "refused") { b.innerHTML = md(e.text); b.appendChild(el("p", { class: "chat-flag" }, "Interrupted. " + errorCopy(code))); }
    else { b.className = "chat-msg system"; b.textContent = errorCopy(code); }
    if (PERMANENT.indexOf(code) !== -1) {
      disabled = true;
      input.placeholder = "Chat unavailable";
    }
    return e.text && code !== "refused" ? e.text : null;
  }

  function recent() { return turns.slice(-MAX_TURNS); }

  async function run(input0, b, opts) {
    ctl = new AbortController();
    setBusy(true);
    try {
      var res = await sample(input0, Object.assign({
        cache: false,
        signal: ctl.signal,
        onText: function (u) { b.classList.remove("thinking"); b.innerHTML = md(u.text); scrollDown(); }
      }, opts || {}));
      b.classList.remove("thinking");
      b.innerHTML = md(res.text);
      if (res.truncated) b.appendChild(el("p", { class: "chat-flag" }, "Cut short. Ask for less at a time."));
      return res.text;
    } catch (e) {
      b.classList.remove("thinking");
      return handleError(e, b);
    } finally {
      ctl = null;
      setBusy(false);
      scrollDown();
    }
  }

  function thinkingBubble() {
    var b = bubble("assistant thinking", "Thinking…", false);
    return b;
  }

  async function send() {
    if (busy || disabled) return;
    var q = input.value.trim();
    if (!q) return;
    input.value = "";
    clearStarters();
    bubble("user", q, false);

    if (quiz.awaiting) return grade(q);

    turns.push({ role: "user", content: q });
    var b = thinkingBubble();
    var text = await run([{ role: "user", content: rules() }].concat(recent()), b);
    if (text) turns.push({ role: "assistant", content: text });
  }

  async function askQuiz() {
    if (busy || disabled) return;
    clearStarters();
    var b = thinkingBubble();
    ctl = new AbortController();
    setBusy(true);
    try {
      var avoid = quiz.asked.length ? "\nDo not repeat or closely rephrase any of these:\n- " + quiz.asked.join("\n- ") : "";
      var data = await sample.json(rules() +
        "\n\nTask: write ONE interview question a hiring manager at Minga might ask about this guide's topic, answerable from the guide. Vary between concepts, practical scenarios and \"how would you\" questions." + avoid +
        "\nReply with only JSON like {\"question\": \"...\"}.",
        { cache: false, signal: ctl.signal, modelTier: "quick" });
      var q = data && typeof data.question === "string" ? data.question.trim() : "";
      if (!q) throw { code: "invalid_json" };
      quiz.awaiting = q;
      quiz.asked.push(q);
      b.classList.remove("thinking");
      b.className = "chat-msg assistant quiz";
      b.innerHTML = "";
      b.appendChild(el("p", { class: "chat-flag" }, "Quiz question"));
      b.appendChild(el("p", null, q));
      b.appendChild(el("p", { class: "chat-sub" }, "Type your answer below, as you'd say it in the interview."));
      turns.push({ role: "assistant", content: "Quiz question: " + q });
      input.placeholder = "Your answer…";
      input.focus();
    } catch (e) {
      b.classList.remove("thinking");
      handleError(e, b);
    } finally {
      ctl = null;
      setBusy(false);
      scrollDown();
    }
  }

  async function grade(answer) {
    var q = quiz.awaiting;
    quiz.awaiting = null;
    input.placeholder = "Ask a question about this guide…";
    turns.push({ role: "user", content: "My answer to the quiz question: " + answer });
    var b = thinkingBubble();
    var prompt = rules() +
      "\n\nTask: he was asked this interview question:\n" + q +
      "\n\nHis answer:\n" + answer +
      "\n\nGrade it against the guide, kindly and specifically. Use exactly this format:\n" +
      "**Verdict:** Strong, Good start, or Needs work, plus one sentence.\n" +
      "**What you got right:** short bullets.\n" +
      "**What's missing or off:** short bullets.\n" +
      "**A stronger way to say it:** 3 to 5 sentences in his own plain voice. Where it matters, stay honest that he hasn't used the tool in production.";
    var text = await run(prompt, b);
    if (text) {
      turns.push({ role: "assistant", content: text });
      var next = el("button", { type: "button", class: "chat-chip strong" }, "Next question");
      next.addEventListener("click", function () { next.remove(); askQuiz(); });
      log.appendChild(next); scrollDown();
    }
  }

  /* ---------- Events ---------- */
  function openPanel() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    launcher.hidden = true;
    showStarters();
    input.focus();
  }
  function closePanel() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.hidden = false;
    launcher.focus();
  }
  launcher.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  panel.addEventListener("keydown", function (e) { if (e.key === "Escape") closePanel(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); send(); });
  sendBtn.addEventListener("click", function () { if (busy && ctl) ctl.abort(); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!busy) send(); }
  });
  quizBtn.addEventListener("click", askQuiz);
  clearBtn.addEventListener("click", function () {
    turns = []; quiz.awaiting = null; log.innerHTML = "";
    input.placeholder = "Ask a question about this guide…";
    showStarters();
  });

  window.claude.use("sample").then(function (s) {
    if (!s) return;
    sample = s;
    launcher.hidden = false;
  }).catch(function () {});
})();
