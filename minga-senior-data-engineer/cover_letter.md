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

At VIU I build and run the pipelines that carry student data between the university and the bodies that depend on it. The daily exchange with StudentAid BC that confirms enrolment and releases loan funding is mine end to end: it imports the province's disbursement file every morning, sends back the confirmations, and tells me when it fails through a health endpoint, a dead-man alert, and a watchdog that runs off the box. So is the student-level submission to the provincial Central Data Warehouse, and the CRA tuition certificate filing for eleven thousand students. Data like that leaves no room for sloppiness, so I treat access control and secrets as part of the pipeline from day one. This year that meant noticing that a set of database grants exposed more about students than anyone needed, replacing them with narrow views, and revoking the originals in production.

I'll be direct about how I work, since your posting asks about it too. I'm an AI developer who was a programmer first. AI tooling writes a large share of my code every day, and I own everything around it: the design, the review, the tests, and what happens in production. My supervisor at VIU will vouch for what's running there. I've built my own guardrails for this way of working, including a tool that gives AI assistants access to our Oracle databases with read and write separated and row limits enforced. You want someone to set the standard for reviewing data work when a model writes the first draft. Here is mine. When I rewrote a slow review query this month, the new version went to production only after I hashed every column of the old and new output and got identical results. Fast is fine. Proven is the bar, and I'd enjoy setting it with you.

Here's the honest part. My warehouse experience is Oracle and PostgreSQL rather than Snowflake, and I haven't run dbt or a dedicated orchestrator like Airflow in production. My Python is pipeline and tooling work, not years of Python-first data engineering. I expect to close that gap fast. Learning new platforms quickly is how I've always worked, and since late 2025 I've taken on PostgreSQL with vector search and the n8n automation platform and shipped working systems on both. dbt in particular fits the way I already work: SQL in version control, reviewed, tested, and deployed through CI. The parts of this role that take years to earn are care with sensitive data, comfort owning a system alone, and writing things down so other people can run them. Those I bring with me.

I also like the service side of this job. At TRU I trained staff to do their own institutional reporting and tune their own SQL, which is the same instinct as teaching analysts to self-serve. My team at VIU onboards from a handbook I wrote, and my tools ship with runbooks for whoever operates them next. I've spent years working directly with the departments that own the data, and I'm comfortable saying "not yet" and explaining why.

I live in Kelowna and can be in your office three days a week from the start. I currently work remotely for VIU alongside my own consulting practice, and for the right role I'm ready to give VIU proper notice and make this my focus. I'd welcome the chance to talk.

Thank you for your consideration.

Sincerely,
William Tucker
