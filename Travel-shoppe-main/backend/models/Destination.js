const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  priceValue: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  itinerary: {
    type: [String],
    default: []
  },
  itineraryImages: {
    type: [String],
    default: []
  },
  recommendation: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Destination', destinationSchema);
