# Lusha API Integration - Implementation Guide

This document explains the Lusha API integration for the Lead Huntrix application.

## Overview

The application has been updated to use Lusha API for prospect filtering and searching instead of the local database. This provides access to Lusha's extensive B2B contact database.

## What Has Changed

### 1. Filter System
- **Before**: Filters searched local database
- **After**: Filters fetch options from Lusha API and search Lusha's database

### 2. Backend Changes

#### New Files Created:
- `backend/services/lushaService.js` - Service layer for Lusha API calls
- `backend/routes/lusha.js` - API routes for Lusha integration
- `backend/.env.example` - Environment variables template

#### Key Features:
- **Contact Filters**: Departments, Seniority, Data Points, Countries, Locations
- **Company Filters**: Names, Industries, Sizes, Revenues, Locations, SIC/NAICS codes, Intent Topics, Technologies
- **Search**: Contact search and Company search with pagination

### 3. Frontend Changes

#### Updated Components:
- `Sidebar.js`: Now fetches filter options from Lusha API dynamically
  - Departments load from `/api/lusha/filters/contacts/departments`
  - Seniority levels load from `/api/lusha/filters/contacts/seniority`
  - Industries load from `/api/lusha/filters/companies/industries`
  - Company sizes and revenues load dynamically

- `ProspectFinderView.js`: Sends search requests to Lusha API
  - Builds filter object compatible with Lusha API
  - Calls `/api/lusha/search/contacts` endpoint

- `ProspectFinderResults.js`: Displays Lusha API results
  - Shows contact information from Lusha
  - Indicates which data is available but locked (requires enrichment)
  - Includes placeholder for enrichment feature

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install axios
```

### 2. Configure Lusha API Key

Create a `.env` file in the backend folder:
```bash
cp .env.example .env
```

Edit `.env` and add your Lusha API key:
```
LUSHA_API_KEY=your-actual-lusha-api-key-here
```

To get a Lusha API key:
1. Sign up at https://www.lusha.com/
2. Go to API settings
3. Generate an API key

### 3. Restart the Server
```bash
cd backend
npm run dev
```

## How It Works

### Filter Flow:
1. User clicks on a filter field (e.g., Department)
2. Frontend calls `/api/lusha/filters/contacts/departments`
3. Backend calls Lusha API and returns available options
4. User selects from real Lusha filter options

### Search Flow:
1. User selects filters and clicks "Search"
2. Frontend builds Lusha-compatible filter object
3. Frontend calls `/api/lusha/search/contacts` with filters
4. Backend forwards request to Lusha API
5. Results displayed in ProspectFinderResults component

### Data Structure:

**Lusha API Request Format:**
```javascript
{
  "pages": {
    "page": 0,
    "size": 50
  },
  "filters": {
    "contacts": {
      "include": {
        "departments": ["Sales", "Marketing"],
        "seniority": ["Manager", "Director"],
        "jobTitles": ["Sales Manager"]
      }
    },
    "companies": {
      "include": {
        "names": ["Apple"],
        "industries": ["Technology"],
        "sizes": [{"min": 1, "max": 50}]
      }
    }
  }
}
```

**Lusha API Response Format:**
```javascript
{
  "requestId": "abc123",
  "currentPage": 0,
  "pageLength": 50,
  "totalResults": 150,
  "contacts": [
    {
      "id": "contact-123",
      "name": "John Doe",
      "jobTitle": "Sales Manager",
      "company": {
        "name": "Tech Corp",
        "logoUrl": "https://..."
      },
      "hasEmail": true,
      "hasPhone": true,
      "location": "San Francisco, CA"
    }
  ]
}
```

## API Endpoints

### Contact Filters
- `GET /api/lusha/filters/contacts/departments` - Get departments
- `GET /api/lusha/filters/contacts/seniority` - Get seniority levels
- `GET /api/lusha/filters/contacts/datapoints` - Get data points
- `GET /api/lusha/filters/contacts/countries` - Get countries
- `POST /api/lusha/filters/contacts/locations` - Search locations

### Company Filters
- `POST /api/lusha/filters/companies/names` - Search company names
- `GET /api/lusha/filters/companies/industries` - Get industries
- `GET /api/lusha/filters/companies/sizes` - Get company sizes
- `GET /api/lusha/filters/companies/revenues` - Get revenue ranges
- `POST /api/lusha/filters/companies/locations` - Search company locations
- `GET /api/lusha/filters/companies/sic-codes` - Get SIC codes
- `GET /api/lusha/filters/companies/naics-codes` - Get NAICS codes
- `GET /api/lusha/filters/companies/intent-topics` - Get intent topics
- `POST /api/lusha/filters/companies/technologies` - Search technologies

### Search
- `POST /api/lusha/search/contacts` - Search for contacts
- `POST /api/lusha/search/companies` - Search for companies

## Enrichment (Placeholder)

The enrichment feature is currently a placeholder. When implemented, it will:
1. Take selected prospects from search results
2. Call Lusha enrichment API to get full contact details
3. Reveal locked email addresses and phone numbers
4. Save enriched data to local database

To implement enrichment, you'll need to:
1. Create enrichment endpoint in `backend/routes/lusha.js`
2. Call Lusha's enrichment API (see Lusha documentation)
3. Update `handleEnrichProspects` in `ProspectFinderResults.js`
4. Store enriched data in your database

## Testing

1. Start the backend server
2. Open the application
3. Click on "Prospect Finder"
4. Click on filter fields - they should load options from Lusha
5. Select filters and click "Search"
6. Results should display contacts from Lusha database

## Troubleshooting

### No filter options loading:
- Check if LUSHA_API_KEY is set in `.env`
- Check backend console for API errors
- Verify Lusha API key is valid

### No search results:
- Check browser console for errors
- Verify backend is running
- Check if filters are being sent correctly
- Review backend logs for Lusha API errors

### API Rate Limiting:
- Lusha has rate limits on API calls
- Implement caching for filter options
- Add error handling for 429 (Too Many Requests) responses

## Next Steps

1. **Implement Enrichment**: Add actual enrichment API integration
2. **Add Caching**: Cache filter options to reduce API calls
3. **Error Handling**: Improve error messages for users
4. **Pagination**: Add pagination for search results
5. **Save to Database**: Allow users to save prospects to local database
6. **Export**: Implement export functionality for selected prospects
