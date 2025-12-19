const express = require('express');
const router = express.Router();
const lushaService = require('../services/lushaService');

// ============================================
// CONTACT FILTER ENDPOINTS
// ============================================
// Note: Departments and Seniority use predefined data in frontend to save API quota
// Only keeping actively used endpoints

// Get list of available data points for contact filtering (reserved for future use)
router.get('/filters/contacts/datapoints', async (req, res) => {
  const result = await lushaService.getContactDataPoints();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get list of all available countries for contact filtering (reserved for future use)
router.get('/filters/contacts/countries', async (req, res) => {
  const result = await lushaService.getContactCountries();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Search for locations by text for contact filtering (actively used)
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
// Note: Industries, Sizes, and Revenues use predefined data or are disabled in frontend
// Only keeping actively used endpoints

// Search for company names by text (actively used)
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

// Search for company locations by text (reserved for future use)
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
