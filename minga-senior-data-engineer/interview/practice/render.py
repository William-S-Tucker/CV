"""Render questions.md and answers.md into styled, collapsible HTML pages.

Usage: python render.py   (run from anywhere; paths are relative to this file)
"""
import re
from pathlib import Path

import markdown

HERE = Path(__file__).parent
CSS = (HERE.parent / "study" / "study.css").read_text(encoding="utf-8")
EXTRA = """
:root { --ex: #7a3e9d; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --ex: #c99be6; } }
:root[data-theme="dark"] { --ex: #c99be6; }
.sheet { --accent: var(--ex); --accent-soft: color-mix(in srgb, var(--accent) 11%, var(--surface)); max-width: 820px; margin-inline: auto; padding-block: 8px 40px; }
.sheet > header { padding-block: 40px 8px; }
nav.index { background: var(--surface); border: 1px solid var(--rule); border-radius: 12px; padding: 16px 22px; margin: 18px 0 28px; font-size: 15px; }
nav.index ol { margin: 0; padding-left: 22px; display: grid; gap: 6px; }
.toolbar { display: flex; flex-wrap: wrap; gap: 10px; margin: 14px 0 0; }
.toolbar button { font: 700 14px/1 var(--f-display); color: var(--ink); background: var(--surface); border: 1px solid var(--rule); border-radius: 999px; padding: 9px 16px; cursor: pointer; }
.toolbar button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
details.sec { border-top: 3px solid var(--accent); margin: 0 0 18px; scroll-margin-top: 12px; }
details.sec > summary { list-style: none; cursor: pointer; padding: 16px 0 12px; font: 800 1.45rem/1.2 var(--f-display); display: grid; grid-template-columns: 1.4em minmax(0,1fr); text-wrap: balance; }
details.sec > summary::-webkit-details-marker { display: none; }
details.sec > summary::before { content: "+"; font-family: var(--f-mono); color: var(--accent); }
details.sec[open] > summary::before { content: "\2212"; }
.sbody { min-width: 0; padding-bottom: 10px; }
.sbody h3 { margin-top: 26px; padding-top: 14px; border-top: 1px dashed var(--rule); }
.sbody h3:first-child { border-top: 0; padding-top: 0; }
.sbody pre { max-width: 100%; }
"""

def render(src, title, eyebrow, lede, out, open_all=False):
    text = (HERE / src).read_text(encoding="utf-8")
    text = re.sub(r"\A\s*# .*\n", "", text)
    body = markdown.markdown(text, extensions=["tables", "fenced_code", "sane_lists"])
    body = body.replace("<table>", '<div class="tablewrap"><table>').replace("</table>", "</table></div>")
    parts = re.split(r"(<h2\b[^>]*>.*?</h2>)", body, flags=re.S)
    intro, secs, links = parts[0], [], []
    for i in range(1, len(parts), 2):
        t = re.sub(r"^<h2\b[^>]*>|</h2>$", "", parts[i]).strip()
        sid = "s-" + re.sub(r"[^a-z0-9]+", "-", re.sub(r"<[^>]+>", "", t).lower()).strip("-")[:40]
        links.append(f'<li><a href="#{sid}">{re.sub(r"<[^>]+>", "", t)}</a></li>')
        secs.append(f'<details class="sec" id="{sid}"{" open" if open_all else ""}><summary>{t}</summary><div class="sbody">{parts[i+1]}</div></details>')
    page = f"""<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;600&display=swap">
<style>{CSS}{EXTRA}</style>
<div class="sheet">
<header id="top"><p class="eyebrow">{eyebrow}</p><h1>{title}</h1><p class="lede">{lede}</p>
<div class="toolbar"><button type="button" id="open-all">Open all</button><button type="button" id="close-all">Close all</button></div></header>
{intro}
<nav class="index" aria-label="Sections"><ol>{''.join(links)}</ol></nav>
{''.join(secs)}
</div>
<script>
(function () {{
  function openTo(id) {{ var el = document.getElementById(id); if (!el) return; if (el.tagName === "DETAILS") el.open = true; el.scrollIntoView({{ block: "start" }}); }}
  document.addEventListener("click", function (e) {{
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute("href").slice(1); if (!document.getElementById(id)) return;
    e.preventDefault(); openTo(id);
  }});
  document.getElementById("open-all").addEventListener("click", function () {{ document.querySelectorAll("details.sec").forEach(function (d) {{ d.open = true; }}); }});
  document.getElementById("close-all").addEventListener("click", function () {{ document.querySelectorAll("details.sec").forEach(function (d) {{ d.open = false; }}); }});
}})();
</script>
"""
    (HERE / out).write_text(page, encoding="utf-8")
    print(out, len(page))

render("questions.md", "Minga Mock Exam", "Minga prep · Practice questions",
       "Questions you might get on October 15, from SQL and modelling to privacy, RevOps and AI-review tests. Answer out loud or on paper before you open the answer key.",
       "questions.html")
render("answers.md", "Minga Mock Exam Answers", "Minga prep · Answer key",
       "Model answers, scoring guides, red flags and what to study for every question in the Minga Mock Exam.",
       "answers.html")
