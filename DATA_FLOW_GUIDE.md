# Data Flow Diagram

## Overview: How the Application Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                              │
│                       (http://localhost:3000)                       │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ HTTP Requests (JSON)
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       REACT FRONTEND                                │
│                     (client/src/App.js)                             │
│                                                                     │
│  ┌──────────────┐  ┌────────────────────┐  ┌──────────────────┐  │
│  │  Sidebar     │  │ ProspectFinderView │  │ MarketAnalysis   │  │
│  │  Component   │  │    Component       │  │    Component     │  │
│  └──────────────┘  └────────────────────┘  └──────────────────┘  │
│         │                    │                        │            │
│         └────────────────────┴────────────────────────┘            │
│                              │                                      │
│                        Uses Axios                                   │
│                              │                                      │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                               │ API Calls
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     EXPRESS SERVER                                  │
│                   (backend/server.js)                               │
│                  http://localhost:5000/api                          │
│                                                                     │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────────────┐   │
│  │  Prospects   │  │ Market         │  │  Users              │   │
│  │  Routes      │  │ Analysis       │  │  Routes             │   │
│  │              │  │ Routes         │  │                     │   │
│  └──────────────┘  └────────────────┘  └─────────────────────┘   │
│         │                  │                      │                │
│         └──────────────────┴──────────────────────┘                │
│                            │                                        │
│                      Uses mysql2                                    │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             │ SQL Queries
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      MYSQL DATABASE                                 │
│                    (localhost:3306)                                 │
│                    Database: lead_huntrix                           │
│                                                                     │
│  ┌─────────┐  ┌──────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │ users   │  │prospects │  │user_filters  │  │market_analysis │ │
│  └─────────┘  └──────────┘  └──────────────┘  └────────────────┘ │
│                                                                     │
│  ┌────────────────┐  ┌──────────────────┐                         │
│  │prospect_lists  │  │prospect_list_    │                         │
│  │                │  │items             │                         │
│  └────────────────┘  └──────────────────┘                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Example: User Searches for Designers

### Step 1: User Action
```
User types "designer" in search box
User selects "Kuala Lumpur" location filter
User clicks search or presses Enter
```

### Step 2: React Component (ProspectFinderView.js)
```javascript
const fetchProspects = async () => {
  setLoading(true);
  
  const params = new URLSearchParams({
    user_id: 1,
    job_titles: 'designer,fashion designer,interior designer',
    locations: 'Kuala Lumpur',
    search_query: 'designer'
  });
  
  const response = await axios.get(`/api/prospects?${params}`);
  setProspects(response.data.data);
  setLoading(false);
};
```

### Step 3: HTTP Request
```
GET http://localhost:5000/api/prospects
  ?user_id=1
  &job_titles=designer,fashion%20designer,interior%20designer
  &locations=Kuala%20Lumpur
  &search_query=designer
```

### Step 4: Express Route (backend/routes/prospects.js)
```javascript
router.get('/', async (req, res) => {
  const userId = req.query.user_id || 1;
  const { job_titles, locations, search_query } = req.query;
  
  let query = 'SELECT * FROM prospects WHERE user_id = ?';
  const params = [userId];
  
  if (job_titles) {
    const titles = job_titles.split(',');
    query += ` AND job_title IN (${titles.map(() => '?').join(',')})`;
    params.push(...titles);
  }
  
  if (locations) {
    const locs = locations.split(',');
    query += ` AND location IN (${locs.map(() => '?').join(',')})`;
    params.push(...locs);
  }
  
  if (search_query) {
    query += ` AND (name LIKE ? OR job_title LIKE ? OR company_name LIKE ?)`;
    const searchParam = `%${search_query}%`;
    params.push(searchParam, searchParam, searchParam);
  }
  
  const [prospects] = await db.query(query, params);
  res.json({ success: true, data: prospects });
});
```

### Step 5: SQL Query Executed
```sql
SELECT * FROM prospects 
WHERE user_id = 1 
  AND job_title IN ('designer', 'fashion designer', 'interior designer')
  AND location IN ('Kuala Lumpur')
  AND (name LIKE '%designer%' 
    OR job_title LIKE '%designer%' 
    OR company_name LIKE '%designer%')
ORDER BY created_at DESC;
```

### Step 6: Database Returns Results
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "John Doe",
    "job_title": "Senior Designer",
    "location": "Kuala Lumpur",
    "industry": "Technology",
    "company_name": "Tech Solutions Inc",
    ...
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "job_title": "Fashion Designer",
    "location": "Kuala Lumpur",
    ...
  },
  ...
]
```

### Step 7: Express Sends Response
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "John Doe", ... },
    { "id": 2, "name": "Jane Smith", ... },
    ...
  ]
}
```

