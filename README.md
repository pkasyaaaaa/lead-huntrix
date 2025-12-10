# Lead Huntrix - Dynamic Web Application

A full-stack web application for AI-powered prospect finding and market analysis. Built with React, Node.js, Express, and MySQL.

## 🏗️ Architecture

This application has been converted from a static HTML page to a dynamic full-stack application with:

- **Frontend**: React (client-side rendering)
- **Backend**: Node.js + Express (RESTful API)
- **Database**: MySQL (user-specific data storage)

## 📁 Project Structure

```
lead-huntrix/
├── backend/                 # Express API server
│   ├── config/
│   │   ├── database.js     # MySQL connection
│   │   └── schema.sql      # Database schema
│   ├── routes/
│   │   ├── prospects.js    # Prospect endpoints
│   │   ├── marketAnalysis.js
│   │   └── users.js
│   ├── server.js           # Main server file
│   ├── package.json
│   └── .env.example
│
├── client/                  # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js
│   │   │   ├── ProspectFinderView.js
│   │   │   └── MarketAnalysisView.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── image/                   # Static assets (logos)
├── index.html              # Original static file (deprecated)
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### 1. Database Setup

First, set up your MySQL database:

```bash
# Login to MySQL
mysql -u root -p

# Create database and tables
source backend/config/schema.sql
```

Alternatively, you can run the SQL commands manually from `backend/config/schema.sql`.

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env and add your database credentials
# DB_HOST=localhost
# DB_USER=your_mysql_user
# DB_PASSWORD=your_mysql_password
# DB_NAME=lead_huntrix

# Start the backend server
npm run dev
```

The backend API will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will run on `http://localhost:3000`

## 🔌 API Endpoints

### Prospects

- `GET /api/prospects` - Get all prospects with filters
  - Query params: `user_id`, `job_titles`, `management_levels`, `departments`, `locations`, `industries`, `skills`, `search_query`
- `GET /api/prospects/:id` - Get single prospect
- `POST /api/prospects` - Create new prospect
- `PUT /api/prospects/:id` - Update prospect
- `DELETE /api/prospects/:id` - Delete prospect
- `GET /api/prospects/suggestions/filters` - Get filter suggestions

### Market Analysis

- `POST /api/market-analysis` - Create new analysis
- `GET /api/market-analysis/:id` - Get analysis result
- `GET /api/market-analysis` - Get all analyses for user
- `GET /api/market-analysis/suggestions/prompts` - Get suggestion prompts

### Users

- `GET /api/users/:id` - Get user details
- `GET /api/users/:userId/filters` - Get saved filters
- `POST /api/users/:userId/filters` - Save filter
- `GET /api/users/:userId/lists` - Get prospect lists
- `POST /api/users/:userId/lists` - Create prospect list

## 🎯 Key Features

### User-Specific Data

Each user sees different prospects based on their `user_id`. The application filters all data by user to ensure data isolation.

### Dynamic Filtering

- Job titles
- Management levels
- Departments
- Locations
- Industries
- Skills
- Company size
- Revenue ranges

### Real-time Search

Prospects are fetched from the database based on active filters and search queries.

### Market Analysis

Users can request market analysis which is processed and stored in the database.

## 🔧 Development

### Running in Development Mode

**Backend** (with auto-reload):
```bash
cd backend
npm run dev
```

**Frontend** (with hot-reload):
```bash
cd client
npm start
```

### Building for Production

**Frontend**:
```bash
cd client
npm run build
```

This creates an optimized production build in the `client/build` directory.

**Backend**:
```bash
cd backend
npm start
```

For production deployment, you can serve the React build files from Express:

```javascript
// Add to backend/server.js
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
```

## 📊 Database Schema

The application uses 6 main tables:

- `users` - User accounts
- `prospects` - Prospect data (linked to users)
- `user_filters` - Saved filter preferences
- `market_analysis` - Market analysis history
- `prospect_lists` - Named prospect lists
- `prospect_list_items` - List membership

See `backend/config/schema.sql` for complete schema.

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lead_huntrix
DB_PORT=3306
```

## 🐛 Troubleshooting

### Database Connection Issues

- Verify MySQL is running
- Check credentials in `.env`
- Ensure database `lead_huntrix` exists

### Port Conflicts

- Backend default: 5000
- Frontend default: 3000
- Change ports in `.env` (backend) or `package.json` (frontend proxy)

### CORS Issues

The backend uses CORS middleware to allow requests from the React frontend.

## 📝 Migration from Static to Dynamic

The original static HTML files (`index.html`, `frontend/ai.html`) have been converted to:

1. **React Components**: Modular, reusable UI components
2. **RESTful API**: Express endpoints for data operations
3. **MySQL Database**: Persistent storage with user-specific data
4. **State Management**: React hooks for managing application state

## 🎨 Styling

All original CSS has been preserved in `client/src/App.css`. The responsive design and animations work identically to the original static version.

## 📦 Dependencies

### Backend
- express - Web framework
- mysql2 - MySQL client
- cors - Cross-origin resource sharing
- dotenv - Environment configuration
- body-parser - Request parsing

### Frontend
- react - UI library
- react-dom - React rendering
- react-router-dom - Client-side routing
- axios - HTTP client
- react-scripts - Build tools

## 🚢 Deployment

For production deployment:

1. Set up MySQL on your server
2. Run the schema.sql to create tables
3. Configure environment variables
4. Build the React app: `cd client && npm run build`
5. Start the backend: `cd backend && npm start`
6. Use a process manager like PM2 for the Node.js server
7. Set up a reverse proxy (Nginx/Apache) to serve the application

## 👥 Default User

A demo user is created automatically:
- Username: `demo_user`
- Email: `demo@leadhuntrix.com`
- ID: 1

## 📄 License

ISC

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.