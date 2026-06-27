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
| 08 | encapsulation    | Encapsulation & Immutability       | ✅ built |
| 09 | polymorphism     | Polymorphism: Overloading vs Overriding | ✅ built |
| 10 | composition      | Composition over Inheritance       | ✅ built |
| 11 | static-members   | Static Members & Class Design      | ✅ built |
| 12 | solid-principles | SOLID Principles                   | ✅ built |
| 13 | enums            | Enums & Constant Types             | ✅ built |
| 14 | packages-access  | Packages & Access Control          | ✅ built |
| 15 | strings          | Strings & Text                     | ✅ built |
| 16 | equals-hashcode  | The equals & hashCode Contract     | ✅ built |
| 17 | generics         | Generics & Type Erasure            | ✅ built |
| 18 | collections      | The Collections Framework          | ✅ built |
| 19 | exceptions       | Checked vs Unchecked Exceptions    | ✅ built |
| 20 | nested-classes   | Nested, Inner & Anonymous Classes  | ✅ built |

### Track 3 — Modern Java (the good parts)
| #  | Slug             | Title                              | Status |
|----|------------------|------------------------------------|--------|
| 21 | lambdas-streams  | Lambdas & the Streams API          | ✅ built |
| 22 | optional-null    | Optional & the Billion-Dollar Bug  | ✅ built |
| 23 | records-sealed   | Records, Sealed Types & Pattern Matching | ✅ built |
| 24 | datetime         | Dates & Times (java.time)          | ✅ built |
| 25 | annotations-reflection | Annotations & Reflection     | ✅ built |
| 26 | concurrency      | Threads, Executors & Virtual Threads| ✅ built |

### Track 4 — The Ecosystem
| #  | Slug             | Title                              | Status |
|----|------------------|------------------------------------|--------|
| 27 | build-tools      | Maven, Gradle & the Classpath      | ✅ built |
| 28 | testing          | JUnit & Modern Testing             | ✅ built |

### Track 5 — Real-World Java (the backend stack)
| #  | Slug             | Title                              | Status |
|----|------------------|------------------------------------|--------|
| 29 | spring-di        | Dependency Injection & Spring      | ✅ built |
| 30 | persistence-jdbc | Databases: JDBC & JPA              | ✅ built |
| 31 | json-jackson     | JSON with Jackson                  | ✅ built |
| 32 | http-client      | The HTTP Client (java.net.http)    | ✅ built |
| 33 | logging          | Logging Done Right                 | ✅ built |

### Track 6 — Design Patterns (GoF, beginner-friendly)
| #  | Slug             | Title                              | Status |
|----|------------------|------------------------------------|--------|
| 34 | singleton        | Singleton                          | ✅ built |
| 35 | factory-method   | Factory Method                     | ✅ built |
| 36 | builder          | Builder                            | ✅ built |
| 37 | adapter          | Adapter                            | ✅ built |
| 38 | decorator        | Decorator                          | ✅ built |
| 39 | facade           | Facade                             | ✅ built |
| 40 | proxy            | Proxy                              | ✅ built |
| 41 | strategy         | Strategy                           | ✅ built |
| 42 | observer         | Observer                           | ✅ built |
| 43 | command          | Command                            | ✅ built |
| 44 | template-method  | Template Method                    | ✅ built |
| 45 | state            | State                              | ✅ built |

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
