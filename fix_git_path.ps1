$gitPath = 'C:\Program Files\Git\cmd'
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$gitPath*") {
    $newPath = if ($currentPath) { "$currentPath;$gitPath" } else { $gitPath }
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "Successfully added Git to User PATH."
}
else {
    Write-Host "Git path is already in User PATH."
}
