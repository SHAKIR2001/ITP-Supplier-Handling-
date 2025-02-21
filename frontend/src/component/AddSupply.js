import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import './css/AddSupply.css'; // Import the CSS file

const AddSupply = () => {
  const [formData, setFormData] = useState({
    supplier: "",
    item: "",
    quantity: "",
    totalAmount: "",
    paidAmount: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/suppliers");
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setError("Failed to load suppliers");
      }
    };

    fetchSuppliers();
  }, []);

  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab", "Shift"];

  const handleKeyDown = (e, field) => {
    const { key, target: { value } } = e;

    // Handle allowed necessary keys globally
    if (allowedKeys.includes(key)) {
      return; // Allow navigation and control keys
    }

    // Quantity field: allow only integer values (0-9)
    if (field === "quantity") {
      if (!/^\d$/.test(key)) {
        e.preventDefault();
      }
    }

    // Total Amount and Paid Amount fields: allow integers and one decimal point
    if (field === "totalAmount" || field === "paidAmount") {
      if (!/^\d$/.test(key) && (key !== "." || value.includes("."))) {
        e.preventDefault();
      }
    }
  };

  const validateNumber = (value) => {
    const numberValue = parseFloat(value);
    return !isNaN(numberValue) && numberValue > 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "quantity" || id === "totalAmount" || id === "paidAmount") {
      if (!validateNumber(value) && value !== "") {
        return; 
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateNumber(formData.quantity)) {
      return setError("Quantity must be a positive number greater than 0.");
    }

    if (!validateNumber(formData.totalAmount)) {
      return setError("Total amount must be a positive number greater than 0.");
    }

    if (!validateNumber(formData.paidAmount)) {
      return setError("Paid amount must be a positive number greater than 0.");
    }

    try {
      const response = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Supply added successfully!");
        console.log(result);
        setFormData({
          supplier: "",
          item: "",
          quantity: "",
          totalAmount: "",
          paidAmount: "",
        });
        setError(null);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error adding supply:", error);
    }
  };

  return (
    <Container className="add-supply-container">
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="add-supply-form">
        <Form.Group controlId="supplier" className="mb-3">
          <Form.Label className="fw-bold">SELECT THE SUPPLIER</Form.Label>
          <Form.Select
            aria-label="Select the supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier.name}>
                {supplier.supplier}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="item" className="mb-3">
          <Form.Label className="fw-bold">ITEM</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter item"
            value={formData.item}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="quantity" className="mb-3">
          <Form.Label className="fw-bold">QUANTITY</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter quantity"
            value={formData.quantity}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, "quantity")}
            min="1"
            required
          />
        </Form.Group>

        <Form.Group controlId="totalAmount" className="mb-3">
          <Form.Label className="fw-bold">TOTAL AMOUNT</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter total amount"
            value={formData.totalAmount}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, "totalAmount")}
            min="1"
            required
          />
        </Form.Group>

        <Form.Group controlId="paidAmount" className="mb-3">
          <Form.Label className="fw-bold">PAID AMOUNT</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter paid amount"
            value={formData.paidAmount}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, "paidAmount")}
            min="1"
            required
          />
        </Form.Group>

        <Row className="mt-4">
          <Col>
            <Button
              variant="info"
              type="submit"
              className="w-100"
              style={{ backgroundColor: "#00d9d8", border: "none" }}
            >
              ADD
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              type="button"
              className="w-100"
              style={{ backgroundColor: "#ff4c4c", border: "none" }}
              onClick={() => setFormData({
                supplier: "",
                item: "",
                quantity: "",
                totalAmount: "",
                paidAmount: ""
              })}
            >
              CANCEL
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AddSupply;
