import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Modal, Form, FormControl } from "react-bootstrap";
import './css/Suppliers.css'; // Import external CSS file


const Suppliers = ({ onEdit, onDelete }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]); // For storing the filtered results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term

  // Validation state
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredSuppliers(
        suppliers.filter((supplier) =>
          supplier.supplier.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredSuppliers(suppliers);
    }
  }, [searchTerm, suppliers]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/suppliers");
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Data fetched is not an array");
      }
      setSuppliers(data);
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (supplier) => {
    setCurrentSupplier(supplier);
    setShowEditModal(true);
  };

  const handleDeleteClick = (id) => {
    setSupplierToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteSupplier = async () => {
    if (!supplierToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/suppliers/${supplierToDelete}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete supplier");
      }
      setSuppliers(suppliers.filter((supplier) => supplier._id !== supplierToDelete));
      setSuccessMessage("Supplier deleted successfully!");
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Validate NIC and Mobile Number
  const validateInputs = () => {
    const nicRegex = /^[0-9]{9}[Vv]$|^[0-9]{12}$/;
    const mobileRegex = /^07[0-9]{8}$/;

    if (!nicRegex.test(currentSupplier.nic)) {
      return "Invalid NIC format. Must be either 9 digits followed by 'V' or 12 digits.";
    }
    if (!mobileRegex.test(currentSupplier.tel)) {
      return "Invalid mobile number format. Must start with 07 and be 10 digits long.";
    }
    return null;
  };

  const handleSaveChanges = async () => {
    if (!currentSupplier) return;

    const validationMessage = validateInputs();
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/suppliers/${currentSupplier._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentSupplier),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update supplier");
      }

      const updatedSupplier = await response.json();
      setSuppliers(
        suppliers.map((supplier) =>
          supplier._id === updatedSupplier._id ? updatedSupplier : supplier
        )
      );

      setShowEditModal(false);
      setCurrentSupplier(null);
      setValidationError(""); // Clear validation error
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSupplier({ ...currentSupplier, [name]: value });
  };

  return (
    <div>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : successMessage ? (
        <Alert variant="success">{successMessage}</Alert>
      ) : (
        <>
          <FormControl
            type="text"
            placeholder="Search supplier by name..."
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Table striped bordered hover className="mt-5">
            <thead>
              <tr>
                {/* <th className="d-none d-md-table-cell">ID</th> */}
                <th>Supplier</th>
                <th>NIC</th>
                <th>Tel</th>
                <th>Email</th>
                <th>Address</th>
                <th>Agreement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    {/* <td className="d-none d-md-table-cell">{supplier._id}</td> */}
                    <td>{supplier.supplier}</td>
                    <td>{supplier.nic}</td>
                    <td>{supplier.tel}</td>
                    <td>{supplier.email}</td>
                    <td>{supplier.address}</td>
                    <td>
                      {supplier.agreement ? (
                        <a
                          href={`http://localhost:5000/${supplier.agreement}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Slip
                        </a>
                      ) : (
                        'No Slip Available'
                      )}
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEditClick(supplier)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(supplier._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No Suppliers Available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {validationError && <Alert variant="danger">{validationError}</Alert>}
          {currentSupplier && (
            <Form>
              <Form.Group controlId="supplier">
                <Form.Label>Supplier Name</Form.Label>
                <Form.Control
                  type="text"
                  name="supplier"
                  value={currentSupplier.supplier}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="nic">
                <Form.Label>NIC</Form.Label>
                <Form.Control
                  type="text"
                  name="nic"
                  value={currentSupplier.nic}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="tel">
                <Form.Label>Tel</Form.Label>
                <Form.Control
                  type="text"
                  name="tel"
                  value={currentSupplier.tel}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={currentSupplier.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={currentSupplier.address}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this supplier?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteSupplier}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Suppliers;
