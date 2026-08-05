# Sync environment variables from .env.local to Vercel.
# Run after filling .env.local with Supabase keys.
#
# Usage:
#   .\scripts\sync-vercel-env.ps1
#
# Requires: Vercel CLI logged in (vercel whoami)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$envFile = Join-Path $root ".env.local"

if (-not (Test-Path $envFile)) {
    Write-Host "Missing .env.local — copy from .env.example and fill Supabase keys first." -ForegroundColor Red
    exit 1
}

$vars = @(
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_SITE_URL"
)

$environments = @("production", "preview", "development")

foreach ($name in $vars) {
    $line = Get-Content $envFile | Where-Object { $_ -match "^$name=" } | Select-Object -First 1
    if (-not $line) {
        Write-Host "Skip $name (not in .env.local)" -ForegroundColor Yellow
        continue
    }

  $value = $line -replace "^$name=", ""
    $value = $value.Trim('"').Trim("'")

    if ([string]::IsNullOrWhiteSpace($value) -or $value -match "your-") {
        Write-Host "Skip $name (placeholder value)" -ForegroundColor Yellow
        continue
    }

    Write-Host "Setting $name on Vercel..." -ForegroundColor Cyan
    foreach ($env in $environments) {
        $value | vercel env add $name $env --force 2>&1 | Out-Null
    }
}

Write-Host "Done. Redeploy production: vercel --prod" -ForegroundColor Green
