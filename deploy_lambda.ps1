# PowerShell script to build, extract, and zip Lambda deployment package
# Run this script from the project root

$ErrorActionPreference = 'Stop'

# Paths
$backendPath = "backend"
$packagePath = "lambda-package"
$zipPath = "lambda-deploy.zip"

# Remove old package and zip if they exist
if (Test-Path $packagePath) { Remove-Item -Recurse -Force $packagePath }
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

# Build Docker image
Write-Host "Building Docker image..."
docker build -t lambda-build $backendPath

# Create container
Write-Host "Creating temporary Docker container..."
docker create --name lambda-temp lambda-build

# Copy out the build
Write-Host "Copying build output from container..."
docker cp lambda-temp:/var/task ./$packagePath

# Remove container
Write-Host "Removing temporary Docker container..."
docker rm lambda-temp


Write-Host "\nDeployment package created: $zipPath"
Write-Host "\nNext steps:"
Write-Host "1. Go to the AWS Lambda Console."
Write-Host "2. Create or update your Lambda function (Python 3.11/3.13)."
Write-Host "3. Upload $zipPath as the function code."
Write-Host "4. Set the handler to app.main.handler."
Write-Host "\nDone!" 