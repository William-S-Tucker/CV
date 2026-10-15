# RUNBOOK.md — operating the EA automation stack

What this stack is, how to operate it, and what to do when it breaks. Written to be
useful to someone who is not the person who built it — which is the point of a runbook.

## Architecture

```
browser ──► Caddy (TLS, :8443) ──► n8n main (:5678)  ──► Postgres  (workflows, credentials)
                                          │                Redis    (job queue)
                                          └──► n8n worker (executes jobs)
```

| Service | Role | Published? |
|---|---|---|
| `n8n` | Editor UI + API + scheduler. Enqueues work. | `127.0.0.1:5678` |
| `n8n-worker` | Pulls jobs off Redis and runs them. Concurrency 10. | no |
| `postgres` | Source of truth: workflows, credentials, execution history. | no |
| `redis` | Job queue (BullMQ). | no |
| `caddy` | Reverse proxy, TLS, security headers. | `127.0.0.1:8081/8443` |

Nothing except Caddy and n8n is reachable from the host, and both are bound to
`127.0.0.1` — not `0.0.0.0`. Redis here has no password; it must never face a network.

## The one secret that matters

`N8N_ENCRYPTION_KEY` in `.env` encrypts every stored credential. **A database backup
without this key is undecryptable and therefore worthless.** It is pinned explicitly so
it survives volume loss. Back it up somewhere that is not this machine (password
manager). Rotating it invalidates all credentials — don't, unless you intend to re-auth
all six Google connections.

## Everyday commands

```bash
docker compose ps                      # what is running
docker compose up -d                   # start everything
docker compose down                    # stop (data survives in volumes)
docker compose logs -f n8n             # main logs
docker compose logs -f n8n-worker      # execution logs — where run failures appear
docker compose pull && docker compose up -d   # upgrade (after bumping the pinned tag)
```

Access: <http://localhost:5678> direct, or <https://n8n.localhost:8443> through Caddy
(self-signed certificate — the browser warning is expected locally).

## Backup and restore

Backup (writes to gitignored `backups/`):

```bash
docker exec n8n n8n export:workflow --all --output=/tmp/wf.json
docker exec n8n n8n export:credentials --all --output=/tmp/cred.json   # stays encrypted
docker cp n8n:/tmp/wf.json ./backups/ && docker cp n8n:/tmp/cred.json ./backups/
docker run --rm -v ea_pg_data:/data -v "//d/code/EA/backups":/bk alpine \
  tar czf /bk/pg-$(date +%F).tgz -C /data .
```

Restore into a fresh instance — **set `N8N_ENCRYPTION_KEY` to the original value first**,
then:

```bash
docker cp ./backups/cred.json n8n:/tmp/ && docker exec n8n n8n import:credentials --input=/tmp/cred.json
docker cp ./backups/wf.json  n8n:/tmp/ && docker exec n8n n8n import:workflow    --input=/tmp/wf.json
```

Proven on 2026-08-03: this exact path migrated SQLite → Postgres with all six OAuth
credentials intact and the morning brief still returning live Gmail data.

**What does NOT survive:** the owner account and API keys live in the database and are
not part of the export. After a restore you re-create the owner and issue a new API key.

## When something breaks

| Symptom | Look here |
|---|---|
| Workflow didn't run | `docker compose logs n8n-worker`; check the workflow is **active** |
| "Credentials could not be decrypted" | `N8N_ENCRYPTION_KEY` does not match the data |
| Editor won't load | `docker compose ps` — is Postgres healthy? n8n won't start without it |
| Jobs queue but never run | worker is down: `docker compose up -d n8n-worker` |
| Port bind failure on start | something else owns the port (8080 was taken on this host) |

## The ops console

**<http://localhost:5678/webhook/dashboard>** — bookmark it. Served by the `Ops console`
workflow itself (webhook trigger → gather → `Respond to Webhook` returning HTML), so
there is no second app to run or deploy. Auto-refreshes every 5 minutes.

Layout 1A "Command rail" on the Nocturne dark design system (imported from the Claude
Design project). A left rail carries the verdict, open signals and a live source
registry; the main column carries the detail. Dark-only — the light variant has not been
designed.

Source of truth for the look is `dashboard/styles.css`; see `dashboard/README.md`.

One node worth knowing about: **`n8n: executions`** calls n8n's own API for the 24h run
count. It must use `http://n8n:5678` — the compose service name. Inside the worker
container `localhost:5678` is the *worker*, which does not serve the public API.

Thresholds, all chosen to avoid crying wolf:
- bylaw-check cron goes **critical** if failed or older than **30h** (its observed
  interval is ~25h and GitHub's free scheduler drifts by hours)
- Jira items go **warning** if *In Progress* and untouched for **3+ days** — drift, not
  breakage, so it never escalates to critical

**It must be ACTIVE** — a deactivated workflow returns 404 on its webhook.

Design notes: status uses the reserved good/warning/critical palette and always pairs
colour with an icon and a text label, so state never depends on colour alone; light and
dark are both defined rather than auto-flipped. Numbers are stat tiles, not charts —
there is no time series here worth plotting yet.

The human-vs-automated split is **rules, not a model**: sender patterns
(`no-reply`, `notifications@`, …), known automated domains, and subject patterns
(receipts, security alerts, newsletters). Cheap, fast, no API cost, and auditable. If it
misclassifies in practice, the fix is either better rules or an LLM classifier behind an
Anthropic key — try the rules first.

## Error handling

`ERROR HANDLER (global)` catches failures from every workflow that names it in
Settings → Error Workflow. It formats workflow name, failed node, message, mode and a
link to the failed execution.

Two rules learned the hard way here, both verified with a deliberate-failure canary:

1. **Error workflows do not fire on manual or CLI executions** — only production runs
   (schedule, webhook, trigger). Testing by clicking "Execute workflow" proves nothing.
2. **The error workflow itself must be ACTIVE.** While inactive, n8n logs
   `Workflow ... is not active and cannot be executed` to the worker and the alert is
   silently dropped. It looks correctly wired and does nothing.

To re-test after changes: create a workflow whose only job is to `throw`, give it a
1-minute schedule trigger, set its Error Workflow, activate it, wait for a run, confirm
an execution appears under the error handler, then delete it.

The alert email node is **disabled** pending sign-off; alerts currently land in the
error handler's execution list only.

## Known gaps (deliberate, not oversights)

1. **Runs only while this PC and Docker are up.** A scheduled watchdog that sleeps when
   the machine sleeps is not a watchdog. Real fix: move to a small always-on host.
2. **Alert delivery is disabled** — enable the Gmail node in the error handler to
   actually receive failure notifications.
3. **No idempotency** in the morning brief; safe today because it only reads. Required
   before anything writes, sends, or replies.
4. **Single environment** — no dev/prod separation; edits are live.
5. **Self-signed TLS locally.** On a real host Caddy fetches a Let's Encrypt cert
   automatically; the Caddyfile change is one hostname.
