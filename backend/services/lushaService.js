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

/**
 * Get list of available departments for contact filtering
 */
async function getContactDepartments() {
  try {
    const response = await lushaAPI.get('/prospecting/filters/contacts/departments');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching contact departments:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Get list of available seniority levels for contact filtering
 */
async function getContactSeniority() {
  try {
    const response = await lushaAPI.get('/prospecting/filters/contacts/seniority');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching contact seniority:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Get list of available data points for contact filtering
 */
async function getContactDataPoints() {
  try {
    const response = await lushaAPI.get('/prospecting/filters/contacts/existing_data_points');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching contact data points:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Get list of all available countries for contact filtering
 */
async function getContactCountries() {
  try {
    const response = await lushaAPI.get('/prospecting/filters/contacts/all_countries');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching contact countries:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Search for locations by text for contact filtering
 */
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
// COMPANY FILTER ENDPOINTS
// ============================================

/**
 * Search for company names by text
 */
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

/**
 * Get list of available industries for company filtering
 */
async function getCompanyIndustries() {
  try {
    const response = await lushaAPI.get('/prospecting/filters/companies/industries_labels');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching company industries:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Get list of available company size ranges
 */
async function getCompanySizes() {
  try {
    const response = await lushaAPI.get('/prospecting/filters/companies/sizes');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching company sizes:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Get list of available revenue ranges
 */
async function getCompanyRevenues() {
  try {
    const response = await lushaAPI.get('/prospecting/filters/companies/revenues');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching company revenues:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Search for company locations by text
 */
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

/**
 * Get list of available SIC codes
 */
async function getCompanySICCodes() {
  try {
    const response = await lushaAPI.get('/prospecting/filters/companies/sics');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching company SIC codes:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Get list of available NAICS codes
 */
async function getCompanyNAICSCodes() {
  try {
    const response = await lushaAPI.get('/prospecting/filters/companies/naics');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching company NAICS codes:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Get list of available intent topics
 */
async function getCompanyIntentTopics() {
  try {
    const response = await lushaAPI.get('/prospecting/filters/companies/intent_topics');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching company intent topics:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Search for technologies by text
 */
async function searchCompanyTechnologies(searchText) {
  try {
    const response = await lushaAPI.post('/prospecting/filters/companies/technologies', {
      text: searchText
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error searching company technologies:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ============================================
// SEARCH ENDPOINTS
// ============================================

/**
 * Search for contacts using various filters
 */
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
    return { success: true, data: response.data };
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

module.exports = {
  // Contact filters
  getContactDepartments,
  getContactSeniority,
  getContactDataPoints,
  getContactCountries,
  searchContactLocations,
  
  // Company filters
  searchCompanyNames,
  getCompanyIndustries,
  getCompanySizes,
  getCompanyRevenues,
  searchCompanyLocations,
  getCompanySICCodes,
  getCompanyNAICSCodes,
  getCompanyIntentTopics,
  searchCompanyTechnologies,
  
  // Search
  searchContacts,
  searchCompanies
};
