const express = require('express');
const router = express.Router();
const lushaService = require('../services/lushaService');
const db = require('../config/database');

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

// ============================================
// ENRICHMENT ENDPOINT
// ============================================

// Enrich selected contacts and save to database
router.post('/enrich/contacts', async (req, res) => {
  const { requestId, contactIds, userId, revealEmails = false, revealPhones = false } = req.body;
  
  if (!requestId) {
    return res.status(400).json({ error: 'requestId parameter is required' });
  }
  
  if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
    return res.status(400).json({ error: 'contactIds array is required and cannot be empty' });
  }
  
  if (!userId) {
    return res.status(400).json({ error: 'userId parameter is required' });
  }
  
  try {
    // Call Lusha enrichment API
    const result = await lushaService.enrichContacts(requestId, contactIds, revealEmails, revealPhones);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    const enrichedData = result.data;
    let savedCount = 0;
    let companyCount = 0;
    const errors = [];
    
    // Process each enriched contact
    for (const contact of enrichedData.contacts || []) {
      if (!contact.isSuccess || !contact.data) {
        errors.push({ contactId: contact.id, error: contact.error || 'No data returned' });
        continue;
      }
      
      const data = contact.data;
      
      try {
        // Save to prospect_data table
        const prospectResult = await db.query(
          `INSERT INTO prospect_data 
           (user_id, lusha_id, name, job_title, company_name, location, linkedin_url, email, phone_number, company_details)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             job_title = EXCLUDED.job_title,
             company_name = EXCLUDED.company_name,
             location = EXCLUDED.location,
             linkedin_url = EXCLUDED.linkedin_url,
             email = EXCLUDED.email,
             phone_number = EXCLUDED.phone_number,
             company_details = EXCLUDED.company_details
           RETURNING id`,
          [
            userId,
            data.personId || null,
            data.fullName || data.firstName + ' ' + data.lastName || null,
            data.jobTitle || null,
            data.companyName || null,
            data.location?.country || data.contactLocation || null,
            data.socialLinks?.linkedin || null,
            data.emailAddresses?.map(e => e.email) || null,
            data.phoneNumbers?.map(p => p.number) || null,
            data.company ? JSON.stringify(data.company) : null
          ]
        );
        
        savedCount++;
        
        // Save company info if available
        if (data.company && data.companyId) {
          await db.query(
            `INSERT INTO company_info 
             (company_id, main_industry, sub_industry, employee_count_min, employee_count_max, domain, description, logo_url, linkedin_url, crunchbase_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (company_id) DO UPDATE SET
               main_industry = EXCLUDED.main_industry,
               sub_industry = EXCLUDED.sub_industry,
               employee_count_min = EXCLUDED.employee_count_min,
               employee_count_max = EXCLUDED.employee_count_max,
               domain = EXCLUDED.domain,
               description = EXCLUDED.description,
               logo_url = EXCLUDED.logo_url,
               linkedin_url = EXCLUDED.linkedin_url,
               crunchbase_url = EXCLUDED.crunchbase_url`,
            [
              data.companyId,
              data.company.mainIndustry || null,
              data.company.subIndustry || null,
              parseEmployeeRange(data.company.employees)?.min || null,
              parseEmployeeRange(data.company.employees)?.max || null,
              data.company.fqdn || null,
              data.company.description || null,
              data.company.logoUrl || null,
              data.company.linkedin || null,
              data.company.crunchbase || null
            ]
          );
          companyCount++;
        }
        
      } catch (dbError) {
        console.error('Database error for contact', contact.id, ':', dbError);
        errors.push({ contactId: contact.id, error: dbError.message });
      }
    }
    
    res.json({
      success: true,
      message: `Enriched and saved ${savedCount} contacts and ${companyCount} companies`,
      creditsCharged: enrichedData.creditsCharged || 0,
      savedContacts: savedCount,
      savedCompanies: companyCount,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error in enrichment process:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to parse employee range strings like "1001 - 5000"
function parseEmployeeRange(employeeString) {
  if (!employeeString) return null;
  
  const match = employeeString.match(/(\d+)\s*-\s*(\d+)/);
  if (match) {
    return {
      min: parseInt(match[1]),
      max: parseInt(match[2])
    };
  }
  
  // Handle formats like "10000+"
  const plusMatch = employeeString.match(/(\d+)\+/);
  if (plusMatch) {
    return {
      min: parseInt(plusMatch[1]),
      max: null
    };
  }
  
  return null;
}

module.exports = router;
