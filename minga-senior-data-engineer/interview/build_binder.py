"""Build one collapsible HTML binder from the Minga study guides.

Usage: python build_binder.py <application folder>
Writes <application folder>/interview/minga_binder.html
"""
import html
import re
import sys
from pathlib import Path

import markdown

APP = Path(sys.argv[1])
INTERVIEW = APP / "interview"
STUDY = INTERVIEW / "study"
OUT = INTERVIEW / "minga_binder.html"

N8N_SUMMARY = """
## The 30-second version

"I built my own n8n automation stack to run oversight for my consulting business. It runs in Docker: n8n with a separate worker in queue mode, Postgres to store its data, and Redis for the job queue. The main workflow is an operations dashboard that pulls from 14 sources: Gmail, Calendar, HubSpot, Jira, GitHub Actions, Vercel, and health checks on my production sites. Each source retries on its own, so if one fails, only that tile breaks, not the whole page. I don't build the workflows by clicking in the UI. A Python script generates them and deploys them through n8n's REST API, so git is the source of truth. And I wouldn't trust the error handler until I'd forced a failure through it on purpose. That test found two ways alerts could get silently dropped."

## Don't overstate

- It's **internal and runs on your workstation**. It's only up while your PC and Docker are running. Moving it to a server is the next recorded step.
- Outgoing messages and alerts are switched off until you approve them. One environment, no dev/prod split. Every connection is read-only by design.
- It's not Airflow. "It's scheduling, retries and error handling, which are the same concerns. A data orchestrator like Airflow adds dependencies between steps and backfills, and I haven't run one in production."
- Built AI-accelerated in Claude Code, with you directing, reviewing and running it.
- **Why it matters for Minga:** n8n is on their list of data services, your dashboard connects to HubSpot (their CRM), and testing alerts with a forced failure is the attitude their pipelines need.
"""


def slug(text):
    s = re.sub(r"<[^>]+>", "", text)
    s = html.unescape(s).lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:48] or "section"


def md_to_html(text):
    out = markdown.markdown(text, extensions=["tables", "fenced_code", "sane_lists"])
    out = out.replace("<li>[ ] ", '<li class="todo">&#9744; ').replace("<li>[x] ", '<li class="todo done">&#9745; ')
    out = out.replace("<table>", '<div class="tablewrap"><table>').replace("</table>", "</table></div>")
    return out


def split_h2(body):
    """Split HTML at top-level <h2> tags -> (intro, [(title_html, inner_html)])."""
    parts = re.split(r"(<h2\b[^>]*>.*?</h2>)", body, flags=re.S)
    intro, subs = parts[0], []
    for i in range(1, len(parts), 2):
        title = re.sub(r"^<h2\b[^>]*>|</h2>$", "", parts[i], flags=re.S).strip()
        subs.append((title, parts[i + 1] if i + 1 < len(parts) else ""))
    return intro, subs


def prefix_ids(body, key):
    body = re.sub(r'\bid="([^"]+)"', rf'id="{key}-\1"', body)
    body = re.sub(r'href="#([^"]+)"', rf'href="#{key}-\1"', body)
    body = re.sub(r"url\(#([^)]+)\)", rf"url(#{key}-\1)", body)
    body = re.sub(r'aria-labelledby="([^"]+)"', rf'aria-labelledby="{key}-\1"', body)
    return body


def md_part(key, path, strip_h1=True):
    text = path.read_text(encoding="utf-8")
    if strip_h1:
        text = re.sub(r"\A\s*# .*\n", "", text)
    return split_h2(md_to_html(text))


def guide_part(key, filename):
    src = (STUDY / filename).read_text(encoding="utf-8")
    main = re.search(r"<main>(.*)</main>", src, re.S).group(1)
    lede = re.search(r'<p class="lede">(.*?)</p>', main, re.S)
    main = re.sub(r'<header class="top".*?</header>', "", main, flags=re.S)
    main = re.sub(r'<footer class="end">.*?</footer>', "", main, flags=re.S)
    tldr = re.search(r'<section class="tldr".*?</section>', main, re.S)
    intro_extra = ""
    if tldr:
        intro_extra = tldr.group(0)
        main = main.replace(intro_extra, "")
    main = prefix_ids(main, key)
    intro_extra = prefix_ids(intro_extra, key)
    intro, subs = split_h2(main)
    lede_html = f'<p class="lede">{lede.group(1)}</p>' if lede else ""
    return lede_html + intro_extra + intro, subs


