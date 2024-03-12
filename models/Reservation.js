const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Car',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    protectionPackage: {
      type: String,
      required: true,
    },
    selectedOptions: [
      {
        type: String,
      },
    ],
    selectedPaymentOption: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    houseNumber: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    driverLicenseNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    promoCode: {
      type: String,
    },
    reservationStatus: {
      type: String,
      default: false
  },
  totalRentalPrice: {
    type: Number,
  },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);
