const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const Supplier = require('../models/supplier');

const router = express.Router();

// Ensure 'uploads/' directory exists
const UPLOAD_DIR = path.join(__dirname, '../uploads');
const ensureUploadDirExists = async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    console.error("Error creating uploads directory:", err.message);
  }
};
ensureUploadDirExists();

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file name
  },
});

const upload = multer({ storage: storage });

// Helper function to delete files
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error('Error deleting file:', err.message);
  }
};

// @route   POST /api/suppliers/add
// @desc    Add a new supplier
// @access  Public
router.post('/add', upload.single('agreement'), async (req, res) => {
  const { supplier, nic, tel, email, address } = req.body;
  const agreement = req.file ? req.file.path : '';

  // Validate required fields
  if (!supplier || !nic || !tel || !email || !address) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newSupplier = new Supplier({
      supplier,
      nic,
      tel,
      email,
      address,
      agreement,
    });

    await newSupplier.save();
    res.status(201).json({ message: 'Supplier added successfully!' });
  } catch (error) {
    console.error('Error adding supplier:', error.message);
    res.status(500).json({ error: 'Failed to add supplier' });
  }
});

// @route   GET /api/suppliers
// @desc    Get all suppliers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error.message);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// @route   PUT /api/suppliers/:id
// @desc    Update a supplier by ID
// @access  Public
router.put('/:id', upload.single('agreement'), async (req, res) => {
  const { id } = req.params;
  const { supplier, nic, tel, email, address } = req.body;

  try {
    const supplierToUpdate = await Supplier.findById(id);
    if (!supplierToUpdate) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // If a new file is uploaded, delete the old file
    if (req.file) {
      if (supplierToUpdate.agreement) {
        await deleteFile(supplierToUpdate.agreement);
      }
      supplierToUpdate.agreement = req.file.path; // Set new file path
    }

    // Update supplier details
    supplierToUpdate.supplier = supplier || supplierToUpdate.supplier;
    supplierToUpdate.nic = nic || supplierToUpdate.nic;
    supplierToUpdate.tel = tel || supplierToUpdate.tel;
    supplierToUpdate.email = email || supplierToUpdate.email;
    supplierToUpdate.address = address || supplierToUpdate.address;

    await supplierToUpdate.save();
    res.status(200).json({ message: 'Supplier updated successfully!' });
  } catch (error) {
    console.error('Error updating supplier:', error.message);
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

// @route   DELETE /api/suppliers/:id
// @desc    Delete a supplier by ID
// @access  Public
// Delete a supplier by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the supplier by ID
    const supplierToDelete = await Supplier.findById(id);
    if (!supplierToDelete) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // Delete the supplier from the database
    const result = await Supplier.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.status(200).json({ message: 'Supplier deleted successfully!' });
  } catch (error) {
    console.error('Error deleting supplier:', error.message);
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

// Fetch all suppliers
router.get('/all', async (req, res) => {
  try {
    const suppliers = await Supplier.find(); // Fetch all suppliers from the database
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch suppliers', error });
  }
});


// Update supplier's paid amount
router.patch('/suppliers/:id', async (req, res) => {
  try {
    const { paidAmount } = req.body;
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    supplier.paidAmount += paidAmount; // Update the paid amount
    await supplier.save();

    res.status(200).json(supplier);
  } catch (error) {
    console.error("Error updating supplier's paid amount:", error);
    res.status(500).json({ message: 'Failed to update supplier. Please try again.' });
  }
});

module.exports = router;
