# Module generator

The content-driven generator that produces the course's module HTML files plus the PWA assets.
Pure Node.js — **no dependencies**, no build step.

## Files
- **`chassis.js`** — the shared shell every module uses: design-system CSS, the syntax highlighter,
  the step-through engine, the in-browser Java simulator, and `renderModule()` / SVG helpers. Editing
  this changes *all* generated modules at once.
- **`content.js`** — the authored content for modules **02–28**: per-module concept text, diagram
  stages, step captions, runnable playground code, "coming from" callouts, and exercises. Also holds
  `NAV` (the ordered list of all 28 modules) used to wire prev/next links.
- **`build.js`** — wires content into the chassis, writes the module files, and emits
  `manifest.webmanifest` and `sw.js` (with the precache list + a fresh cache version).

## Regenerate
From the repo root:
```bash
node tools/generator/build.js modules
```
This (re)writes `modules/module-02..28-*.html`, plus `manifest.webmanifest` and `sw.js` at the repo
root. Then rebuild the landing page and validate:
```powershell
.\scripts\build-index.ps1
.\scripts\validate-all.ps1
```

## Notes
- **Module 01** (`modules/module-01-jvm-machine.html`) is the hand-built reference template and is
  **not** produced by the generator. It still appears in `NAV` so neighbours link to it; apply any
  chassis/`<head>` change to it by hand.
- The generator was authored alongside the course; the committed module HTML is the source of truth for
  what's deployed. Regenerate only when changing shared structure or module content here.
- The playground simulator supports a deliberately small slice of Java (declarations, `System.out.print`/
  `println`, `+ - * / %`, comparisons, string concatenation). Playground code in `content.js` is kept
  within that slice so every "Run" produces correct output.
