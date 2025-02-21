import React, { useState, useEffect } from "react";
import { Button, Table, Container, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './css/Supplies.css'; // Ensure to import the CSS file

const SupplyList = () => {
  const [supplies, setSupplies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSupply, setCurrentSupply] = useState(null);

  // State for updating form fields
  const [updatedItem, setUpdatedItem] = useState("");
  const [updatedQuantity, setUpdatedQuantity] = useState("");
  const [updatedTotalAmount, setUpdatedTotalAmount] = useState("");
  const [updatedPaidAmount, setUpdatedPaidAmount] = useState("");

  const navigate = useNavigate();

  // Fetch supplies from the backend
  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await fetch("http://localhost:5000/all"); // Adjust the route if necessary
        const data = await response.json();
        setSupplies(data);
      } catch (error) {
        console.error("Error fetching supplies:", error);
      }
    };

    fetchSupplies();
  }, []);

  // Handle showing the update modal
  const handleUpdate = (supply) => {
    setCurrentSupply(supply); // Set the current supply to update
    setUpdatedItem(supply.item);
    setUpdatedQuantity(supply.quantity);
    setUpdatedTotalAmount(supply.totalAmount);
    setUpdatedPaidAmount(supply.paidAmount);
    setShowModal(true); // Show the modal
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "item") setUpdatedItem(value);
    else if (name === "quantity") setUpdatedQuantity(value);
    else if (name === "totalAmount") setUpdatedTotalAmount(value);
    else if (name === "paidAmount") setUpdatedPaidAmount(value);
  };

  // Handle form submission to update the supply
  const handleSubmitUpdate = async () => {
    if (!currentSupply) return;

    const updatedSupply = {
      item: updatedItem,
      quantity: updatedQuantity,
      totalAmount: updatedTotalAmount,
      paidAmount: updatedPaidAmount,
    };

    try {
      const response = await fetch(`http://localhost:5000/update/${currentSupply._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSupply),
      });

      if (response.ok) {
        // Update the supplies list after successful update
        setSupplies(
          supplies.map((supply) =>
            supply._id === currentSupply._id ? { ...supply, ...updatedSupply } : supply
          )
        );
        setShowModal(false); // Close the modal
        alert("Supply updated successfully!");
      } else {
        alert("Error updating supply");
      }
    } catch (error) {
      console.error("Error updating supply:", error);
    }
  };

  // Handle deleting a supply
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted supply from the state
        setSupplies(supplies.filter((supply) => supply._id !== id));
        alert("Supply deleted successfully!");
      } else {
        alert("Error deleting supply");
      }
    } catch (error) {
      console.error("Error deleting supply:", error);
    }
  };

  // Calculate the balance needed to complete the payment
  const calculateBalance = (totalAmount, paidAmount) => {
    return totalAmount - paidAmount;
  };

  const handlePayBalance = (supply) => {
    const balance = calculateBalance(supply.totalAmount, supply.paidAmount);
    if (balance > 0) {
      navigate(`/paybalance?supplierName=${supply.supplier}&balance=${balance}`);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 fw-bold">Supply List</h2>
      {supplies.length > 0 ? (
        <Table striped bordered hover className="supply-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((supply) => {
              const balance = calculateBalance(supply.totalAmount, supply.paidAmount);
              return (
                <tr key={supply._id}>
                  <td>{supply.supplier}</td>
                  <td>{supply.item}</td>
                  <td>{supply.quantity}</td>
                  <td>{supply.totalAmount}</td>
                  <td>{supply.paidAmount}</td>
                  <td>{balance > 0 ? balance : "Fully Paid"}</td>
                  <td>
                    {balance > 0 && (
                      <Button
                        variant="success"
                        onClick={() => handlePayBalance(supply)}
                      >
                        Pay Balance
                      </Button>
                    )}
                    <Button
                      variant="warning"
                      onClick={() => handleUpdate(supply)}
                      className="me-2"
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(supply._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <p>No supplies found</p>
      )}

      {/* Modal for updating supply */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Supply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="item" className="mb-3">
              <Form.Label>Item</Form.Label>
              <Form.Control
                type="text"
                name="item"
                value={updatedItem}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="quantity" className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={updatedQuantity}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="totalAmount" className="mb-3">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="number"
                name="totalAmount"
                value={updatedTotalAmount}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="paidAmount" className="mb-3">
              <Form.Label>Paid Amount</Form.Label>
              <Form.Control
                type="number"
                name="paidAmount"
                value={updatedPaidAmount}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitUpdate}>
            Update Supply
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SupplyList;
