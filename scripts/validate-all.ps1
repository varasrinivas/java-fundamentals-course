# validate-all.ps1 — Run audit on every module in the modules/ directory
# Usage: .\validate-all.ps1

$modulesDir = Join-Path $PSScriptRoot "..\modules"
$validateScript = Join-Path $PSScriptRoot "validate-module.ps1"

if (-not (Test-Path $modulesDir)) {
    Write-Host "❌ modules/ directory not found" -ForegroundColor Red
    exit 1
}

$files = Get-ChildItem $modulesDir -Filter "module-*.html" | Sort-Object Name
if ($files.Count -eq 0) {
    Write-Host "❌ No module files found in modules/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  Full Course Validation                  ║" -ForegroundColor Magenta
Write-Host "║  Found $($files.Count) module(s)                       ║" -ForegroundColor Magenta
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Magenta

$totalPass = 0
$totalFail = 0

foreach ($file in $files) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    & $validateScript -File $file.FullName
}

Write-Host ""
Write-Host "══════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  Validated $($files.Count) module(s)" -ForegroundColor White
Write-Host "══════════════════════════════════════════" -ForegroundColor Magenta