PARTS = []  # (key, title, eyebrow, accent, intro_html, [(title, html)], open)


def add(key, title, eyebrow, accent, intro, subs, open_=False):
    PARTS.append((key, title, eyebrow, accent, intro, subs, open_))


# Study guides only (brush-up material)
for key, title, fname, accent, n in [
    ("sf", "Snowflake Field Guide", "snowflake.html", "--sf", 1),
    ("dbt", "dbt Field Guide", "dbt.html", "--dbt", 2),
    ("af", "Airflow Field Guide", "airflow.html", "--af", 3),
    ("py", "Python Brush-Up", "python.html", "--py", 4),
]:
    intro, subs = guide_part(key, fname)
    add(key, title, f"Study guide {n} of 4", accent, intro, subs)


css = (STUDY / "study.css").read_text(encoding="utf-8")
# Drop the tutor chat styles' launcher from view; the binder has no chat.
css += """
/* ---------- Binder ---------- */
:root { --ink-accent: #2f5d86; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --ink-accent: #8cb8e0; } }
:root[data-theme="dark"] { --ink-accent: #8cb8e0; }
.binder { max-width: 820px; margin-inline: auto; padding-block: 8px 40px; }
.binder > header { padding-block: 40px 12px; }
.binder > header h1 { margin-bottom: 10px; }
.toolbar { display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0 8px; }
.toolbar button {
  font: 700 14px/1 var(--f-display); color: var(--ink); background: var(--surface);
  border: 1px solid var(--rule); border-radius: 999px; padding: 9px 16px; cursor: pointer;
}
.toolbar button:hover { border-color: var(--ink-accent); }
.toolbar button:focus-visible { outline: 2px solid var(--ink-accent); outline-offset: 2px; }
nav.index { background: var(--surface); border: 1px solid var(--rule); border-radius: 12px; padding: 18px 22px; margin: 18px 0 32px; }
nav.index > p { font: 700 13px/1.2 var(--f-display); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 0 0 12px; }
nav.index > ol { margin: 0; padding-left: 22px; display: grid; gap: 10px; }
nav.index > ol > li > a { font-family: var(--f-display); font-weight: 700; font-size: 1.05rem; color: var(--ink); text-decoration: none; }
nav.index > ol > li > a:hover { color: var(--accent); text-decoration: underline; }
nav.index ol ol { list-style: none; padding: 0; margin: 6px 0 0; display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 14px; }
nav.index ol ol a { color: var(--muted); }
nav.index li + li { margin-top: 0; }

details.part { --accent-soft: color-mix(in srgb, var(--accent) 11%, var(--surface)); border-top: 3px solid var(--accent); margin: 0 0 22px; scroll-margin-top: 12px; }
details.part > summary { list-style: none; cursor: pointer; padding: 18px 0 14px; display: grid; grid-template-columns: 1.6em minmax(0,1fr); align-items: baseline; }
details.part > summary::-webkit-details-marker { display: none; }
details.part > summary::before { content: "+"; font: 700 1.5rem/1 var(--f-mono); color: var(--accent); }
details.part[open] > summary::before { content: "\\2212"; }
details.part > summary .eyebrow { grid-column: 2; margin: 0 0 4px; }
details.part > summary .ptitle { grid-column: 2; font: 800 clamp(1.6rem, 4vw, 2.1rem)/1.15 var(--f-display); letter-spacing: -0.015em; text-wrap: balance; }
details.part > .pbody { padding: 0 0 8px 1.6em; min-width: 0; }
@media (max-width: 600px) { details.part > .pbody { padding-left: 0; } }

details.sub { border-top: 1px solid var(--rule); scroll-margin-top: 12px; }
details.sub > summary { list-style: none; cursor: pointer; padding: 14px 0; display: grid; grid-template-columns: 1.4em minmax(0,1fr); align-items: baseline; font: 700 1.2rem/1.25 var(--f-display); text-wrap: balance; }
details.sub > summary::-webkit-details-marker { display: none; }
details.sub > summary::before { content: "\\25B8"; color: var(--accent); font-size: .95rem; transition: transform .15s; display: inline-block; }
details.sub[open] > summary::before { transform: rotate(90deg); }
@media (prefers-reduced-motion: reduce) { details.sub > summary::before { transition: none; } }
details.sub > .sbody { padding: 0 0 18px; min-width: 0; }
.pbody h2 { margin-top: 28px; }
.sbody h3:first-child { margin-top: 4px; }
li.todo { list-style: none; margin-left: -1.2em; }
li.todo.done { color: var(--muted); }
.pbody pre, .sbody pre { max-width: 100%; }
.backtop { position: fixed; right: 16px; bottom: calc(env(safe-area-inset-bottom, 0px) + 16px); font: 700 13px/1 var(--f-display); background: var(--ink-accent); color: var(--surface); border-radius: 999px; padding: 10px 14px; text-decoration: none; box-shadow: 0 2px 8px rgb(0 0 0 / .18); }
"""

