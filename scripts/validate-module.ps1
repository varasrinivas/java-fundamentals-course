# validate-module.ps1 — Check a module HTML file against course standards
# Usage: .\validate-module.ps1 .\modules\module-01-jvm-machine.html

param(
    [Parameter(Mandatory=$true)]
    [string]$File
)

if (-not (Test-Path $File)) {
    Write-Host "❌ File not found: $File" -ForegroundColor Red
    exit 1
}

$content = Get-Content $File -Raw
$fileName = Split-Path $File -Leaf

$pass = 0
$fail = 0

function Check {
    param([string]$Label, [bool]$Result)
    if ($Result) {
        Write-Host "  ✅ $Label" -ForegroundColor Green
        $script:pass++
    } else {
        Write-Host "  ❌ $Label" -ForegroundColor Red
        $script:fail++
    }
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Module Audit: $fileName" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "── Structure ──" -ForegroundColor Yellow
Check 'Has <nav class="module-nav">' ($content -match 'class="module-nav"')
Check 'Has section.concept' ($content -match 'class="concept"')
Check 'Has section.step-through' ($content -match 'class="step-through"')
Check 'Has section.playground' ($content -match 'class="playground"')
Check 'Has section.gotchas' ($content -match 'class="gotchas"')
Check 'Has section.exercises' ($content -match 'class="exercises"')

Write-Host ""
Write-Host "── Design System ──" -ForegroundColor Yellow
Check 'Design tokens present (--bg-primary)' ($content -match '--bg-primary')
Check 'Uses Fraunces font' ($content -match 'Fraunces')
Check 'Uses JetBrains Mono' ($content -match 'JetBrains Mono')
Check 'Uses Inter font' ($content -match "'Inter'")

Write-Host ""
Write-Host "── Accessibility ──" -ForegroundColor Yellow
Check 'prefers-reduced-motion' ($content -match 'prefers-reduced-motion')
Check 'SVGs have viewBox' ($content -match 'viewBox')

Write-Host ""
Write-Host "── Animation Controls ──" -ForegroundColor Yellow
Check 'Has Play/Pause control' ($content -match 'Play|Pause')
Check 'Has Step control' ($content -match 'stepForward|stepBack|Step')
Check 'Has Reset control' ($content -match 'Reset|reset')

Write-Host ""
Write-Host "── Coming From Callouts ──" -ForegroundColor Yellow
$pythonCallout = ($content -match 'callout-python|Coming from Python')
$jsCallout = ($content -match 'callout-js|Coming from JavaScript')
$goCallout = ($content -match 'callout-go|Coming from Go')
$csharpCallout = ($content -match 'callout-csharp|Coming from C#')

Check 'Python callout' $pythonCallout
Check 'JavaScript callout' $jsCallout
$totalCallouts = @($pythonCallout, $jsCallout, $goCallout, $csharpCallout) | Where-Object { $_ } | Measure-Object | Select-Object -ExpandProperty Count
Check 'At least 2 language callouts' ($totalCallouts -ge 2)

Write-Host ""
Write-Host "── Dependencies ──" -ForegroundColor Yellow
$extMatches = [regex]::Matches($content, 'src="https?://|href="https?://.*\.(js|css)"')
$fontMatches = [regex]::Matches($content, 'fonts\.googleapis\.com')
$nonFontExt = $extMatches.Count - $fontMatches.Count
Check 'No external JS/CSS (fonts OK)' ($nonFontExt -le 0)

Write-Host ""
Write-Host "── File Size ──" -ForegroundColor Yellow
$sizeKB = [math]::Round((Get-Item $File).Length / 1024)
Check "Under 250KB (${sizeKB}KB)" ($sizeKB -lt 250)

Write-Host ""
Write-Host "════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Results: ✅ $pass passed, ❌ $fail failed" -ForegroundColor White
if ($fail -eq 0) {
    Write-Host "  Status: ✅ PASS" -ForegroundColor Green
} else {
    Write-Host "  Status: ❌ NEEDS FIXES" -ForegroundColor Red
}
Write-Host "════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
