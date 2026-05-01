const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// @desc    Get all destinations
// @route   GET /api/destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ order: 1 });
    res.json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get single destination
// @route   GET /api/destinations/:slug
router.get('/:slug', async (req, res) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug });
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }
    
    res.json({
      success: true,
      data: destination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create new destination
// @route   POST /api/destinations
router.post('/', async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({
      success: true,
      data: destination
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update destination by id
// @route   PUT /api/destinations/:id
router.put('/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.json({
      success: true,
      data: destination
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Delete destination by id
// @route   DELETE /api/destinations/:id
router.delete('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    await destination.deleteOne();

    res.json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
