const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  supplierName: {
    type: String,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("newpayemnt", paymentSchema);
