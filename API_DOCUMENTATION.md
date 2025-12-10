# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

Currently, the API uses a simple `user_id` parameter. In production, implement proper JWT authentication.

---

## Health Check

### Check Server Status
```
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Prospects API

### Get All Prospects (with Filters)

```
GET /prospects
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `user_id` | integer | User ID (required, default: 1) |
| `job_titles` | string | Comma-separated job titles |
| `management_levels` | string | Comma-separated levels |
| `departments` | string | Comma-separated departments |
| `locations` | string | Comma-separated locations |
| `industries` | string | Comma-separated industries |
| `skills` | string | Keyword search in skills |
| `company_sizes` | string | Comma-separated size ranges |
| `revenue_ranges` | string | Comma-separated revenue ranges |
| `search_query` | string | General keyword search |

**Example Request:**
```
GET /api/prospects?user_id=1&job_titles=designer,developer&locations=Kuala%20Lumpur
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "John Doe",
      "job_title": "Senior Designer",
      "management_level": "Manager",
      "department": "Design",
      "location": "Kuala Lumpur",
      "industry": "Technology",
      "skills": "UI/UX, Figma, Adobe XD",
      "company_name": "Tech Solutions Inc",
      "company_size": "51-200",
      "company_founded_year": 2015,
      "company_revenue": "$10M - $100M",
      "created_at": "2023-12-09T10:30:00.000Z",
      "updated_at": "2023-12-09T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Prospect

```
GET /prospects/:id
```

**Parameters:**
- `id` (path) - Prospect ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "name": "John Doe",
    ...
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Prospect not found"
}
```

---

### Create New Prospect

```
POST /prospects
```

**Request Body:**
```json
{
  "user_id": 1,
  "name": "Jane Smith",
  "job_title": "Marketing Manager",
  "management_level": "Manager",
  "department": "Marketing",
  "location": "Singapore",
  "industry": "Technology",
  "skills": "Digital Marketing, SEO, Analytics",
  "company_name": "Marketing Pro Ltd",
  "company_size": "51-200",
  "company_founded_year": 2018,
  "company_revenue": "$10M - $100M"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "message": "Prospect created successfully"
  }
}
```

---

### Update Prospect

```
PUT /prospects/:id
```

**Request Body (partial update allowed):**
```json
{
  "job_title": "Senior Marketing Manager",
  "management_level": "Director"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prospect updated successfully"
}
```

---

### Delete Prospect

```
DELETE /prospects/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Prospect deleted successfully"
}
```

---

### Get Filter Suggestions

```
GET /prospects/suggestions/filters
```

**Query Parameters:**
- `user_id` (optional, default: 1)

**Response:**
```json
{
  "success": true,
  "data": {
    "job_titles": ["Designer", "Fashion Designer", "Interior Designer"],
    "locations": ["Kuala Lumpur", "Singapore"],
    "industries": ["Technology", "Retail", "Design"]
  }
}
```

---

## Market Analysis API

### Create Market Analysis

```
POST /market-analysis
```

**Request Body:**
```json
{
  "user_id": 1,
  "query": "Analyze the electric scooter market in Southeast Asia"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "processing",
    "message": "Market analysis started"
  }
}
```

---

### Get Analysis Result

```
GET /market-analysis/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "query": "Analyze the electric scooter market in Southeast Asia",
    "status": "completed",
    "analysis_result": {
      "market_size": "$2.5B",
      "growth_rate": "15% YoY",
      "key_players": ["Company A", "Company B", "Company C"],
      "trends": ["Trend 1", "Trend 2", "Trend 3"],
      "opportunities": ["Opportunity 1", "Opportunity 2"],
      "timestamp": "2023-12-09T10:35:00.000Z"
    },
    "created_at": "2023-12-09T10:30:00.000Z",
    "updated_at": "2023-12-09T10:35:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Analysis not found"
}
```

---

### Get All Analyses for User

```
GET /market-analysis?user_id=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "query": "Analyze the electric scooter market...",
      "status": "completed",
      "created_at": "2023-12-09T10:30:00.000Z"
    }
  ]
}
```

---

### Get Suggestion Prompts

```
GET /market-analysis/suggestions/prompts
```

**Response:**
```json
{
  "success": true,
  "data": [
    "Analyze the electric scooter market in Southeast Asia.",
    "Give a market overview of premium home fragrance products.",
    "Market insights for mushroom farming."
  ]
}
```

