# Java for Developers — Animated Course

An animated, diagram-rich course that teaches **Java to people who already program** in another
language. It skips "what is a variable" and spends the time on the JVM, the type system, idioms, and
the *reasons* Java does things the way it does.

**▶ Live:** https://learnings.varasrinivas.com/java-fundamentals-course/ — installable as an offline app (PWA).

## Highlights
- **45 modules** across 6 tracks, from the JVM to design patterns.
- **Standalone HTML** — every module is one self-contained file. No build step, no bundler, fully offline.
- **Interactive** — each module has an animated step-through (play / pause / step / reset), a runnable
  playground backed by a tiny in-browser Java simulator, and a custom syntax highlighter.
- **"Coming from…" callouts** — comparisons to Python, JavaScript, Go, and C# in every module.
- **PWA** — installs to a phone/desktop home screen and works completely offline via a service worker.
- **No external JS/CSS** — only Google Fonts are loaded; everything else is inline.

## Curriculum
| Track | Modules |
|-------|---------|
| 1 · The Machine | JVM · Memory & GC · Bytecode |
| 2 · The Language | Types & Boxing · Objects · Inheritance · Interfaces · Encapsulation · Polymorphism (Overloading vs Overriding) · Composition over Inheritance · Static Members · SOLID Principles · Enums · Packages · Strings · equals/hashCode · Generics · Collections · Exceptions · Nested Classes |
| 3 · Modern Java | Lambdas & Streams · Optional · Records & Pattern Matching · Date/Time · Annotations & Reflection · Concurrency |
| 4 · The Ecosystem | Build Tools · Testing |
| 5 · Real-World Java | Spring & DI · Persistence (JDBC/JPA) · JSON (Jackson) · HTTP Client · Logging |
| 6 · Design Patterns | Singleton · Factory Method · Builder · Adapter · Decorator · Facade · Proxy · Strategy · Observer · Command · Template Method · State |

See [COURSE-BLUEPRINT.md](COURSE-BLUEPRINT.md) for the full index and design system.

## Repository layout
```
java-course/
├── index.html              # Course landing page (module cards, progress)
├── modules/                # One standalone HTML file per module (28)
├── icons/                  # PWA app icons
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # Service worker (offline cache)
├── scripts/                # PowerShell validation + index build (Windows)
│   ├── validate-module.ps1 # 20-point structure/accessibility/a11y audit
│   ├── validate-all.ps1
│   └── build-index.ps1
├── COURSE-BLUEPRINT.md
└── CLAUDE.md               # Authoring conventions
```

## View it locally
Open any file directly in a browser:
```
modules/module-01-jvm-machine.html
```
Or serve the folder (so the PWA / service worker works) and open `index.html`:
```
python -m http.server 8000
# then visit http://localhost:8000/
```

## Validate (Windows / PowerShell)
```powershell
.\scripts\validate-all.ps1            # audits every module (structure, a11y, tokens, deps, size)
.\scripts\build-index.ps1             # regenerates index.html from the modules present
```

## License
© Vara Srinivas. All rights reserved unless a license file is added.
