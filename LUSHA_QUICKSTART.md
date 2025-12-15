# Lusha API Integration - Quick Start Guide

## 🎯 What's New

Your Lead Huntrix application now uses **Lusha API** for prospect filtering and searching instead of the local database. This gives you access to millions of B2B contacts and companies worldwide.

## 🔄 How It Works Now

### Before (Old System):
- Filters searched your local database
- Limited to data you manually uploaded
- Static filter options

### After (New System):
- Filters dynamically load from Lusha API
- Search across Lusha's entire B2B database
- Real-time, up-to-date contact information

## 🚀 Setup Instructions

### Step 1: Get Your Lusha API Key

1. Go to [Lusha.com](https://www.lusha.com/)
2. Sign up for an account (or log in)
3. Navigate to **Settings** → **API**
4. Generate your API key
5. Copy the API key

### Step 2: Configure Backend

1. Navigate to the backend folder:
   ```powershell
   cd "C:\Users\User\Desktop\repo\lead huntrix\lead-huntrix\backend"
   ```

2. Create a `.env` file (if it doesn't exist):
   ```powershell
   Copy-Item .env.example .env
   ```

3. Open `.env` in a text editor and add your Lusha API key:
   ```
   LUSHA_API_KEY=your-actual-api-key-here
   ```

4. Save the file

### Step 3: Start the Servers

1. **Start Backend** (in backend folder):
   ```powershell
   npm run dev
   ```

2. **Start Frontend** (in client folder - new terminal):
   ```powershell
   cd "C:\Users\User\Desktop\repo\lead huntrix\lead-huntrix\client"
   npm start
   ```

## 📋 Using the New System

### 1. Filter Loading
- Click on any filter field (Department, Seniority, Industry, etc.)
- Options will load automatically from Lusha API
- Select the options you want

### 2. Searching
- Fill in your desired filters
- Click the **Search** button
- Results will come from Lusha's database

### 3. Understanding Results
- **Available** (with lock icon): Data exists but needs enrichment
- **Actual data**: Already available to view
- **Not available**: Data doesn't exist in Lusha

### 4. Enrichment (Coming Soon)
- Select prospects using checkboxes
- Click **Enrich Selected** button
- Currently shows a placeholder message
- Will unlock email/phone data when fully implemented

## 🔧 Available Filters

### Contact Filters:
- ✅ **Job Titles**: Enter specific job titles
- ✅ **Management Level (Seniority)**: Entry, Manager, Director, VP, C-Level
- ✅ **Department**: Sales, Marketing, HR, Finance, Technology, etc.
- ✅ **Location**: Countries and cities

### Company Filters:
- ✅ **Company Name**: Search for specific companies
- ✅ **Industry**: Technology, Finance, Healthcare, etc.
- ✅ **Company Size**: Employee count ranges
- ✅ **Revenue**: Revenue ranges

## 🧪 Testing the Integration

1. Open the application
2. Go to **Prospect Finder**
3. Click on **Department** filter
4. You should see a list load from Lusha
5. Select a few departments (e.g., "Sales", "Marketing")
6. Click **Search**
7. You should see contacts from Lusha's database

## 🐛 Troubleshooting

### Filters Not Loading:
- ✅ Check if `LUSHA_API_KEY` is set in `.env`
- ✅ Restart the backend server
- ✅ Check browser console for errors
- ✅ Verify API key is valid on Lusha.com

### No Search Results:
- ✅ Try broader filters (e.g., just Department)
- ✅ Check backend console for error messages
- ✅ Verify backend is running on port 5000
- ✅ Check if API key has credits/quota

### Server Errors:
- ✅ Make sure axios is installed: `npm install axios` in backend
- ✅ Check if all new files exist:
  - `backend/services/lushaService.js`
  - `backend/routes/lusha.js`
- ✅ Verify server.js imports the lusha routes

## 📊 API Endpoints Created

### Filter Endpoints:
```
GET  /api/lusha/filters/contacts/departments
GET  /api/lusha/filters/contacts/seniority
GET  /api/lusha/filters/contacts/datapoints
GET  /api/lusha/filters/contacts/countries
POST /api/lusha/filters/contacts/locations

GET  /api/lusha/filters/companies/industries
GET  /api/lusha/filters/companies/sizes
GET  /api/lusha/filters/companies/revenues
POST /api/lusha/filters/companies/names
POST /api/lusha/filters/companies/locations
```

### Search Endpoints:
```
POST /api/lusha/search/contacts
POST /api/lusha/search/companies
```

## 📝 Example API Request

When you click "Search", the frontend sends a request like this:

```javascript
POST /api/lusha/search/contacts

{
  "filters": {
    "contacts": {
      "include": {
        "departments": ["Sales", "Marketing"],
        "seniority": ["Manager", "Director"]
      }
    },
    "companies": {
      "include": {
        "industries": ["Technology"],
        "sizes": [{ "min": 50, "max": 200 }]
      }
    }
  },
  "page": 0,
  "size": 50
}
```

## 🎓 Next Steps

1. **Test the Integration**: Try different filter combinations
2. **Implement Enrichment**: Add actual enrichment API calls (currently placeholder)
3. **Add Caching**: Cache filter options to reduce API calls
4. **Pagination**: Add pagination for large result sets
5. **Save to Database**: Allow saving prospects to your local database

## 📚 Additional Resources

- [Lusha API Documentation](https://docs.lusha.com/)
- Full integration details: See `LUSHA_INTEGRATION.md`
- Backend service: `backend/services/lushaService.js`
- Frontend integration: `client/src/components/Sidebar.js`

## ⚠️ Important Notes

- **API Limits**: Lusha has rate limits and credit quotas
- **Enrichment**: Currently a placeholder - needs implementation
- **Caching**: Consider caching filter options to save API calls
- **Error Handling**: Check console logs for detailed error messages

---

**Need Help?** Check the browser console (F12) and backend terminal for error messages.
