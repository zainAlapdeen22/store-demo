# Script to collect all important files for upload
Write-Host "Collecting project files..." -ForegroundColor Green

$projectFiles = @()

# Get all TypeScript/JavaScript files (excluding node_modules, .next, etc.)
Get-ChildItem -Path . -Recurse -Include *.ts, *.tsx, *.js, *.jsx, *.json, *.css, *.mjs -Exclude node_modules, .next, .git, __MACOSX, .vercel | ForEach-Object {
    $relativePath = $_.FullName.Replace($PWD.Path + "\", "").Replace("\", "/")
    $projectFiles += [PSCustomObject]@{
        Path     = $relativePath
        FullPath = $_.FullName
        Size     = $_.Length
    }
}

# Add markdown and config files
Get-ChildItem -Path . -Recurse -Include *.md, *.yml, *.yaml, .gitignore, .env.example -Exclude node_modules, .next, .git, __MACOSX, .vercel | ForEach-Object {
    $relativePath = $_.FullName.Replace($PWD.Path + "\", "").Replace("\", "/")
    $projectFiles += [PSCustomObject]@{
        Path     = $relativePath
        FullPath = $_.FullName
        Size     = $_.Length
    }
}

# Output summary
Write-Host "`nFound $($projectFiles.Count) files" -ForegroundColor Cyan
$projectFiles | Select-Object Path, Size | Format-Table -AutoSize

# Save to file for AI to upload
$projectFiles | Select-Object Path | ConvertTo-Json | Out-File -FilePath "files_to_upload.json" -Encoding UTF8

Write-Host "`nFile list saved to files_to_upload.json" -ForegroundColor Green
Write-Host "Total files: $($projectFiles.Count)" -ForegroundColor Yellow
