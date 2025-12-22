const axios = require('axios');

// Lusha API configuration
const LUSHA_API_BASE_URL = 'https://api.lusha.com';
const LUSHA_API_KEY = process.env.LUSHA_API_KEY || 'your-lusha-api-key-here';

// Create axios instance with default config
const lushaAPI = axios.create({
  baseURL: LUSHA_API_BASE_URL,
  headers: {
    'api_key': LUSHA_API_KEY,
    'Content-Type': 'application/json'
  }
});

// ============================================
// CONTACT FILTER ENDPOINTS 
// ============================================

// Get list of available data points for contact filtering

async function getContactDataPoints() {
  try {
    const response = await lushaAPI.get('/prospecting/filters/contacts/existing_data_points');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching contact data points:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// Get list of all available countries for contact filtering

async function getContactCountries() {
  try {
    const response = await lushaAPI.get('/prospecting/filters/contacts/all_countries');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching contact countries:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// Search for locations by text for contact filtering

async function searchContactLocations(searchText) {
  try {
    const response = await lushaAPI.post('/prospecting/filters/contacts/locations', {
      text: searchText
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error searching contact locations:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ============================================
// COMPANY FILTER ENDPOINTS (Currently Unused - Using Predefined Data or Disabled)
// ============================================

// Industries - Disabled in frontend
// Revenues - Disabled in frontend

// Search for company names by text
async function searchCompanyNames(searchText) {
  try {
    const response = await lushaAPI.post('/prospecting/filters/companies/names', {
      text: searchText
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error searching company names:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

//Search for company locations by text

async function searchCompanyLocations(searchText) {
  try {
    const response = await lushaAPI.post('/prospecting/filters/companies/locations', {
      text: searchText
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error searching company locations:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// The following endpoints are available but currently unused:
// - getCompanyIndustries (industries filter disabled)
// - getCompanyRevenues (revenues filter disabled)
// - getCompanySICCodes, getCompanyNAICSCodes, getCompanyIntentTopics, searchCompanyTechnologies (not implemented in UI)

// ============================================
// SEARCH ENDPOINTS
// ============================================

// Search for contacts using various filters

async function searchContacts(filters, page = 0, size = 25) {
  try {
    const requestBody = {
      pages: {
        page: page,
        size: size
      },
      filters: filters
    };

    const response = await lushaAPI.post('/prospecting/contact/search', requestBody);
    
    // Log headers for credit information
    console.log('\n' + '🔍 LUSHA API RESPONSE HEADERS '.padEnd(80, '='));
    console.log('Headers:', JSON.stringify(response.headers, null, 2));
    console.log('Available Credits:', response.headers['x-credits-available'] || 'Not provided');
    console.log('Credits Used:', response.headers['x-credits-used'] || 'Not provided');
    console.log('Rate Limit Remaining:', response.headers['x-ratelimit-remaining'] || 'Not provided');
    console.log('='.repeat(80) + '\n');
    
    return { success: true, data: response.data, headers: response.headers };
  } catch (error) {
    console.error('Error searching contacts:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Search for companies using various filters
 */
async function searchCompanies(filters, page = 0, size = 25) {
  try {
    const requestBody = {
      pages: {
        page: page,
        size: size
      },
      filters: filters
    };

    const response = await lushaAPI.post('/prospecting/company/search', requestBody);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error searching companies:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ============================================
// ENRICHMENT ENDPOINT
// ============================================

/**
 * Enrich contacts with full details
 * @param {string} requestId - The requestId from the search response
 * @param {Array<string>} contactIds - Array of contactIds to enrich
 * @param {boolean} revealEmails - Whether to reveal emails (costs credits)
 * @param {boolean} revealPhones - Whether to reveal phones (costs credits)
 */
async function enrichContacts(requestId, contactIds, revealEmails = false, revealPhones = false) {
  try {
    const requestBody = {
      requestId: requestId,
      contactIds: contactIds,
      revealEmails: revealEmails,
      revealPhones: revealPhones
    };

    console.log('\n' + '📊 LUSHA ENRICH REQUEST '.padEnd(80, '='));
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    
    const response = await lushaAPI.post('/prospecting/contact/enrich', requestBody);
    
    console.log('\n' + '✅ LUSHA ENRICH RESPONSE '.padEnd(80, '='));
    console.log('Status:', response.status);
    console.log('Credits Charged:', response.data.creditsCharged || 0);
    console.log('Contacts Enriched:', response.data.contacts?.length || 0);
    console.log('='.repeat(80) + '\n');
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error enriching contacts:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

module.exports = {
  // Contact filters (still potentially useful)
  getContactDataPoints,
  getContactCountries,
  searchContactLocations,
  
  // Company filters (still potentially useful)
  searchCompanyNames,
  searchCompanyLocations,
  
  // Search (actively used)
  searchContacts,
  searchCompanies,
  
  // Enrichment
  enrichContacts
};
