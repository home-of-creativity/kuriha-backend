$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.production"

if (-not (Test-Path $envFile)) {
    throw "Missing $envFile"
}

$text = [System.IO.File]::ReadAllText($envFile)
$text = $text -replace "`r`n", "`n"
if (-not $text.EndsWith("`n")) {
    $text += "`n"
}

$bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
$encoded = [Convert]::ToBase64String($bytes)

gh api --method PUT -H "Accept: application/vnd.github+json" "repos/home-of-creativity/kuriha-backend/environments/production" | Out-Null
if ($LASTEXITCODE -ne 0) { throw "Could not create the production environment" }

$encoded | gh secret set ENV_PRODUCTION --repo home-of-creativity/kuriha-backend --env production
if ($LASTEXITCODE -ne 0) { throw "Could not set ENV_PRODUCTION" }

Write-Output "ENV_PRODUCTION updated on environment production"
