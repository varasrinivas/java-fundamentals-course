# CLAUDE.md — Java for Developers Animated Course

## Project Overview
An animated, diagram-rich Java training course targeting developers who already know another language.
Each module is a **standalone HTML file** — no build tools, no bundler, fully offline-capable.

## Platform
Windows (PowerShell). All scripts are `.ps1`. Use `Start-Process` or direct browser open for previewing modules.

## Architecture
```
java-course\
├── CLAUDE.md              # This file
├── COURSE-BLUEPRINT.md    # Module index and design system
├── modules\               # One HTML file per module
│   ├── module-01-jvm-machine.html
│   ├── module-02-memory-model.html
│   └── ...
├── assets\                # Shared assets (if any)
└── scripts\               # Build/validation scripts (PowerShell)
    ├── validate-module.ps1  # Checks module HTML structure
    ├── validate-all.ps1     # Runs audit on all modules
    └── build-index.ps1      # Generates course index page
```

## Module Authoring Rules

### Structure
Every module HTML file MUST contain these sections in order:
1. `<nav class="module-nav">` — title, module number, prev/next links
2. `<section class="concept">` — core explanation with SVG diagrams
3. `<section class="step-through">` — animated step-through with play/pause/step controls
4. `<section class="playground">` — interactive code area with visual output
5. `<section class="gotchas">` — "coming from Python/JS/Go" comparison callouts
6. `<section class="exercises">` — practice problems with expandable hints

### Design Tokens (embed in each file's `<style>`)
```css
:root {
  --bg-primary: #0f0f1a;
  --bg-surface: #1a1a2e;
  --bg-elevated: #242442;
  --text-primary: #e8e8e8;
  --text-secondary: #a0a0b8;
  --text-muted: #6b6b80;
  --accent-cyan: #00d4ff;
  --accent-amber: #ffb627;
  --accent-emerald: #06d6a0;
  --accent-coral: #ef476f;
  --accent-purple: #b088f9;
  --font-display: 'Fraunces', serif;
  --font-body: 'Inter', sans-serif;
  --font-code: 'JetBrains Mono', monospace;
  --radius: 8px;
  --transition: 400ms ease-out;
}
```

### Animation Requirements
- ALL animations must respect `prefers-reduced-motion: reduce`
- Step-throughs: must have Play, Pause, Step Forward, Step Back, Reset controls
- SVG diagrams: use CSS transitions, not SMIL (better browser support)
- Interactive playgrounds: show output panel beside/below code, support "Run" button
- Use `requestAnimationFrame` for smooth animations, never `setInterval`

### Code Syntax Highlighting
Use a lightweight custom highlighter (embedded in each file). Highlight:
- Keywords (blue/cyan), strings (amber), comments (muted), numbers (emerald), types (purple)
- Do NOT use external libraries like Prism or Highlight.js (keep files standalone)

### "Coming From" Callouts
Each module should include comparison boxes for at least 2 of:
- Python, JavaScript, Go, C#, C++
Format: `<div class="callout callout-python">` with language icon and comparison text

### Content Guidelines
- **Skip basics**: Don't explain what variables/loops/functions are
- **Show the Java way**: Emphasize idioms, conventions, "why Java does it this way"
- **Concrete over abstract**: Lead with working code, then explain the model
- **Animated understanding**: Every concept gets at least one visual — diagram, animation, or interactive

## Slash Commands

### /new-module <number> <slug> <title>
Create a new module HTML file from the template with the correct module number, slug, and title.
Steps:
1. Use `module-01-jvm-machine.html` as the reference template
2. Set module number, title, prev/next nav links
3. Create placeholder sections for all 5 required sections with topic-specific animation scaffolds
4. Save to `modules\module-{number}-{slug}.html`
5. Run `.\scripts\validate-module.ps1 modules\module-{number}-{slug}.html` to verify

### /audit-module <filename>
Run the PowerShell validation script:
```powershell
.\scripts\validate-module.ps1 .\modules\<filename>
```
Checks 20 points: structure, design tokens, accessibility, animation controls, callouts, dependencies, file size.

### /add-animation <filename> <type: step-through|svg-diagram|playground>
Add an animation scaffold to an existing module. Provides:
- For step-through: state machine boilerplate with Play/Pause/Step/Back/Reset controls UI
- For svg-diagram: SVG canvas with CSS transition helpers and click-to-activate stages
- For playground: code editor textarea + output panel + Run button + simple Java simulator

### /build-index
Scan `modules\` directory and generate `index.html` — the course landing page
with module cards, track groupings, and completion tracking.

### /validate-all
Run validation on every module file:
```powershell
.\scripts\validate-all.ps1
```

### /preview <filename>
Open a module in the default browser for visual check:
```powershell
Start-Process .\modules\<filename>
```

## Quality Bar
Before a module is "done":
- [ ] Opens in browser with no console errors (`Start-Process .\modules\<file>`)
- [ ] All animations play smoothly and have controls
- [ ] Reduced motion fallback works
- [ ] "Coming from" callouts for at least Python and JavaScript
- [ ] At least 1 exercise with expandable hint
- [ ] Code blocks have syntax highlighting
- [ ] Mobile responsive (tested at 375px width)
- [ ] File size under 250KB (no external deps)
- [ ] Passes `.\scripts\validate-module.ps1`
