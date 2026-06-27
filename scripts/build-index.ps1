# build-index.ps1 — Generate index.html (the course landing page)
# Scans modules/ for built modules, marks the rest of the roadmap as planned.
# Usage: .\scripts\build-index.ps1

$ErrorActionPreference = "Stop"
$root       = Join-Path $PSScriptRoot ".."
$modulesDir = Join-Path $root "modules"
$indexPath  = Join-Path $root "index.html"

# Canonical roadmap (keep in sync with COURSE-BLUEPRINT.md)
$tracks = [ordered]@{
  "Track 1 — The Machine" = @(
    @{ n="01"; slug="jvm-machine";           t="The JVM: Your Code's Real Computer" },
    @{ n="02"; slug="memory-model";          t="Stack, Heap & the Garbage Collector" },
    @{ n="03"; slug="bytecode";              t="From Source to Bytecode" }
  )
  "Track 2 — The Language" = @(
    @{ n="04"; slug="types-and-vars";        t="Static Types, Primitives & Boxing" },
    @{ n="05"; slug="objects-classes";       t="Objects, Classes & Constructors" },
    @{ n="06"; slug="inheritance";           t="Inheritance & Polymorphism" },
    @{ n="07"; slug="interfaces";            t="Interfaces & Abstract Classes" },
    @{ n="08"; slug="encapsulation";         t="Encapsulation & Immutability" },
    @{ n="09"; slug="polymorphism";          t="Polymorphism: Overloading vs Overriding" },
    @{ n="10"; slug="composition";           t="Composition over Inheritance" },
    @{ n="11"; slug="static-members";        t="Static Members & Class Design" },
    @{ n="12"; slug="solid-principles";      t="SOLID Principles" },
    @{ n="13"; slug="enums";                 t="Enums & Constant Types" },
    @{ n="14"; slug="packages-access";       t="Packages & Access Control" },
    @{ n="15"; slug="strings";               t="Strings & Text" },
    @{ n="16"; slug="equals-hashcode";       t="The equals & hashCode Contract" },
    @{ n="17"; slug="generics";              t="Generics & Type Erasure" },
    @{ n="18"; slug="collections";           t="The Collections Framework" },
    @{ n="19"; slug="exceptions";            t="Checked vs Unchecked Exceptions" },
    @{ n="20"; slug="nested-classes";        t="Nested, Inner & Anonymous Classes" }
  )
  "Track 3 — Modern Java" = @(
    @{ n="21"; slug="lambdas-streams";       t="Lambdas & the Streams API" },
    @{ n="22"; slug="optional-null";         t="Optional & the Billion-Dollar Bug" },
    @{ n="23"; slug="records-sealed";        t="Records, Sealed Types & Pattern Matching" },
    @{ n="24"; slug="datetime";              t="Dates & Times (java.time)" },
    @{ n="25"; slug="annotations-reflection";t="Annotations & Reflection" },
    @{ n="26"; slug="concurrency";           t="Threads, Executors & Virtual Threads" }
  )
  "Track 4 — The Ecosystem" = @(
    @{ n="27"; slug="build-tools";           t="Maven, Gradle & the Classpath" },
    @{ n="28"; slug="testing";               t="JUnit & Modern Testing" }
  )
  "Track 5 — Real-World Java" = @(
    @{ n="29"; slug="spring-di";             t="Dependency Injection & Spring" },
    @{ n="30"; slug="persistence-jdbc";      t="Databases: JDBC & JPA" },
    @{ n="31"; slug="json-jackson";          t="JSON with Jackson" },
    @{ n="32"; slug="http-client";           t="The HTTP Client (java.net.http)" },
    @{ n="33"; slug="logging";               t="Logging Done Right" }
  )
  "Track 6 — Design Patterns" = @(
    @{ n="34"; slug="singleton";             t="Singleton" },
    @{ n="35"; slug="factory-method";        t="Factory Method" },
    @{ n="36"; slug="builder";               t="Builder" },
    @{ n="37"; slug="adapter";               t="Adapter" },
    @{ n="38"; slug="decorator";             t="Decorator" },
    @{ n="39"; slug="facade";                t="Facade" },
    @{ n="40"; slug="proxy";                 t="Proxy" },
    @{ n="41"; slug="strategy";              t="Strategy" },
    @{ n="42"; slug="observer";              t="Observer" },
    @{ n="43"; slug="command";               t="Command" },
    @{ n="44"; slug="template-method";       t="Template Method" },
    @{ n="45"; slug="state";                 t="State" }
  )
  "Track 7 — More Design Patterns" = @(
    @{ n="46"; slug="abstract-factory";        t="Abstract Factory" },
    @{ n="47"; slug="prototype";               t="Prototype" },
    @{ n="48"; slug="bridge";                  t="Bridge" },
    @{ n="49"; slug="composite";               t="Composite" },
    @{ n="50"; slug="flyweight";               t="Flyweight" },
    @{ n="51"; slug="chain-of-responsibility"; t="Chain of Responsibility" },
    @{ n="52"; slug="iterator";                t="Iterator" },
    @{ n="53"; slug="mediator";                t="Mediator" },
    @{ n="54"; slug="memento";                 t="Memento" },
    @{ n="55"; slug="visitor";                 t="Visitor" },
    @{ n="56"; slug="interpreter";             t="Interpreter" }
  )
}

