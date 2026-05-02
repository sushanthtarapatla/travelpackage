const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
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
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  recommendation: {
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
  duration: {
    type: String,
    default: ''
  },
  guests: {
    type: String,
    default: ''
  },
  inclusions: {
    type: [String],
    default: []
  },
  price: {
    type: String,
    required: true
  },
  priceValue: {
    type: Number,
    required: true
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

module.exports = mongoose.model('Package', packageSchema);
