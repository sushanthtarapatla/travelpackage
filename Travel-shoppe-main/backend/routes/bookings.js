const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { Parser } = require('json2csv');

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
    booking.cancellationNotified = true;
    booking.cancelledAt = new Date();

    await booking.save();

    // Auto-create admin notification (non-blocking)
    try {
      await Notification.create({
        type: 'cancellation',
        message: `Booking cancelled: ${booking.name} (${booking.destination}) — Travel date: ${new Date(booking.travelDate).toLocaleDateString()}`,
        refId: booking._id.toString()
      });
    } catch (notifErr) {
      console.error('Notification create failed:', notifErr.message);
    }

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

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, confirmed, cancelled'
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const oldStatus = booking.status;
    booking.status = status;

    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      booking.cancellationNotified = true;
      booking.cancelledAt = new Date();

      // Auto-create admin notification for cancellation
      try {
        await Notification.create({
          type: 'cancellation',
          message: `Booking cancelled: ${booking.name} (${booking.destination}) — Travel date: ${new Date(booking.travelDate).toLocaleDateString()}`,
          bookingId: booking._id
        });
      } catch (notifErr) {
        console.error('Notification create failed:', notifErr.message);
      }
    }

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

// @desc    Download all bookings as CSV
// @route   GET /api/bookings/download
router.get('/download', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    // Prepare data for CSV
    const csvData = bookings.map(booking => ({
      Name: booking.name,
      Email: booking.email,
      Phone: booking.phone,
      Destination: booking.destination,
      'Travel Date': booking.travelDate.toISOString().split('T')[0],
      'Number of People': booking.people,
      Status: booking.status,
      'Created At': booking.createdAt.toISOString()
    }));

    // Define CSV fields
    const fields = ['Name', 'Email', 'Phone', 'Destination', 'Travel Date', 'Number of People', 'Status', 'Created At'];
    const opts = { fields };

    // Create CSV
    const parser = new Parser(opts);
    const csv = parser.parse(csvData);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="bookings_${new Date().toISOString().split('T')[0]}.csv"`);

    res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;