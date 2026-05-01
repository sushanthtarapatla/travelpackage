const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// @desc    Get all packages
// @route   GET /api/packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().sort({ order: 1 });
    res.json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get featured packages
// @route   GET /api/packages/featured
router.get('/featured', async (req, res) => {
  try {
    const packages = await Package.find({ featured: true }).sort({ order: 1 });
    res.json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get single package
// @route   GET /api/packages/:slug
router.get('/:slug', async (req, res) => {
  try {
    const packageItem = await Package.findOne({ slug: req.params.slug });
    
    if (!packageItem) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.json({
      success: true,
      data: packageItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create new package
// @route   POST /api/packages
router.post('/', async (req, res) => {
  try {
    const packageItem = await Package.create(req.body);
    res.status(201).json({
      success: true,
      data: packageItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update package by id
// @route   PUT /api/packages/:id
router.put('/:id', async (req, res) => {
  try {
    const packageItem = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!packageItem) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      data: packageItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Delete package by id
// @route   DELETE /api/packages/:id
router.delete('/:id', async (req, res) => {
  try {
    const packageItem = await Package.findById(req.params.id);

    if (!packageItem) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    await packageItem.deleteOne();

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
