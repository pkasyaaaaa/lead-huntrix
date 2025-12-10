const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Create new market analysis request
router.post('/', async (req, res) => {
  try {
    const { user_id = 1, query } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }

    const [result] = await db.query(
      'INSERT INTO market_analysis (user_id, query, status) VALUES (?, ?, ?)',
      [user_id, query, 'processing']
    );

    // In a real application, you would trigger background processing here
    // For now, we'll simulate it with a placeholder response
    
    // Simulate processing delay (in production, this would be async)
    setTimeout(async () => {
      const mockAnalysisResult = {
        market_size: '$2.5B',
        growth_rate: '15% YoY',
        key_players: ['Company A', 'Company B', 'Company C'],
        trends: ['Trend 1', 'Trend 2', 'Trend 3'],
        opportunities: ['Opportunity 1', 'Opportunity 2'],
        timestamp: new Date().toISOString()
      };

      await db.query(
        'UPDATE market_analysis SET status = ?, analysis_result = ? WHERE id = ?',
        ['completed', JSON.stringify(mockAnalysisResult), result.insertId]
      );
    }, 3000);

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        status: 'processing',
        message: 'Market analysis started'
      }
    });
  } catch (error) {
    console.error('Error creating market analysis:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get market analysis by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [analyses] = await db.query(
      'SELECT * FROM market_analysis WHERE id = ?',
      [id]
    );

    if (analyses.length === 0) {
      return res.status(404).json({ success: false, error: 'Analysis not found' });
    }

    const analysis = analyses[0];
    if (analysis.analysis_result) {
      analysis.analysis_result = JSON.parse(analysis.analysis_result);
    }

    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error fetching market analysis:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all market analyses for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id || 1;
    const [analyses] = await db.query(
      'SELECT id, query, status, created_at FROM market_analysis WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ success: true, data: analyses });
  } catch (error) {
    console.error('Error fetching market analyses:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get analysis suggestions
router.get('/suggestions/prompts', async (req, res) => {
  try {
    const suggestions = [
      'Analyze the electric scooter market in Southeast Asia.',
      'Give a market overview of premium home fragrance products.',
      'Market insights for mushroom farming.',
      'Analyze the organic food delivery market in Malaysia.',
      'Market trends for sustainable packaging solutions.'
    ];

    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
