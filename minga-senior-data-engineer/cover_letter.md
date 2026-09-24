# William Tucker

**250-619-8900 · william@williamtucker.ca · williamtucker.ca · Kelowna, BC**

---

September 24, 2026

Hiring Team
Minga
Kelowna, BC

**Re: Senior Data Engineer**

---

Dear Minga Hiring Team,

For twelve years I've worked on the systems that hold student data at BC universities, first at Thompson Rivers University and since 2016 at Vancouver Island University. I build the pipelines that move that data and the access control that keeps it in the right hands. When I read that Minga holds student-level data and treats it that way, I recognized my own job.

At VIU I build and run the pipelines that carry student data between the university and the bodies that depend on it. The daily exchange with StudentAid BC that confirms enrolment and releases loan funding is mine end to end: it imports the province's disbursement file every morning, sends back the confirmations, and tells me when it fails through a health endpoint, a dead-man alert, and a watchdog that runs off the box. I also built and run the student-level submission to the provincial Central Data Warehouse, and the application behind the CRA tuition certificate filing for eleven thousand students. Data like that doesn't forgive sloppiness, so access control and secrets are part of the pipeline, not an afterthought. This year that meant noticing that a set of database grants exposed more about students than anyone needed, replacing them with narrow views, and revoking the originals in production.

I'll be direct about how I work, since your posting asks about it too. I was a programmer for a decade before AI tools existed, and now they write a large share of my code every day. I own everything around it: the design, the review, the tests, and what happens in production. My supervisor at VIU will vouch for what's running there. I've built my own guardrails for this way of working, including a tool that gives AI assistants access to our Oracle databases with read and write separated and row limits enforced. You want someone to set the standard for reviewing data work when a model writes the first draft. Here is mine. When I rewrote a slow review query this month, the new version went to production only after I hashed every column of the old and new output and got identical results. The same habit caught four defects in an extraction query the month before, before the reviewers ever saw the data.

Here's the honest part. My warehouse experience is Oracle and PostgreSQL rather than Snowflake, and I haven't run dbt or a dedicated orchestrator like Airflow in production. My Python is pipeline and tooling work, not years of Python-first data engineering. I've closed gaps like this before: this year I shipped working systems on Postgres with vector search and on the n8n automation platform, both new to me. Before we talk a second time I'll have a Snowflake trial running a dbt Core project with tests and a CI run, so you can judge the ramp instead of taking my word for it. dbt in particular fits the way I already work: SQL in version control, reviewed, tested, and deployed through CI. The parts of this role that take years to earn are care with sensitive data, comfort owning a system alone, and writing things down so other people can run them. Those I bring with me.

I also like the service side of this job. At TRU I trained staff to do their own institutional reporting and tune their own SQL, which is the same instinct as teaching analysts to self-serve. My team at VIU onboards from a handbook I wrote, and my tools ship with runbooks for whoever operates them next. I've spent years working directly with the departments that own the data, and I'm comfortable saying "not yet" and explaining why.

I live in Kelowna and can be in your office three days a week from the start. I work remotely for VIU right now alongside my own consulting practice. For the right role, I'll give VIU proper notice and make this my focus. I'd welcome the chance to talk.

Sincerely,
William Tucker
