# Care Navigator AI

Build a clean, professional web application called "NexusCare AI" for Humana care management coordinators. Use a healthcare-themed palette (deep teal #0E7C86, near-black teal #0B2E33, white, soft grey-green backgrounds — matching the NexusCare AI presentation deck). Load case data from a static demo_export.json file with this shape: [{case_id, name, age, risk_tier, risk_score, top_factors, extracted_facts, retrieved_citations, brief_text, outreach_message, validation_result, critic_result, requires_human_review, agent_trace: [{node, decision, latency_ms}]}], pre-populated with three real exported cases: Margaret T. (74, High-Risk/Complex), James R. (61, Medium-Risk), and Linda K. (55, Low-Risk/Straightforward). LEFT SIDEBAR — a discharge worklist sorted by risk (High/Medium/Low badges) with these three clickable patients. CENTER PANEL — at the top, a horizontal 5-step agent reasoning trace (Risk Scoring → Clinical Extraction → Recommendation Drafting → Validation → Scheduling) with status chips that animate to a checkmark as each completes; below it, the Coordinator Brief: risk tier with a colored badge, a bulleted list of contributing risk factors (from top_factors), an extracted clinical facts card with red-flag items highlighted in red, and the drafted outreach message in an editable text box. RIGHT PANEL — a collapsible "Sources & Citations" accordion linking each brief claim to a playbook excerpt or the discharge summary (from retrieved_citations), a proposed follow-up appointment card, and an action box with three buttons: "Approve & Send" (green success toast), "Edit Message", and "Escalate to Supervisor" (red confirmation). Keep it interactive and clickable — no live backend calls, all three patients' data is real exported output from a working pipeline, not fabricated.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nexuscare-insight.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5093fc39-0516-4a30-9e09-1c9d47a53d07).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
