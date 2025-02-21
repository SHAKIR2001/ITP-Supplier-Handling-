const mongoose = require('mongoose');

// Define the Supplier schema
const SupplierSchema = new mongoose.Schema(
  {
    supplier: {
      type: String,
      required: true,
    },
    nic: {
      type: String,
      required: true,
      unique: true,
    },
    tel: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    agreement: {
      type: String,  // Store the path to the uploaded document
      default: '',
      required: true,   // Default to an empty string
    },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

const Supplier = mongoose.model('Supplier', SupplierSchema);
module.exports = Supplier;
