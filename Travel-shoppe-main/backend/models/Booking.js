const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
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
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    travelDate: {
      type: Date,
      required: true
    },
    people: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ['booked', 'cancelled'],
      default: 'booked'
    },
    cancellationNotified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