---

## Users API

### Get User Details

```
GET /users/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "demo_user",
    "email": "demo@leadhuntrix.com",
    "created_at": "2023-12-09T08:00:00.000Z"
  }
}
```

---

### Get User's Saved Filters

```
GET /users/:userId/filters
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "filter_name": "Tech Designers in KL",
      "job_titles": ["Designer", "UI/UX Designer"],
      "management_levels": ["Manager", "Director"],
      "departments": ["Design"],
      "locations": ["Kuala Lumpur"],
      "industries": ["Technology"],
      "skills": ["Figma", "Adobe XD"],
      "company_sizes": ["51-200"],
      "founded_year_range": null,
      "revenue_ranges": ["$10M - $100M"],
      "is_active": true,
      "created_at": "2023-12-09T09:00:00.000Z",
      "updated_at": "2023-12-09T09:00:00.000Z"
    }
  ]
}
```

---

### Save User Filter

```
POST /users/:userId/filters
```

**Request Body:**
```json
{
  "filter_name": "Tech Designers in KL",
  "job_titles": ["Designer", "UI/UX Designer"],
  "management_levels": ["Manager", "Director"],
  "departments": ["Design"],
  "locations": ["Kuala Lumpur"],
  "industries": ["Technology"],
  "skills": ["Figma", "Adobe XD"],
  "company_sizes": ["51-200"],
  "founded_year_range": null,
  "revenue_ranges": ["$10M - $100M"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "message": "Filter saved successfully"
  }
}
```

---

### Get User's Prospect Lists

```
GET /users/:userId/lists
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "list_name": "Q4 2023 Prospects",
      "description": "High-priority prospects for Q4 outreach",
      "prospect_count": 15,
      "created_at": "2023-12-09T09:00:00.000Z",
      "updated_at": "2023-12-09T09:00:00.000Z"
    }
  ]
}
```

---

### Create Prospect List

```
POST /users/:userId/lists
```

**Request Body:**
```json
{
  "list_name": "Q4 2023 Prospects",
  "description": "High-priority prospects for Q4 outreach"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "message": "List created successfully"
  }
}
```

---

## Error Responses

All endpoints may return these standard error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Query is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Prospect not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Database connection failed"
}
```

---

## Rate Limiting

Currently not implemented. Consider adding in production:
- 100 requests per 15 minutes per IP
- Use `express-rate-limit` package

---

## CORS

CORS is enabled for all origins in development. In production, configure specific origins:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

---

## Testing Examples

### Using cURL (PowerShell)

**Get prospects:**
```powershell
curl http://localhost:5000/api/prospects?user_id=1
```

**Create prospect:**
```powershell
curl -X POST http://localhost:5000/api/prospects `
  -H "Content-Type: application/json" `
  -d '{\"user_id\":1,\"name\":\"Test User\",\"job_title\":\"Developer\"}'
```

**Start market analysis:**
```powershell
curl -X POST http://localhost:5000/api/market-analysis `
  -H "Content-Type: application/json" `
  -d '{\"user_id\":1,\"query\":\"Market analysis for solar panels\"}'
```

### Using JavaScript (Axios)

**Get prospects:**
```javascript
const response = await axios.get('/api/prospects', {
  params: { 
    user_id: 1,
    job_titles: 'designer,developer',
    locations: 'Kuala Lumpur'
  }
});
```

**Create prospect:**
```javascript
const response = await axios.post('/api/prospects', {
  user_id: 1,
  name: 'John Doe',
  job_title: 'Senior Developer',
  location: 'Singapore'
});
```

**Get with error handling:**
```javascript
try {
  const response = await axios.get('/api/prospects/123');
  console.log(response.data);
} catch (error) {
  if (error.response) {
    console.error('Error:', error.response.data.error);
  }
}
```

---

## Future Enhancements

- [ ] JWT authentication
- [ ] Pagination for list endpoints
- [ ] Advanced search with boolean operators
- [ ] Bulk operations (create/update/delete multiple)
- [ ] Export to CSV/Excel
- [ ] Email notifications
- [ ] WebSocket for real-time updates
- [ ] GraphQL endpoint
- [ ] API versioning (v1, v2)
- [ ] Request validation middleware
- [ ] Rate limiting
- [ ] API key authentication for external integrations
