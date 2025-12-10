# Setup Guide for Existing Database

## Your Existing Database Schema

You already have:
- **users** table: `user_id`, `username`, `email`, `password_hash`, `created_at`
- **user_data** table: `id`, `user_id`, `lusha_id`, `name`, `JobTitle`

## Steps to Set Up

### 1. Run the Updated Schema
```sql
mysql -u root -p
USE lead_huntrix;
source backend/config/schema.sql
```

This will create the additional tables:
- `prospects` (links to your existing `user_data`)
- `user_filters`
- `market_analysis`
- `prospect_lists`
- `prospect_list_items`

### 2. Configure Backend
```powershell
cd backend
copy .env.example .env
```

Edit `backend\.env`:
```
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=lead_huntrix
```

### 3. Install Dependencies
```powershell
# Backend
cd backend
npm install

# Frontend
cd ../client
npm install
```

### 4. Start the Application
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### 5. Sync Existing Data (Optional)

To sync your existing `user_data` into the `prospects` table, make an API call:

```powershell
curl -X POST http://localhost:5000/api/prospects/sync-from-user-data `
  -H "Content-Type: application/json" `
  -d '{\"user_id\":1}'
```

Replace `user_id` with the actual user ID from your `users` table.

## How It Works

### Data Relationship

```
users (existing)
  └─ user_data (existing)
       └─ prospects (new - extends user_data with additional fields)
```

The `prospects` table:
- References your existing `users.user_id`
- Can link to `user_data.id` (optional)
- Stores additional fields like `management_level`, `department`, `location`, etc.
- Can be populated from `user_data` using the sync endpoint

### Querying Data

The app will query prospects by `user_id`, so each user only sees their own data:

```sql
SELECT * FROM prospects WHERE user_id = ?
```

### Using Existing user_data

You can keep using your `user_data` table. The `prospects` table extends it with additional fields needed for the Lead Huntrix features.

## API Endpoints

### Sync Data from user_data
```
POST /api/prospects/sync-from-user-data
Body: { "user_id": 1 }
```

### Get Prospects
```
GET /api/prospects?user_id=1
```

### All other endpoints
See `API_DOCUMENTATION.md` for complete list.

## Notes

- Your existing `users` and `user_data` tables are **not modified**
- New tables work alongside your existing schema
- Each user's data is isolated by `user_id`
- You can sync data from `user_data` to `prospects` anytime
