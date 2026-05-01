const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// @desc    Get all notifications (newest first)
// @route   GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    const unreadCount = notifications.filter(n => !n.isRead).length;
    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a notification (called internally by other routes)
// @route   POST /api/notifications
router.post('/', async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ⚠️ /read-all MUST be before /:id/read — Express matches top to bottom
// @desc    Mark ALL notifications as read
// @route   PUT /api/notifications/read-all
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create upcoming trip notifications (called by cron job or manually)
// @route   POST /api/notifications/check-upcoming
router.post('/check-upcoming', async (req, res) => {
  try {
    const Booking = require('../models/Booking');

    // Find bookings for tomorrow that are not cancelled
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0, 0));
    const tomorrowEnd = new Date(tomorrow.setHours(23, 59, 59, 999));

    const upcomingBookings = await Booking.find({
      travelDate: { $gte: tomorrowStart, $lte: tomorrowEnd },
      status: { $ne: 'cancelled' }
    });

    let createdCount = 0;
    for (const booking of upcomingBookings) {
      // Check if notification already exists for this booking
      const existingNotification = await Notification.findOne({
        type: 'upcoming',
        bookingId: booking._id
      });

      if (!existingNotification) {
        await Notification.create({
          type: 'upcoming',
          message: `Upcoming trip tomorrow: ${booking.name} (${booking.destination}) — ${booking.people} people, Travel date: ${new Date(booking.travelDate).toLocaleDateString()}`,
          bookingId: booking._id
        });
        createdCount++;
      }
    }

    res.json({
      success: true,
      message: `Checked ${upcomingBookings.length} bookings, created ${createdCount} notifications`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

});
  module.exports = router;