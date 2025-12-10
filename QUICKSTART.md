# Quick Start Guide

## First Time Setup (5 minutes)

### Step 1: Install MySQL Database
Make sure MySQL is running on your machine. If not installed, download from https://dev.mysql.com/downloads/

### Step 2: Create Database & Tables
```bash
# Open MySQL command line
mysql -u root -p

# Run the schema file
source backend/config/schema.sql

# Or copy/paste the SQL from backend/config/schema.sql into MySQL
```

### Step 3: Install Backend Dependencies
```powershell
cd backend
npm install
```

### Step 4: Configure Backend Environment
```powershell
# Copy the example file
copy .env.example .env

# Edit .env with your MySQL credentials
notepad .env
```

Update these values in `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=lead_huntrix
```

### Step 5: Install Frontend Dependencies
```powershell
# Open a new PowerShell window
cd client
npm install
```

## Running the Application

### Terminal 1 - Backend Server
```powershell
cd backend
npm run dev
```
You should see: `Server is running on port 5000`

### Terminal 2 - Frontend Server
```powershell
cd client
npm start
```
Browser will open automatically at `http://localhost:3000`

## Verify Everything Works

1. **Check Backend**: Visit http://localhost:5000/api/health
   - Should see: `{"status":"OK","message":"Server is running"}`

2. **Check Frontend**: The app should load at http://localhost:3000
   - You should see the Lead Huntrix interface
   - Try clicking on filters and see prospects load

3. **Test Database Connection**:
   - In the app, the sidebar should show filters
   - Click "Prospect Finder" - should load sample prospects
   - If you see 5 designer prospects, database is working!

## Common Issues

### "Cannot connect to database"
- Check if MySQL is running: `mysql -u root -p`
- Verify credentials in `backend/.env`
- Make sure database `lead_huntrix` exists

### "Port 5000 already in use"
- Change PORT in `backend/.env` to 5001 or another port
- Restart backend server

### "Module not found" errors
- Run `npm install` in both `backend` and `client` directories

### Frontend shows blank page
- Check browser console (F12) for errors
- Make sure backend is running on port 5000
- Check if `proxy` in `client/package.json` matches backend port

## Next Steps

Once everything is running:

1. **Explore the UI**: Try different filters and search queries
2. **Check the Database**: Look at the prospects table to see user-specific data
3. **Test Market Analysis**: Navigate to Market Analysis and try a query
4. **Review the Code**: Check out the React components and API routes

## Production Build

When ready to deploy:

```powershell
# Build the React app
cd client
npm run build

# The build will be in client/build/
# Configure your web server to serve these files
```

## Need Help?

- Check the main README.md for detailed documentation
- Review the API endpoints in backend/routes/
- Inspect the database schema in backend/config/schema.sql
