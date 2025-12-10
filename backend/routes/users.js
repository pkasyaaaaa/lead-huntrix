const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query('SELECT user_id, username, email, created_at FROM users WHERE user_id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's saved filters
router.get('/:userId/filters', async (req, res) => {
  try {
    const { userId } = req.params;
    const [filters] = await db.query(
      'SELECT * FROM user_filters WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC',
      [userId]
    );
    
    // Parse JSON fields
    const parsedFilters = filters.map(filter => ({
      ...filter,
      job_titles: filter.job_titles ? JSON.parse(filter.job_titles) : [],
      management_levels: filter.management_levels ? JSON.parse(filter.management_levels) : [],
      departments: filter.departments ? JSON.parse(filter.departments) : [],
      locations: filter.locations ? JSON.parse(filter.locations) : [],
      industries: filter.industries ? JSON.parse(filter.industries) : [],
      skills: filter.skills ? JSON.parse(filter.skills) : [],
      company_sizes: filter.company_sizes ? JSON.parse(filter.company_sizes) : [],
      revenue_ranges: filter.revenue_ranges ? JSON.parse(filter.revenue_ranges) : []
    }));
    
    res.json({ success: true, data: parsedFilters });
  } catch (error) {
    console.error('Error fetching user filters:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save user filter
router.post('/:userId/filters', async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      filter_name,
      job_titles,
      management_levels,
      departments,
      locations,
      industries,
      skills,
      company_sizes,
      founded_year_range,
      revenue_ranges
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO user_filters 
      (user_id, filter_name, job_titles, management_levels, departments, locations, 
       industries, skills, company_sizes, founded_year_range, revenue_ranges) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, 
        filter_name,
        JSON.stringify(job_titles || []),
        JSON.stringify(management_levels || []),
        JSON.stringify(departments || []),
        JSON.stringify(locations || []),
        JSON.stringify(industries || []),
        JSON.stringify(skills || []),
        JSON.stringify(company_sizes || []),
        founded_year_range || null,
        JSON.stringify(revenue_ranges || [])
      ]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, message: 'Filter saved successfully' }
    });
  } catch (error) {
    console.error('Error saving filter:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's prospect lists
router.get('/:userId/lists', async (req, res) => {
  try {
    const { userId } = req.params;
    const [lists] = await db.query(
      `SELECT pl.*, COUNT(pli.prospect_id) as prospect_count 
       FROM prospect_lists pl 
       LEFT JOIN prospect_list_items pli ON pl.id = pli.list_id 
       WHERE pl.user_id = ? 
       GROUP BY pl.id 
       ORDER BY pl.created_at DESC`,
      [userId]
    );
    
    res.json({ success: true, data: lists });
  } catch (error) {
    console.error('Error fetching prospect lists:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create prospect list
router.post('/:userId/lists', async (req, res) => {
  try {
    const { userId } = req.params;
    const { list_name, description } = req.body;

    const [result] = await db.query(
      'INSERT INTO prospect_lists (user_id, list_name, description) VALUES (?, ?, ?)',
      [userId, list_name, description || null]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, message: 'List created successfully' }
    });
  } catch (error) {
    console.error('Error creating prospect list:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
