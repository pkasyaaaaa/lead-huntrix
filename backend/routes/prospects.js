const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Sync user_data to prospects table
router.post('/sync-from-user-data', async (req, res) => {
  try {
    const userId = req.body.user_id || 1;
    
    // Get data from user_data table
    const [userData] = await db.query(
      'SELECT id, user_id, name, JobTitle FROM user_data WHERE user_id = ?',
      [userId]
    );

    let synced = 0;
    for (const record of userData) {
      // Check if already exists in prospects
      const [existing] = await db.query(
        'SELECT id FROM prospects WHERE user_data_id = ?',
        [record.id]
      );

      if (existing.length === 0) {
        // Insert into prospects
        await db.query(
          `INSERT INTO prospects (user_id, user_data_id, name, job_title) 
           VALUES (?, ?, ?, ?)`,
          [record.user_id, record.id, record.name, record.JobTitle]
        );
        synced++;
      }
    }

    res.json({ 
      success: true, 
      message: `Synced ${synced} records from user_data to prospects`,
      total_records: userData.length
    });
  } catch (error) {
    console.error('Error syncing data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all prospects for a user with filters
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id || 1; // Default to demo user
    const {
      job_titles,
      management_levels,
      departments,
      locations,
      industries,
      skills,
      company_sizes,
      revenue_ranges,
      search_query
    } = req.query;

    let query = 'SELECT id, user_id, name, JobTitle FROM user_data WHERE user_id = ?';
    const params = [userId];

    // Build dynamic WHERE clause based on filters
    if (job_titles) {
      const titles = job_titles.split(',');
      query += ` AND JobTitle IN (${titles.map(() => '?').join(',')})`;
      params.push(...titles);
    }

    if (management_levels) {
      const levels = management_levels.split(',');
      query += ` AND management_level IN (${levels.map(() => '?').join(',')})`;
      params.push(...levels);
    }

    if (departments) {
      const depts = departments.split(',');
      query += ` AND department IN (${depts.map(() => '?').join(',')})`;
      params.push(...depts);
    }

    if (locations) {
      const locs = locations.split(',');
      query += ` AND location IN (${locs.map(() => '?').join(',')})`;
      params.push(...locs);
    }

    if (industries) {
      const inds = industries.split(',');
      query += ` AND industry IN (${inds.map(() => '?').join(',')})`;
      params.push(...inds);
    }

    if (skills) {
      query += ` AND skills LIKE ?`;
      params.push(`%${skills}%`);
    }

    if (company_sizes) {
      const sizes = company_sizes.split(',');
      query += ` AND company_size IN (${sizes.map(() => '?').join(',')})`;
      params.push(...sizes);
    }

    if (revenue_ranges) {
      const ranges = revenue_ranges.split(',');
      query += ` AND company_revenue IN (${ranges.map(() => '?').join(',')})`;
      params.push(...ranges);
    }

    if (search_query) {
      query += ` AND (name LIKE ? OR JobTitle LIKE ?)`;
      const searchParam = `%${search_query}%`;
      params.push(searchParam, searchParam);
    }

    query += ' ORDER BY id DESC';

    const [prospects] = await db.query(query, params);
    res.json({ success: true, data: prospects });
  } catch (error) {
    console.error('Error fetching prospects:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single prospect by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [prospects] = await db.query('SELECT * FROM prospects WHERE id = ?', [id]);
    
    if (prospects.length === 0) {
      return res.status(404).json({ success: false, error: 'Prospect not found' });
    }
    
    res.json({ success: true, data: prospects[0] });
  } catch (error) {
    console.error('Error fetching prospect:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new prospect
router.post('/', async (req, res) => {
  try {
    const {
      user_id = 1,
      name,
      job_title,
      management_level,
      department,
      location,
      industry,
      skills,
      company_name,
      company_size,
      company_founded_year,
      company_revenue
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO prospects 
      (user_id, name, job_title, management_level, department, location, industry, skills, 
       company_name, company_size, company_founded_year, company_revenue) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, name, job_title, management_level, department, location, industry, skills,
       company_name, company_size, company_founded_year, company_revenue]
    );

    res.status(201).json({ 
      success: true, 
      data: { id: result.insertId, message: 'Prospect created successfully' }
    });
  } catch (error) {
    console.error('Error creating prospect:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update a prospect
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    
    await db.query(`UPDATE prospects SET ${fields} WHERE id = ?`, values);
    
    res.json({ success: true, message: 'Prospect updated successfully' });
  } catch (error) {
    console.error('Error updating prospect:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a prospect
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM prospects WHERE id = ?', [id]);
    res.json({ success: true, message: 'Prospect deleted successfully' });
  } catch (error) {
    console.error('Error deleting prospect:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get filter suggestions (for autocomplete)
router.get('/suggestions/filters', async (req, res) => {
  try {
    const userId = req.query.user_id || 1;
    
    const [jobTitles] = await db.query(
      'SELECT DISTINCT job_title FROM prospects WHERE user_id = ? AND job_title IS NOT NULL', 
      [userId]
    );
    const [locations] = await db.query(
      'SELECT DISTINCT location FROM prospects WHERE user_id = ? AND location IS NOT NULL', 
      [userId]
    );
    const [industries] = await db.query(
      'SELECT DISTINCT industry FROM prospects WHERE user_id = ? AND industry IS NOT NULL', 
      [userId]
    );
    
    res.json({
      success: true,
      data: {
        job_titles: jobTitles.map(row => row.job_title),
        locations: locations.map(row => row.location),
        industries: industries.map(row => row.industry)
      }
    });
  } catch (error) {
    console.error('Error fetching filter suggestions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
