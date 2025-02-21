const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const paymentRoutes = require('./routes/paymentRoutes')
const Supply = require('./routes/supplyRoutes')
const newpayemnt = require('./routes/newpaymentroute')


// Import Supplier routes
const supplierRoutes = require('./routes/supplier');

const app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://admin:admin@cluster0.9sehw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files statically

// Endpoint to handle payment submission
app.post('/payments', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating payment', error });
  }
});


// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Create a unique filename
  },
});

const upload = multer({ storage });

// Use supplier routes
app.use('/api/suppliers', supplierRoutes);
app.use(Supply)
app.use(newpayemnt)

//use payment routes
app.use('/api/payments', paymentRoutes);
// Serve static files (for uploaded slips)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic API endpoint to test server
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
