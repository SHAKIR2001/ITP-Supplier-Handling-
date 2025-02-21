import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const supplierName = searchParams.get("supplierName");
  const initialBalance = parseFloat(searchParams.get("balance")) || 0;

  const [paymentDetails, setPaymentDetails] = useState({
    supplierName: supplierName,
    amountPaid: initialBalance,
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    amountPaid: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Only allow numeric input and ensure value is less than or equal to the initialBalance
    if (name === "amountPaid") {
      // Allow empty input for initial entry, then validate
      if (value === "") {
        setPaymentDetails({ ...paymentDetails, [name]: value });
        setErrors((prev) => ({ ...prev, amountPaid: "" }));
        return;
      }
  
      // Block any non-numeric input
      if (!/^\d*\.?\d*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          amountPaid: "Amount must be a positive number",
        }));
        return; // Block any non-numeric input
      }
  
      const numericValue = parseFloat(value);
      if (numericValue > initialBalance) {
        setErrors((prev) => ({
          ...prev,
          amountPaid: `Amount must be less than or equal to ${initialBalance}`,
        }));
      } else if (numericValue <= 0) {
        setErrors((prev) => ({
          ...prev,
          amountPaid: "Amount must be a positive number",
        }));
      } else {
        setErrors((prev) => ({ ...prev, amountPaid: "" }));
      }
    }

    // Only allow numeric input with max length of 12 for Card Number
    if (name === "cardNumber") {
      if (!/^\d*$/.test(value)) {
        return; // Block non-numeric input
      }
      if (value.length > 12) {
        return; // Block input if length exceeds 12 digits
      }
    }

    // Only allow numeric input and ensure value length is exactly 3 for CVV
    if (name === "cvv") {
      if (!/^\d*$/.test(value)) {
        return; // Block non-numeric input
      }
      if (value.length > 3) {
        return; // Block input if length exceeds 3 digits
      }
    }

    // Allow MM/YY format only for Expiration Date
    if (name === "expirationDate") {
      const formattedValue = value.replace(/^(\d{2})(\d)/, "$1/$2"); // Auto-format to MM/YY
      if (!/^\d{0,2}\/?\d{0,2}$/.test(formattedValue)) {
        return; // Block non-numeric and non-MM/YY format
      }

      // Additional check for "00/00"
      if (formattedValue.length === 5) {
        const [month, year] = formattedValue.split("/");
        if (month === "00" || year === "00") {
          setErrors((prev) => ({
            ...prev,
            expirationDate: "Expiration date cannot be '00/00'",
          }));
          return;
        } else {
          setErrors((prev) => ({ ...prev, expirationDate: "" }));
        }
      }

      setPaymentDetails({ ...paymentDetails, [name]: formattedValue });
      return;
    }

    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handleSubmitPayment = async () => {
    // Basic validation before submitting
    if (errors.cardNumber || errors.cvv || errors.expirationDate || errors.amountPaid) {
      alert("Please fix the errors before submitting.");
      return;
    }

    if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length !== 12) {
      setErrors((prev) => ({ ...prev, cardNumber: "Card number must be exactly 12 digits" }));
      return;
    }

    if (!paymentDetails.cvv || paymentDetails.cvv.length !== 3) {
      setErrors((prev) => ({ ...prev, cvv: "CVV must be exactly 3 digits" }));
      return;
    }

    if (errors.cardNumber || errors.cvv || errors.expirationDate || errors.amountPaid) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/add-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDetails),
      });

      if (response.ok) {
        const updateResponse = await fetch(`http://localhost:5000/updatePaidAmount/${supplierName}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amountPaid: paymentDetails.amountPaid }),
        });

        if (updateResponse.ok) {
          alert("Payment successful and supply updated!");
          navigate("/supplies");
        } else {
          alert("Error updating supply's paid amount.");
        }
      } else {
        alert("Error processing payment.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Payment Page</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Supplier Name</Form.Label>
          <Form.Control type="text" value={supplierName} readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Amount to Pay</Form.Label>
          <Form.Control
            type="text"
            name="amountPaid"
            value={paymentDetails.amountPaid}
            onChange={handleInputChange}
            isInvalid={!!errors.amountPaid}
          />
          <Form.Control.Feedback type="invalid">
            {errors.amountPaid}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Card Number</Form.Label>
          <Form.Control
            type="text"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
            isInvalid={!!errors.cardNumber}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cardNumber}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Expiration Date (MM/YY)</Form.Label>
          <Form.Control
            type="text"
            name="expirationDate"
            value={paymentDetails.expirationDate}
            onChange={handleInputChange}
            isInvalid={!!errors.expirationDate}
          />
          <Form.Control.Feedback type="invalid">
            {errors.expirationDate}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>CVV</Form.Label>
          <Form.Control
            type="text"
            name="cvv"
            value={paymentDetails.cvv}
            onChange={handleInputChange}
            isInvalid={!!errors.cvv}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cvv}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" onClick={handleSubmitPayment}>
          Submit Payment
        </Button>
      </Form>
    </Container>
  );
};

export default PaymentPage;
