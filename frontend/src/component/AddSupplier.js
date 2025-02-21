import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "./css/AddSupplier.css"; // Ensure you create this CSS file

const AddSupplier = () => {
  const [formData, setFormData] = useState({
    supplier: "",
    nic: "",
    tel: "",
    email: "",
    address: "",
    agreement: null,
  });

  const [errors, setErrors] = useState({});

  const allowedKeys = [
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "CapsLock",
    "Shift",
    "Delete",
    "ArrowUp",
    "ArrowDown",
  ];

  const handleKeyDown = (e, allowedPattern) => {
    const { key } = e;

    if (
      !allowedPattern.test(key) && // Check if the key matches the allowed pattern
      !allowedKeys.includes(key) && // Allow necessary keys like Backspace, Arrow keys, etc.
      !(key.length > 1) // Ignore keys like Control, Shift, etc.
    ) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let newValue = type === "file" ? files[0] : value;

    if (name === "tel") {
      newValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    validateField(name, newValue);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "supplier":
      const supplierRegex = /^[A-Za-z\s.]+$/; // Only letters, spaces, and full stops
      if (!supplierRegex.test(value)) {
        error = "Supplier name can only contain letters, spaces, and full stops.";
      } else if (!value) {
        error = "Supplier name is required.";
      }
      break;

      case "nic":
        const nicRegex = /^\d{9}[vV]$|^\d{12}$/;
        if (!nicRegex.test(value)) {
          error = "NIC must be either 9 digits followed by 'v' or 'V', or 12 digits.";
        }
        break;
      case "tel":
        const telRegex = /^\d{10}$/;
        if (value.length > 10) {
          error = "Telephone number must be exactly 10 digits.";
        } else if (!telRegex.test(value)) {
          error = "Telephone number must be exactly 10 digits.";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = "Email must be a valid email address.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    for (const field in formData) {
      validateField(field, formData[field]);
    }

    // Check if there are any errors
  const hasErrors = Object.values(errors).some((error) => error);
  if (hasErrors) {
    alert("Please fix the errors before submitting the form.");
    return; // Prevent form submission
  }

    const submissionData = new FormData();
    submissionData.append("supplier", formData.supplier);
    submissionData.append("nic", formData.nic);
    submissionData.append("tel", formData.tel);
    submissionData.append("email", formData.email);
    submissionData.append("address", formData.address);
    if (formData.agreement) {
      submissionData.append("agreement", formData.agreement);
    }

    try {
      const response = await fetch("http://localhost:5000/api/suppliers/add", {
        method: "POST",
        body: submissionData,
      });

      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const result = await response.json();
        alert(result.message);
        setFormData({
          supplier: "",
          nic: "",
          tel: "",
          email: "",
          address: "",
          agreement: null,
        });
        setErrors({});
      } else {
        alert("Error: " + (await response.text()));
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to add supplier. Please try again.");
    }
  };

  return (
    <Container className="add-supplier-container">
      <h2 className="mb-4 fw-bold">Add a New Supplier</h2>
      <Form onSubmit={handleSubmit}>
        {Object.values(errors).map((error, index) => error && <Alert key={index} variant="danger">{error}</Alert>)}

        <Form.Group controlId="supplier" className="mb-3">
          <Form.Label className="fw-bold">Supplier</Form.Label>
          <Form.Control
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, /^[A-Za-z\s.]$/)}
            placeholder="Enter supplier name"
            required
          />
        </Form.Group>

        <Form.Group controlId="nic" className="mb-3">
          <Form.Label className="fw-bold">NIC</Form.Label>
          <Form.Control
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, /^[0-9vV]$/)}
            placeholder="Enter NIC"
            required
          />
          {errors.nic && <Form.Text className="text-danger">{errors.nic}</Form.Text>}
        </Form.Group>

        <Form.Group controlId="tel" className="mb-3">
          <Form.Label className="fw-bold">Tel</Form.Label>
          <Form.Control
            type="tel"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, /^[0-9]$/)}
            placeholder="Enter telephone number"
            required
          />
          {errors.tel && <Form.Text className="text-danger">{errors.tel}</Form.Text>}
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label className="fw-bold">E-mail</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
          {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
        </Form.Group>

        <Form.Group controlId="address" className="mb-3">
          <Form.Label className="fw-bold">Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            required
          />
        </Form.Group>

        <Form.Group controlId="agreement" className="mb-3">
          <Form.Label className="fw-bold">Upload Agreement</Form.Label>
          <Form.Control
            type="file"
            name="agreement"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Row className="mt-4">
          <Col>
            <Button
              variant="info"
              type="submit"
              className="w-100"
              style={{ backgroundColor: "#00d9d8", border: "none", fontWeight: "bold" }}
            >
              Add Supplier
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              type="button"
              className="w-100"
              style={{ backgroundColor: "#ff4c4c", border: "none", fontWeight: "bold" }}
              onClick={() =>
                setFormData({
                  supplier: "",
                  nic: "",
                  tel: "",
                  email: "",
                  address: "",
                  agreement: null,
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

export default AddSupplier;
