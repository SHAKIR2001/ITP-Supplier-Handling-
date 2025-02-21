const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  supplier: {
    type: String,
    required: true,
  },
  bank: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  paymentAmount: {
    type: Number,
    required: true,
  },
  slip: {
    type: String,
    
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
