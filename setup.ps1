# Lead Huntrix - Automated Setup Script for Windows
# This script will help you set up the entire project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Lead Huntrix - Dynamic Setup Script  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✓ npm installed: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed!" -ForegroundColor Red
    exit 1
}

# Check MySQL
Write-Host ""
Write-Host "Checking MySQL..." -ForegroundColor Yellow
try {
    $mysqlVersion = mysql --version
    Write-Host "✓ MySQL installed" -ForegroundColor Green
} catch {
    Write-Host "⚠ MySQL command not found in PATH" -ForegroundColor Yellow
    Write-Host "  Please ensure MySQL is installed and running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location backend
Write-Host "Installing backend packages..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Configuring Backend Environment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠ IMPORTANT: Please edit backend\.env with your MySQL credentials!" -ForegroundColor Yellow
    Write-Host "  File location: backend\.env" -ForegroundColor Yellow
    Write-Host "  Required settings:" -ForegroundColor Yellow
    Write-Host "    DB_USER=your_mysql_username" -ForegroundColor White
    Write-Host "    DB_PASSWORD=your_mysql_password" -ForegroundColor White
    Write-Host ""
    $editNow = Read-Host "Would you like to edit it now? (Y/N)"
    if ($editNow -eq "Y" -or $editNow -eq "y") {
        notepad ".env"
    }
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 3: Installing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location client
Write-Host "Installing frontend packages (this may take a few minutes)..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 4: Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To complete the setup, you need to create the MySQL database." -ForegroundColor Yellow
Write-Host "Please run the following commands in MySQL:" -ForegroundColor Yellow
Write-Host ""
Write-Host "mysql -u root -p" -ForegroundColor White
Write-Host "source backend/config/schema.sql" -ForegroundColor White
Write-Host ""
Write-Host "Or manually execute the SQL from: backend\config\schema.sql" -ForegroundColor White
Write-Host ""

$setupDB = Read-Host "Have you set up the database? (Y/N)"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Make sure MySQL is running" -ForegroundColor White
Write-Host "2. Verify backend\.env has correct database credentials" -ForegroundColor White
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Terminal 1 (Backend):" -ForegroundColor Cyan
Write-Host "    cd backend" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "  Terminal 2 (Frontend):" -ForegroundColor Cyan
Write-Host "    cd client" -ForegroundColor White
Write-Host "    npm start" -ForegroundColor White
Write-Host ""
Write-Host "Then visit: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "For detailed instructions, see QUICKSTART.md" -ForegroundColor Yellow
Write-Host ""
