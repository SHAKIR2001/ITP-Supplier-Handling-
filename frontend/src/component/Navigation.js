import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import profileImage from './images/profile.png'; // Corrected the path to the image

const Navigation = () => {
  return (
    <Navbar expand="lg" className="bg-dark border-bottom">
      <Container>
        <Navbar.Brand href="/" className="fw-bold text-white">
          NELCO
        </Navbar.Brand>
        <Nav className="mx-auto">
          <LinkContainer to="/">
            <Nav.Link className="mx-3 text-white">Suppliers</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/supplies">
            <Nav.Link className="mx-3 text-white">supplies</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/add-supplier">
            <Nav.Link className="mx-3 text-white">Add a new Supplier</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/supply">
            <Nav.Link className="mx-3 text-white">Add a supply</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/payment">
            <Nav.Link className="mx-3 text-white">Add a payment</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/payments">
            <Nav.Link className="mx-3 text-white">payments</Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav>
          <Nav.Link href="#profile" className="text-white">
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;
