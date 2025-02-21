const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const upload = require('../middleware/multer'); // Import the Multer configuration

// Route to create a new payment
router.post('/create', upload.single('slip'), async (req, res) => {
  try {
    const { supplier, bank, accountNumber, paymentAmount } = req.body;
    const slip = req.file?.path; // Handle optional file

    const newPayment = new Payment({
      supplier,
      bank,
      accountNumber,
      paymentAmount,
      slip,
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Failed to create payment' });
  }
});

// Route to fetch all payments
router.get('/all', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
});

module.exports = router;
