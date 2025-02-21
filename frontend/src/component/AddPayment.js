import React, { useState, useEffect } from "react"; 
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import "./css/AddPayment.css"; 

const AddPayment = () => {
  const [formData, setFormData] = useState({
    supplier: "",
    bank: "",
    accountNumber: "",
    paymentAmount: "",
    slip: null,
  });
  const [suppliers, setSuppliers] = useState([]); 
  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(null); 
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/suppliers");
        setSuppliers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setError("Failed to fetch suppliers. Please try again.");
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    // Validation for Account Number (exactly 12 digits)
    if (name === "accountNumber") {
      const onlyDigits = /^\d{0,12}$/; // Matches only digits and limits to 12
      if (onlyDigits.test(value)) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    }
    
    // Validation for Payment Amount (positive integer or float)
    else if (name === "paymentAmount") {
      const isValidAmount = /^[+]?\d*\.?\d*$/.test(value); // Allow positive integers and decimals
      if (isValidAmount || value === "") {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    }    
     else {
      setFormData((prevData) => ({ ...prevData, [name]: type === "file" ? files[0] : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.accountNumber.length !== 12) {
      return setError("Account number must be exactly 12 digits.");
    }

    // Validate Payment Amount: Ensure it's a positive number
    const paymentAmountValue = parseFloat(formData.paymentAmount);
    if (isNaN(paymentAmountValue) || paymentAmountValue <= 0) {
      return setError("Payment amount must be a positive number.");
    }

    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/payments/create", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Submitted Data:", response.data);
      setFormData({
        supplier: "",
        bank: "",
        accountNumber: "",
        paymentAmount: "",
        slip: null,
      });
      setSuccess("Payment added successfully!");
      setError(null);
    } catch (error) {
      console.error("Error submitting payment:", error);
      setError("Failed to add payment. Please try again.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="add-payment-container">
      <h2>Add Payment</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {loading && <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>}
      <Form onSubmit={handleSubmit} className="payment-form">
        <Form.Group controlId="supplier">
          <Form.Label>Select the Supplier</Form.Label>
          <Form.Select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
          >
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier.supplier}>
                {supplier.supplier}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="bank">
          <Form.Label>Select the Bank</Form.Label>
          <Form.Select
            name="bank"
            value={formData.bank}
            onChange={handleChange}
            required
          >
            <option value="">Select a bank</option>
            <option value="Bank Of Ceylon">Bank Of Ceylon</option>
            <option value="HNB">HNB</option>
            <option value="Sampath Bank">Sampath Bank</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="accountNumber">
          <Form.Label>Enter Account Number</Form.Label>
          <Form.Control
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Enter account number (12 digits)"
            required
            maxLength={12}
          />
        </Form.Group>

        <Form.Group controlId="paymentAmount">
          <Form.Label>Enter Payment Amount</Form.Label>
          <Form.Control
            type="text"
            name="paymentAmount"
            value={formData.paymentAmount}
            onChange={handleChange}
            placeholder="Enter payment amount"
            required
            min={0}
          />
        </Form.Group>

        <Form.Group controlId="slip">
          <Form.Label>Upload the Slip/Payment Proof</Form.Label>
          <Form.Control
            type="file"
            name="slip"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Row className="mt-3"> {/* Reduced margin-top */}
          <Col>
            <Button
              variant="info"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              Add Payment
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              type="button"
              className="w-100"
              onClick={() =>
                setFormData({
                  supplier: "",
                  bank: "",
                  accountNumber: "",
                  paymentAmount: "",
                  slip: null,
                })
              }
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AddPayment;
