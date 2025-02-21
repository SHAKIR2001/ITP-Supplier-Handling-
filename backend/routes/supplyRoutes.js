const express = require("express");
const router = express.Router();
const Supply = require("../models/Supply"); // Adjust the path based on your folder structure

// Route to add a new supply
router.post("/add", async (req, res) => {
  const { supplier, item, quantity, totalAmount, paidAmount } = req.body;

  try {
    const newSupply = new Supply({
      supplier,
      item,
      quantity,
      totalAmount,
      paidAmount,
    });

    await newSupply.save();
    res.status(201).json({ message: "Supply added successfully!", supply: newSupply });
  } catch (error) {
    res.status(500).json({ message: "Failed to add supply", error });
  }
});

// Route to get all supplies
router.get("/all", async (req, res) => {
  try {
    const supplies = await Supply.find();
    res.status(200).json(supplies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch supplies", error });
  }
});

// Route to delete a supply
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const supply = await Supply.findByIdAndDelete(id);

    if (!supply) {
      return res.status(404).json({ message: "Supply not found" });
    }

    res.status(200).json({ message: "Supply deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete supply", error });
  }
});

// Route to update a supply
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { supplier, item, quantity, totalAmount, paidAmount } = req.body;

  try {
    const supply = await Supply.findById(id);

    if (!supply) {
      return res.status(404).json({ message: "Supply not found" });
    }

    supply.supplier = supplier || supply.supplier;
    supply.item = item || supply.item;
    supply.quantity = quantity || supply.quantity;
    supply.totalAmount = totalAmount || supply.totalAmount;
    supply.paidAmount = paidAmount || supply.paidAmount;

    await supply.save();

    res.status(200).json({ message: "Supply updated successfully!", supply });
  } catch (error) {
    res.status(500).json({ message: "Failed to update supply", error });
  }
});

// Route to fetch supply by supplier
router.get("/supplies/:supplier", async (req, res) => {
  try {
    const supplierName = req.params.supplier;
    const supplies = await Supply.find({ supplier: supplierName });

    if (supplies.length === 0) {
      return res.status(404).json({ message: "No supplies found for this supplier." });
    }

    res.json(supplies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
