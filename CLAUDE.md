# Rules for Claude in this repo

1. **Ask, don't assume.** If something is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements.

2. **Simplest solution first.** Always implement the simplest thing that could work. Do not add abstractions or flexibility that weren't explicitly requested.

3. **Don't touch unrelated code.** If a file or function is not directly part of the current task, do not modify it, even if you think it could be improved.

4. **Flag uncertainty explicitly.** If you are not confident about an approach or technical detail, say so before proceeding. Confidence without certainty causes more damage than admitting a gap.

---

## Project Context

This project is for **BevelCloud**, being presented to **Timothy Chou, Ph.D.** (Founder, PediatricMoonshot.org).

The two most important file types are:
- **The Atlases (PDFs)** — Pediatric Moonshot disease knowledge foundation
- **The Precise AI Agent Design files (xlsx)** — BevelCloud's core product

Full project context is in memory: `/memory/project_bevelcloud.md`
