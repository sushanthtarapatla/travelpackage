const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// @desc    Create a booking
// @route   POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get all bookings
// @route   GET /api/bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get bookings by phone number
// @route   GET /api/bookings/phone/:phone
router.get('/phone/:phone', async (req, res) => {
  try {
    const bookings = await Booking.find({ phone: req.params.phone }).sort({
      travelDate: 1
    });
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Cancel booking by id (status update only)
// @route   PUT /api/bookings/:id/cancel
router.put('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking already cancelled'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationNotified = false;
    booking.cancelledAt = new Date();

    await booking.save();

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
