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

$encoded | gh secret set ENV_PRODUCTION --repo home-of-creativity/kuriha-backend

Write-Output "ENV_PRODUCTION updated on home-of-creativity/kuriha-backend"
