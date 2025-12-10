# Development Guide

## Project Overview

Lead Huntrix is now a full-stack MERN-like application (MySQL instead of MongoDB):
- **M**ySQL - Database
- **E**xpress - Backend framework
- **R**eact - Frontend library
- **N**ode.js - Runtime environment

## Development Workflow

### Day-to-Day Development

1. **Start both servers** (requires 2 terminal windows):

   **Terminal 1 - Backend:**
   ```powershell
   cd backend
   npm run dev
   ```
   This runs nodemon which auto-restarts on file changes.

   **Terminal 2 - Frontend:**
   ```powershell
   cd client
   npm start
   ```
   This runs webpack-dev-server with hot module replacement.

2. **Make changes** to files
3. **See updates automatically** - both servers auto-reload

### Making Backend Changes

#### Adding a new API endpoint

1. **Choose the appropriate route file** in `backend/routes/`:
   - `prospects.js` - for prospect-related endpoints
   - `marketAnalysis.js` - for market analysis
   - `users.js` - for user management
   - Or create a new route file

2. **Add your endpoint**:
   ```javascript
   // backend/routes/prospects.js
   router.get('/my-new-endpoint', async (req, res) => {
     try {
       const [results] = await db.query('SELECT * FROM table');
       res.json({ success: true, data: results });
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   });
   ```

3. **Test it**:
   - Visit `http://localhost:5000/api/prospects/my-new-endpoint`
   - Or use Postman/Insomnia

4. **Update frontend** to use it (see Frontend Changes below)

#### Modifying the Database Schema

1. **Update** `backend/config/schema.sql`
2. **Apply changes** to your database:
   ```sql
   mysql -u root -p
   USE lead_huntrix;
   -- Run your ALTER TABLE or CREATE TABLE statements
   ```
3. **Update code** that uses the modified tables

#### Database Query Best Practices

Always use parameterized queries to prevent SQL injection:

```javascript
// ✅ GOOD - Parameterized
const [results] = await db.query(
  'SELECT * FROM prospects WHERE user_id = ? AND location = ?',
  [userId, location]
);

// ❌ BAD - String concatenation (SQL injection risk!)
const query = `SELECT * FROM prospects WHERE user_id = ${userId}`;
```

### Making Frontend Changes

#### Adding a New Component

1. **Create the component** in `client/src/components/`:
   ```javascript
   // MyNewComponent.js
   import React from 'react';
   
   const MyNewComponent = ({ prop1, prop2 }) => {
     return (
       <div className="my-component">
         {/* Your JSX */}
       </div>
     );
   };
   
   export default MyNewComponent;
   ```

2. **Import and use** in `App.js` or parent component:
   ```javascript
   import MyNewComponent from './components/MyNewComponent';
   
   // In render:
   <MyNewComponent prop1="value" prop2={stateValue} />
   ```

3. **Add styles** to `App.css`:
   ```css
   .my-component {
     /* Your styles */
   }
   ```

#### Fetching Data from API

Use axios in your component:

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/your-endpoint');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>Data loaded</p>}
    </div>
  );
};
```

#### State Management Tips

- Use `useState` for component-level state
- Pass state down through props
- Lift state up to common parent when needed
- Consider Context API for deeply nested components

Example of lifting state:
```javascript
// App.js manages filters
const [filters, setFilters] = useState({});

// Pass down to children
<Sidebar filters={filters} setFilters={setFilters} />
<ProspectView filters={filters} />
```

### Adding New Features

#### Example: Add "Company Website" field to prospects

**1. Database** (`backend/config/schema.sql`):
```sql
ALTER TABLE prospects ADD COLUMN website VARCHAR(255);
```

**2. Backend Route** (`backend/routes/prospects.js`):
```javascript
// Update POST endpoint to include website
const { website, ...otherFields } = req.body;
await db.query(
  'INSERT INTO prospects (..., website) VALUES (..., ?)',
  [...otherValues, website]
);
```

**3. Frontend Component** (`client/src/components/ProspectFinderView.js`):
```javascript
// Display website in prospect card
<p>
  <strong>Website:</strong> 
  <a href={prospect.website} target="_blank" rel="noopener noreferrer">
    {prospect.website}
  </a>