index_items, body = [], []
for key, title, eyebrow, accent, intro, subs, open_ in PARTS:
    pid = f"p-{key}"
    sub_links, sub_html = [], []
    used = set()
    for st, sh in subs:
        sid = f"{pid}-{slug(st)}"
        while sid in used:
            sid += "-x"
        used.add(sid)
        sub_links.append(f'<li><a href="#{sid}">{re.sub(r"<[^>]+>", "", st)}</a></li>')
        sub_html.append(
            f'<details class="sub" id="{sid}"{" open" if open_ else ""}><summary>{st}</summary>'
            f'<div class="sbody">{sh}</div></details>'
        )
    index_items.append(
        f'<li><a href="#{pid}">{title}</a>' + (f'<ol>{"".join(sub_links)}</ol>' if sub_links else "") + "</li>"
    )
    body.append(
        f'<details class="part" id="{pid}" style="--accent: var({accent})"{" open" if open_ else ""}>'
        f'<summary><p class="eyebrow">{html.escape(eyebrow)}</p><span class="ptitle">{title}</span></summary>'
        f'<div class="pbody">{intro}{"".join(sub_html)}</div></details>'
    )

script = """
<script>
(function () {
  function openTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var d = el.closest("details");
    while (d) { d.open = true; d = d.parentElement && d.parentElement.closest("details"); }
    if (el.tagName === "DETAILS") el.open = true;
    el.scrollIntoView({ block: "start" });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    openTo(id);
    try { history.replaceState(null, "", "#" + id); } catch (err) {}
  });
  if (location.hash.length > 1) openTo(decodeURIComponent(location.hash.slice(1)));
  function setAll(sel, on) { document.querySelectorAll(sel).forEach(function (d) { d.open = on; }); }
  document.getElementById("expand-all").addEventListener("click", function () { setAll("details.part, details.sub", true); });
  document.getElementById("collapse-all").addEventListener("click", function () { setAll("details.sub, details.part", false); });
  document.getElementById("parts-only").addEventListener("click", function () { setAll("details.part", true); setAll("details.sub", false); });
})();
</script>
"""

page = f"""<title>Minga Interview Binder</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
{css}
</style>
<div class="binder" style="--accent: var(--ink-accent)">
<header id="top">
  <p class="eyebrow">Senior Data Engineer · Minga · Kelowna</p>
  <h1>Minga Interview Binder</h1>
  <p class="lede">The four brush-up guides for the Minga interview in one place: Snowflake, dbt, Airflow and Python. Tap a heading to open it. The index jumps straight to any section.</p>
  <div class="toolbar">
    <button type="button" id="parts-only">Open all chapters</button>
    <button type="button" id="expand-all">Expand everything</button>
    <button type="button" id="collapse-all">Collapse everything</button>
  </div>
</header>
<nav class="index" aria-label="Index">
  <p>Index</p>
  <ol>{"".join(index_items)}</ol>
</nav>
{"".join(body)}
</div>
<a class="backtop" href="#top">Index &#8593;</a>
{script}
"""
OUT.write_text(page, encoding="utf-8")
print(OUT, len(page), "bytes;", len(PARTS), "parts;", sum(len(p[5]) for p in PARTS), "sections")