function ModuleExists($n, $slug) {
  Test-Path (Join-Path $modulesDir "module-$n-$slug.html")
}

$builtCount = 0
$cardsHtml  = ""

foreach ($trackName in $tracks.Keys) {
  $cardsHtml += "      <h2 class=`"track`">$trackName</h2>`n      <div class=`"grid`">`n"
  foreach ($mod in $tracks[$trackName]) {
    $exists = ModuleExists $mod.n $mod.slug
    if ($exists) { $builtCount++ }
    $href   = "modules/module-$($mod.n)-$($mod.slug).html"
    $state  = if ($exists) { "ready" } else { "planned" }
    $tag    = if ($exists) { "Open" } else { "Soon" }
    $open   = if ($exists) { "href=`"$href`"" } else { "aria-disabled=`"true`"" }
    $cardsHtml += @"
        <a class="card $state" $open>
          <span class="num">$($mod.n)</span>
          <span class="ctitle">$($mod.t)</span>
          <span class="cta">$tag</span>
        </a>

"@
  }
  $cardsHtml += "      </div>`n"
}

$total = ($tracks.Values | ForEach-Object { $_ } | Measure-Object).Count
$pct   = [math]::Round(($builtCount / $total) * 100)

$html = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Java for Developers — Animated Course</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<meta name="theme-color" content="#0f0f1a">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Java Course">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<style>
:root{--bg-primary:#0f0f1a;--bg-surface:#1a1a2e;--bg-elevated:#242442;--text-primary:#e8e8e8;--text-secondary:#a0a0b8;--text-muted:#6b6b80;--accent-cyan:#00d4ff;--accent-purple:#b088f9;--accent-emerald:#06d6a0;--font-display:'Fraunces',serif;--font-body:'Inter',sans-serif;--font-code:'JetBrains Mono',monospace;--radius:8px;--transition:400ms ease-out}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg-primary);color:var(--text-primary);font-family:var(--font-body);line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:980px;margin:0 auto;padding:0 20px}
header{padding:80px 0 30px;text-align:center}
header .kicker{font-family:var(--font-code);font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:14px}
header h1{font-family:var(--font-display);font-weight:700;font-size:clamp(2.2rem,7vw,4rem);line-height:1.04;letter-spacing:-.02em;margin-bottom:18px}
header h1 .grad{background:linear-gradient(100deg,var(--accent-cyan),var(--accent-purple));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
header p{color:var(--text-secondary);font-size:1.15rem;max-width:60ch;margin:0 auto}
.progress{max-width:980px;margin:34px auto 10px;padding:0 20px}
.progress .bar{height:8px;background:var(--bg-elevated);border-radius:999px;overflow:hidden}
.progress .fill{height:100%;background:linear-gradient(90deg,var(--accent-cyan),var(--accent-emerald));width:$pct%;transition:width 600ms ease-out}
.progress .label{font-family:var(--font-code);font-size:.78rem;color:var(--text-muted);margin-top:8px;text-align:right}
main{padding:30px 0 80px}
.track{font-family:var(--font-display);font-weight:600;font-size:1.3rem;margin:34px 0 14px;color:var(--text-primary)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.card{display:flex;align-items:center;gap:14px;background:var(--bg-surface);border:1px solid var(--bg-elevated);border-radius:var(--radius);padding:16px 18px;text-decoration:none;color:var(--text-primary);transition:var(--transition)}
.card .num{font-family:var(--font-code);font-weight:700;font-size:.85rem;color:var(--accent-cyan);background:var(--bg-elevated);padding:4px 9px;border-radius:6px}
.card .ctitle{flex:1;font-weight:500;font-size:.95rem;line-height:1.3}
.card .cta{font-family:var(--font-code);font-size:.72rem;color:var(--text-muted);border:1px solid var(--bg-elevated);padding:3px 9px;border-radius:999px}
.card.ready:hover{border-color:var(--accent-cyan);transform:translateY(-2px)}
.card.ready .cta{color:var(--accent-cyan);border-color:var(--accent-cyan)}
.card.planned{opacity:.5;cursor:not-allowed}
footer{text-align:center;color:var(--text-muted);font-size:.85rem;padding:0 0 60px}
.install-btn{position:fixed;right:16px;bottom:16px;z-index:60;font-family:var(--font-body);font-weight:600;font-size:.9rem;color:var(--bg-primary);background:var(--accent-cyan);border:none;padding:12px 18px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.45);cursor:pointer}
.install-btn:active{transform:scale(.96)}
@media(max-width:430px){.wrap{padding:0 16px}.grid{grid-template-columns:1fr}header{padding:56px 0 24px}.card{padding:14px}.install-btn{right:12px;bottom:12px}}
@media(prefers-reduced-motion:reduce){*{transition-duration:0ms!important}}
</style>
</head>
<body>
<header>
  <div class="wrap">
    <p class="kicker">For developers who already code</p>
    <h1>Learn <span class="grad">Java</span>,<br>the way it actually works</h1>
    <p>An animated, diagram-rich course. No "what is a variable." Just the JVM, the type system, the idioms, and the reasons behind them — one standalone, offline page per module.</p>
  </div>
</header>
<div class="progress">
  <div class="bar"><div class="fill"></div></div>
  <div class="label">$builtCount of $total modules built &middot; $pct%</div>
</div>
<main>
  <div class="wrap">
$cardsHtml  </div>
</main>
<footer>Built with care &middot; standalone HTML &middot; works offline</footer>
<button class="install-btn" id="installBtn" hidden aria-label="Install this course as an app">&#8595; Install app</button>
<script>
if ('serviceWorker' in navigator) { window.addEventListener('load', function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); }); }
(function(){
  var deferred = null;
  var btn = document.getElementById('installBtn');
  window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); deferred = e; if (btn) btn.hidden = false; });
  if (btn) btn.addEventListener('click', function(){ if (!deferred) return; btn.hidden = true; deferred.prompt(); deferred.userChoice.finally(function(){ deferred = null; }); });
  window.addEventListener('appinstalled', function(){ if (btn) btn.hidden = true; });
})();
</script>
</body>
</html>
"@

$utf8Bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($indexPath, $html, $utf8Bom)
Write-Host "Generated index.html — $builtCount of $total modules built ($pct%)." -ForegroundColor Green
"@" | Out-Null