### Step 8: React Receives & Displays
```javascript
setProspects(response.data.data); // Updates state
// React re-renders with new data
```

### Step 9: User Sees Results
```
Found 5 prospects

┌─────────────────────────────┐
│ John Doe                    │
│ Position: Senior Designer   │
│ at Tech Solutions Inc       │
│ Location: Kuala Lumpur      │
│ Industry: Technology        │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Jane Smith                  │
│ Position: Fashion Designer  │
│ at Fashion House KL         │
│ Location: Kuala Lumpur      │
│ Industry: Retail            │
└─────────────────────────────┘

... (3 more prospects)
```

---

## User-Specific Data Flow

### How Different Users See Different Data

**User 1 logs in (user_id = 1):**
```
React → API: GET /api/prospects?user_id=1
Express → MySQL: SELECT * FROM prospects WHERE user_id = 1
MySQL returns: John, Jane, Mike, Sarah, David (User 1's prospects)
User 1 sees: 5 prospects
```

**User 2 logs in (user_id = 2):**
```
React → API: GET /api/prospects?user_id=2
Express → MySQL: SELECT * FROM prospects WHERE user_id = 2
MySQL returns: Alice, Bob, Charlie (User 2's prospects)
User 2 sees: 3 different prospects
```

**Key Point:** The `WHERE user_id = ?` clause ensures data isolation!

---

## State Management Flow

### How React Manages Application State

```
┌─────────────────────────────────────────────────────────────┐
│                        App.js                               │
│                    (Main Component)                         │
│                                                             │
│  State:                                                     │
│    - activeView: 'prospect-finder'                         │
│    - sidebarClosed: false                                  │
│    - filters: { jobTitles: [...], locations: [...] }      │
│    - userId: 1                                             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │   Pass state & callbacks to children                │ │
│  │                                                      │ │
│  └────┬──────────────────────────┬──────────────────┬──┘ │
│       │                          │                  │     │
│       ↓                          ↓                  ↓     │
│  ┌─────────┐           ┌──────────────────┐   ┌─────────┐│
│  │Sidebar  │           │ProspectFinderView│   │Market   ││
│  │         │           │                  │   │Analysis ││
│  │Receives:│           │Receives:         │   │View     ││
│  │- filters│           │- filters         │   │         ││
│  │         │           │- userId          │   │Receives:││
│  │Updates: │           │                  │   │- userId ││
│  │setFilters()         │Uses:             │   │         ││
│  │         │           │- Fetches from API│   │         ││
│  └─────────┘           └──────────────────┘   └─────────┘│
└─────────────────────────────────────────────────────────────┘

Flow:
1. User modifies filter in Sidebar
2. Sidebar calls setFilters(newFilters)
3. App.js updates filters state
4. React re-renders ProspectFinderView with new filters
5. ProspectFinderView detects filter change (useEffect)
6. ProspectFinderView fetches new data from API
7. Results update automatically
```

---

## Market Analysis Flow

```
User fills form → Clicks "Start Analysis"
         │
         ↓
React Component (MarketAnalysisView.js)
         │
         ├─ setIsAnalyzing(true)
         │  Shows progress screen
         │
         ↓
POST /api/market-analysis
  Body: { user_id: 1, query: "Market analysis..." }
         │
         ↓
Express Server
         │
         ├─ INSERT INTO market_analysis
         │  (user_id, query, status = 'processing')
         │
         ├─ Returns: { id: 1, status: 'processing' }
         │
         ├─ Triggers background job (simulated)
         │  setTimeout(() => {
         │    UPDATE market_analysis 
         │    SET status = 'completed',
         │        analysis_result = {...}
         │    WHERE id = 1
         │  }, 3000)
         │
         └─ In real app: Queue job, use worker
         
         ↓
React displays progress:
  "Deep Market Analysis in Progress... (3-4 minutes)"
         │
         └─ User can click "Back to dashboard"
```

---

## Filter Chip Flow

```
User types "Marketing" → Presses Enter
         │
         ↓
ChipInput Component (in Sidebar.js)
         │
         ├─ Captures keydown event (Enter key)
         │
         ├─ Calls: addChip('departments', 'Marketing')
         │
         ↓
addChip function
         │
         ├─ Checks if chip already exists
         │  (prevents duplicates)
         │
         ├─ Updates filters state:
         │  setFilters({
         │    ...filters,
         │    departments: [...filters.departments, 'Marketing']
         │  })
         │
         ↓
React re-renders
         │
         ├─ New chip appears:
         │  ┌──────────────┬─┐
         │  │ Marketing    │×│
         │  └──────────────┴─┘
         │
         └─ ProspectFinderView detects filter change
            → Fetches new prospects with department filter
```

---

## Database Connection Flow

