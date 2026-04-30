const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    default: ''
  },
  destination: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'converted', 'closed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
