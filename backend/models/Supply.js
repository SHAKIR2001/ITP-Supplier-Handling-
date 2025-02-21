const mongoose = require("mongoose");

const supplySchema = new mongoose.Schema({
  supplier: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Supply", supplySchema);