```
Application Starts
         │
         ↓
backend/server.js loads
         │
         ├─ require('dotenv').config()
         │  Loads .env variables
         │
         ├─ require('./config/database')
         │
         ↓
backend/config/database.js
         │
         ├─ Creates connection pool
         │  mysql.createPool({
         │    host: process.env.DB_HOST,
         │    user: process.env.DB_USER,
         │    password: process.env.DB_PASSWORD,
         │    database: process.env.DB_NAME,
         │    connectionLimit: 10
         │  })
         │
         ├─ Tests connection
         │  pool.getConnection((err, connection) => {
         │    if (err) console.error('Error');
         │    else console.log('Connected to MySQL');
         │  })
         │
         ├─ Exports promise-based pool
         │
         └─ Routes import db and use it:
            const [results] = await db.query('SELECT...');
```

---

## Complete Request/Response Cycle

```
┌─────────────┐
│   Browser   │
│   (User)    │
└──────┬──────┘
       │
       │ 1. User clicks filter
       ↓
┌─────────────────────┐
│  React Component    │
│  (Sidebar.js)       │
│                     │
│  setFilters({...})  │
└──────┬──────────────┘
       │
       │ 2. State update triggers re-render
       ↓
┌─────────────────────────┐
│  React Component        │
│  (ProspectFinderView)   │
│                         │
│  useEffect(() => {      │
│    fetchProspects()     │
│  }, [filters])          │
└──────┬──────────────────┘
       │
       │ 3. axios.get('/api/prospects?...')
       ↓
┌─────────────────────────┐
│  Express Middleware     │
│  (cors, bodyParser)     │
└──────┬──────────────────┘
       │
       │ 4. Route to /api/prospects
       ↓
┌─────────────────────────┐
│  Express Route Handler  │
│  (prospects.js)         │
│                         │
│  Build SQL query        │
│  Add WHERE clauses      │
└──────┬──────────────────┘
       │
       │ 5. db.query(sql, params)
       ↓
┌─────────────────────────┐
│  MySQL Database         │
│                         │
│  Execute query          │
│  Return rows            │
└──────┬──────────────────┘
       │
       │ 6. [rows] returned
       ↓
┌─────────────────────────┐
│  Express Route Handler  │
│                         │
│  res.json({             │
│    success: true,       │
│    data: rows           │
│  })                     │
└──────┬──────────────────┘
       │
       │ 7. JSON response
       ↓
┌─────────────────────────┐
│  Axios (React)          │
│                         │
│  response.data          │
└──────┬──────────────────┘
       │
       │ 8. setProspects(data)
       ↓
┌─────────────────────────┐
│  React Component        │
│                         │
│  State updated          │
│  Re-render with data    │
└──────┬──────────────────┘
       │
       │ 9. DOM updates
       ↓
┌─────────────────────────┐
│  Browser                │
│                         │
│  User sees results      │
└─────────────────────────┘
```

**Total time:** ~50-200ms

---

## Security: SQL Injection Prevention

### ❌ Vulnerable Code (DON'T DO THIS):
```javascript
const userId = req.query.user_id;
const query = `SELECT * FROM prospects WHERE user_id = ${userId}`;
const [results] = await db.query(query);

// ⚠️ If user sends: user_id=1 OR 1=1
// Query becomes: SELECT * FROM prospects WHERE user_id = 1 OR 1=1
// Returns ALL prospects from ALL users!
```

### ✅ Protected Code (DO THIS):
```javascript
const userId = req.query.user_id;
const query = 'SELECT * FROM prospects WHERE user_id = ?';
const [results] = await db.query(query, [userId]);

// ✅ Even if user sends: user_id=1 OR 1=1
// mysql2 escapes it: WHERE user_id = '1 OR 1=1'
// Treats it as a string, not SQL code!
```

---

## Performance Optimization Points

```
┌────────────────────────┐
│  Frontend (React)      │
├────────────────────────┤
│ • Component memoization│ → React.memo()
│ • Debounce search input│ → Wait 300ms before API call
│ • Lazy load components │ → Code splitting
│ • Cache API responses  │ → Store in state
└────────────────────────┘

┌────────────────────────┐
│  Backend (Express)     │
├────────────────────────┤
│ • Connection pooling   │ → Reuse DB connections
│ • Limit SELECT columns │ → Only fetch needed data
│ • Add pagination       │ → LIMIT 20 OFFSET 0
│ • Enable gzip          │ → Compress responses
└────────────────────────┘

┌────────────────────────┐
│  Database (MySQL)      │
├────────────────────────┤
│ • Index columns        │ → CREATE INDEX ON prospects(user_id)
│ • Optimize queries     │ → EXPLAIN SELECT...
│ • Use prepared stmts   │ → Already doing this!
└────────────────────────┘
```

---

This visual guide shows exactly how data flows through your application from user action to database and back!