</p>
```

**4. Sidebar Filter** (if needed):
```javascript
// Add new filter input in Sidebar.js
<ChipInput filterKey="websites" placeholder="Enter website" />
```

### Debugging

#### Backend Debugging

1. **Console logs**:
   ```javascript
   console.log('Debug:', variable);
   ```
   Shows in the terminal running `npm run dev`

2. **Database queries**:
   ```javascript
   console.log('Query:', query);
   console.log('Params:', params);
   const [results] = await db.query(query, params);
   console.log('Results:', results);
   ```

3. **Error handling**:
   ```javascript
   try {
     // code
   } catch (error) {
     console.error('Error details:', error);
     res.status(500).json({ error: error.message });
   }
   ```

#### Frontend Debugging

1. **Browser DevTools** (F12):
   - Console: See `console.log()` output
   - Network: Monitor API requests
   - React DevTools: Inspect component state

2. **React state debugging**:
   ```javascript
   console.log('Current state:', filters);
   useEffect(() => {
     console.log('Filters changed:', filters);
   }, [filters]);
   ```

3. **API call debugging**:
   ```javascript
   const response = await axios.get('/api/prospects');
   console.log('Response:', response.data);
   ```

### Testing

#### Manual API Testing

Use curl, Postman, or browser:

```powershell
# Test GET endpoint
curl http://localhost:5000/api/prospects?user_id=1

# Test POST endpoint
curl -X POST http://localhost:5000/api/prospects `
  -H "Content-Type: application/json" `
  -d '{"user_id":1,"name":"Test User","job_title":"Developer"}'
```

#### Database Testing

```sql
-- Check if data was inserted
SELECT * FROM prospects WHERE user_id = 1;

-- Test filtering logic
SELECT * FROM prospects 
WHERE user_id = 1 
AND job_title LIKE '%designer%';
```

### Common Issues & Solutions

#### "Cannot connect to database"
```javascript
// Check in backend/config/database.js
// Verify credentials in .env
// Ensure MySQL is running
```

#### "CORS error"
```javascript
// backend/server.js should have:
const cors = require('cors');
app.use(cors());
```

#### "Module not found"
```powershell
# Run in the directory with package.json
npm install
```

#### "Port already in use"
```powershell
# Find process using port
netstat -ano | findstr :5000
# Kill process
taskkill /PID <process_id> /F
# Or change port in .env
```

### Code Style Guidelines

#### Backend
- Use async/await for database operations
- Always use try/catch blocks
- Return consistent JSON format: `{ success: true/false, data: ... }`
- Use meaningful variable names
- Add comments for complex logic

#### Frontend
- One component per file
- Functional components with hooks (not class components)
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use meaningful prop names

#### Database
- Use parameterized queries
- Index frequently queried columns
- Include foreign key constraints
- Always filter by user_id for user-specific data

### Git Workflow

```powershell
# Before starting work
git pull origin main

# Create feature branch
git checkout -b feature/my-new-feature

# Make changes and commit
git add .
git commit -m "Add: my new feature description"

# Push to remote
git push origin feature/my-new-feature

# Create pull request on GitHub
```

### Performance Optimization

#### Backend
- Add pagination to list endpoints
- Use database indexes
- Cache frequently accessed data
- Limit SELECT columns to what's needed

#### Frontend
- Use React.memo for expensive components
- Debounce search inputs
- Lazy load components
- Optimize images

### Environment Setup

#### Development
- Backend: Port 5000, auto-reload enabled
- Frontend: Port 3000, hot reload enabled
- Database: Local MySQL

#### Production
- Build frontend: `npm run build`
- Serve static files from Express
- Use environment variables for config
- Enable compression
- Add rate limiting

### Useful Commands

```powershell
# Install all dependencies
npm run install-all

# Clean install
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install

# Check for outdated packages
npm outdated

# Update packages
npm update

# Check MySQL status
mysql -u root -p -e "SELECT 1"

# View backend logs
cd backend; npm run dev

# Build production frontend
cd client; npm run build
```

### Resources

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [Node.js Docs](https://nodejs.org/docs)
- [Axios Docs](https://axios-http.com)

### Getting Help

1. Check error messages in terminal/console
2. Review this guide
3. Check QUICKSTART.md for setup issues
4. Review README.md for architecture overview
5. Inspect MIGRATION_SUMMARY.md for understanding changes
