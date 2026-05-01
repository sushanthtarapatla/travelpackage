const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');

// @desc    Get all contacts (admin)
// @route   GET /api/contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create new contact/enquiry
// @route   POST /api/contacts
router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    // Auto-create admin notification (non-blocking — don't fail contact save if this errors)
    try {
      await Notification.create({
        type: 'contact',
        message: `New enquiry from ${contact.name} (${contact.email})${contact.destination ? ' — Interested in: ' + contact.destination : ''}`,
        refId: contact._id.toString()
      });
    } catch (notifErr) {
      console.error('Notification create failed:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your enquiry. We will contact you soon!',
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update contact status
// @route   PUT /api/contacts/:id
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;