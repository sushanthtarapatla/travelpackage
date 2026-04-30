const express = require('express');
const router = express.Router();
const JourneyCategory = require('../models/JourneyCategory');

// @desc    Get all journey categories
// @route   GET /api/journey-categories
router.get('/', async (req, res) => {
  try {
    const categories = await JourneyCategory.find().sort({ order: 1 });
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create new journey category
// @route   POST /api/journey-categories
router.post('/', async (req, res) => {
  try {
    const category = await JourneyCategory.create(req.body);
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
