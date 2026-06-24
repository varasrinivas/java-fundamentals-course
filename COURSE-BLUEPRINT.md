# COURSE-BLUEPRINT.md — Java for Developers

> An animated, diagram-rich Java course for people who already program in another language.
> Every module is a standalone, offline HTML file. No build step. No external JS/CSS (web fonts only).

## Audience
Working developers fluent in at least one of Python, JavaScript, Go, C#, or C++.
We skip "what is a variable" and spend the time on **the Java way**: its memory model, type
system, tooling, idioms, and the reasons behind them.

## Learning Tracks

### Track 1 — The Machine (how Java runs)
| #  | Slug             | Title                              | Status |
|----|------------------|------------------------------------|--------|
| 01 | jvm-machine      | The JVM: Your Code's Real Computer | ✅ built |
| 02 | memory-model     | Stack, Heap & the Garbage Collector| ✅ built |
| 03 | bytecode         | From Source to Bytecode            | ✅ built |

### Track 2 — The Language (types & idioms)
| #  | Slug             | Title                              | Status |
|----|------------------|------------------------------------|--------|
| 04 | types-and-vars   | Static Types, Primitives & Boxing  | ✅ built |
| 05 | objects-classes  | Objects, Classes & Constructors    | ✅ built |
| 06 | inheritance      | Inheritance & Polymorphism         | ✅ built |
| 07 | interfaces       | Interfaces & Abstract Classes      | ✅ built |
| 08 | enums            | Enums & Constant Types             | ✅ built |
| 09 | packages-access  | Packages & Access Control          | ✅ built |
| 10 | strings          | Strings & Text                     | ✅ built |
| 11 | equals-hashcode  | The equals & hashCode Contract     | ✅ built |
| 12 | generics         | Generics & Type Erasure            | ✅ built |
| 13 | collections      | The Collections Framework          | ✅ built |
| 14 | exceptions       | Checked vs Unchecked Exceptions    | ✅ built |
| 15 | nested-classes   | Nested, Inner & Anonymous Classes  | ✅ built |

### Track 3 — Modern Java (the good parts)
| #  | Slug             | Title                              | Status |
|----|------------------|------------------------------------|--------|
| 16 | lambdas-streams  | Lambdas & the Streams API          | ✅ built |
| 17 | optional-null    | Optional & the Billion-Dollar Bug  | ✅ built |
| 18 | records-sealed   | Records, Sealed Types & Pattern Matching | ✅ built |
| 19 | datetime         | Dates & Times (java.time)          | ✅ built |
| 20 | annotations-reflection | Annotations & Reflection     | ✅ built |
| 21 | concurrency      | Threads, Executors & Virtual Threads| ✅ built |

### Track 4 — The Ecosystem
| #  | Slug             | Title                              | Status |
|----|------------------|------------------------------------|--------|
| 22 | build-tools      | Maven, Gradle & the Classpath      | ✅ built |
| 23 | testing          | JUnit & Modern Testing             | ✅ built |

### Track 5 — Real-World Java (the backend stack)
| #  | Slug             | Title                              | Status |
|----|------------------|------------------------------------|--------|
| 24 | spring-di        | Dependency Injection & Spring      | ✅ built |
| 25 | persistence-jdbc | Databases: JDBC & JPA              | ✅ built |
| 26 | json-jackson     | JSON with Jackson                  | ✅ built |
| 27 | http-client      | The HTTP Client (java.net.http)    | ✅ built |
| 28 | logging          | Logging Done Right                 | ✅ built |

## Design System (canonical — keep in sync with CLAUDE.md tokens)

**Palette** — deep indigo surfaces, high-contrast text, five accents used semantically:
- `--accent-cyan` (#00d4ff) — primary/interactive, JVM & flow
- `--accent-amber` (#ffb627) — strings, warnings, "gotcha"
- `--accent-emerald` (#06d6a0) — success, numbers, heap-live
- `--accent-coral` (#ef476f) — errors, garbage, danger
- `--accent-purple` (#b088f9) — types, classes, metadata

**Type**: Fraunces (display headings), Inter (body), JetBrains Mono (code).

**Motion**: CSS transitions only (no SMIL). `requestAnimationFrame` for loops, never `setInterval`.
Every animated section honors `prefers-reduced-motion: reduce` by snapping to final state.

## Module Anatomy (the 6 required sections, in order)
1. **module-nav** — title, number, prev/next
2. **concept** — core explanation + at least one SVG diagram
3. **step-through** — animated walkthrough with Play / Pause / Step Back / Step Forward / Reset
4. **playground** — editable code + Run button + visual output panel
5. **gotchas** — "Coming from {Python,JS,Go,C#}" comparison callouts (≥2 languages)
6. **exercises** — practice problems, each with an expandable hint

## Authoring Workflow
1. `/new-module <n> <slug> <title>` — clone module-01 as template
2. Write content; keep file < 250KB, zero external JS/CSS
3. `.\scripts\validate-module.ps1 .\modules\module-XX-slug.html` — must be all green
4. `.\scripts\build-index.ps1` — regenerate landing page
5. `Start-Process .\modules\module-XX-slug.html` — eyeball it (desktop + 375px)

## Quality Bar
All 20 validation checks pass · no console errors · reduced-motion fallback works ·
≥2 "coming from" callouts · ≥1 exercise with hint · syntax-highlighted code · mobile-responsive.
