const express = require('express');
const router = express.Router();
const lushaService = require('../services/lushaService');

// ============================================
// CONTACT FILTER ENDPOINTS
// ============================================

// Get list of available departments for contact filtering
router.get('/filters/contacts/departments', async (req, res) => {
  const result = await lushaService.getContactDepartments();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get list of available seniority levels for contact filtering
router.get('/filters/contacts/seniority', async (req, res) => {
  const result = await lushaService.getContactSeniority();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get list of available data points for contact filtering
router.get('/filters/contacts/datapoints', async (req, res) => {
  const result = await lushaService.getContactDataPoints();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get list of all available countries for contact filtering
router.get('/filters/contacts/countries', async (req, res) => {
  const result = await lushaService.getContactCountries();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Search for locations by text for contact filtering
router.post('/filters/contacts/locations', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text parameter is required' });
  }
  
  const result = await lushaService.searchContactLocations(text);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// ============================================
// COMPANY FILTER ENDPOINTS
// ============================================

// Search for company names by text
router.post('/filters/companies/names', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text parameter is required' });
  }
  
  const result = await lushaService.searchCompanyNames(text);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get list of available industries for company filtering
router.get('/filters/companies/industries', async (req, res) => {
  const result = await lushaService.getCompanyIndustries();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get list of available company size ranges
router.get('/filters/companies/sizes', async (req, res) => {
  const result = await lushaService.getCompanySizes();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get list of available revenue ranges
router.get('/filters/companies/revenues', async (req, res) => {
  const result = await lushaService.getCompanyRevenues();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Search for company locations by text
router.post('/filters/companies/locations', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text parameter is required' });
  }
  
  const result = await lushaService.searchCompanyLocations(text);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get list of available SIC codes
router.get('/filters/companies/sic-codes', async (req, res) => {
  const result = await lushaService.getCompanySICCodes();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get list of available NAICS codes
router.get('/filters/companies/naics-codes', async (req, res) => {
  const result = await lushaService.getCompanyNAICSCodes();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get list of available intent topics
router.get('/filters/companies/intent-topics', async (req, res) => {
  const result = await lushaService.getCompanyIntentTopics();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Search for technologies by text
router.post('/filters/companies/technologies', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text parameter is required' });
  }
  
  const result = await lushaService.searchCompanyTechnologies(text);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// ============================================
// SEARCH ENDPOINTS
// ============================================

// Search for contacts using various filters
router.post('/search/contacts', async (req, res) => {
  const { filters, page = 0, size = 25 } = req.body;
  
  if (!filters) {
    return res.status(400).json({ error: 'Filters parameter is required' });
  }
  
  const result = await lushaService.searchContacts(filters, page, size);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Search for companies using various filters
router.post('/search/companies', async (req, res) => {
  const { filters, page = 0, size = 25 } = req.body;
  
  if (!filters) {
    return res.status(400).json({ error: 'Filters parameter is required' });
  }
  
  const result = await lushaService.searchCompanies(filters, page, size);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

module.exports = router;
