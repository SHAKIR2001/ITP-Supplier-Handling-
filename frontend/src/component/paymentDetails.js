import React, { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './css/paymentDetails.css'; // Make sure to link the external CSS
import { format } from 'date-fns';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payments/all');
        setPayments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Failed to fetch payment details');
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleDownloadPDF = () => {

    const companyName = "NELCO";
    const companyAddress = "Malwatta, Godakawela, Ratnapura, Sri Lanka, 70160"; 
    const companyEmail = "info@nelco.lk";
    const fax = "0452 240 242  ";
    const currentDate = format(new Date(), 'yyyy-MM-dd');

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(companyName, 14, 10);

    doc.setFontSize(10);
    doc.text(companyAddress, 14, 19);  // Address at position (14, 16)
    doc.text(`Email: ${companyEmail}`, 14, 24);  // Email at position (14, 22)
    doc.text(`Fax: ${fax}`, 14, 29)

    doc.setFontSize(10);
    doc.text(`Date: ${currentDate}`, 196, 19, { align: 'right' });

    doc.setDrawColor(40, 127, 186);
    doc.setLineWidth(0.5);
    doc.line(14, 33, 196, 33);

    doc.setFontSize(12);
    doc.text('Payment Summary Report', 14, 39);
    doc.autoTable({
      startY: 44,
      head: [['Supplier', 'Bank', 'Payment Amount', 'Created At']],
      body: payments.map(payment => [
        payment.supplier,
        payment.bank,
        `$${payment.paymentAmount}`,
        new Date(payment.createdAt).toLocaleString()
      ]),
    });
    doc.save('payment-report.pdf');
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 payment-list-container">
      <h2 className="mb-4 fw-bold">Payment Details</h2>
      <Button
        variant="primary"
        onClick={handleDownloadPDF}
        className="mb-4 download-btn"
      >
        Download PDF Report
      </Button>
      {payments.length > 0 ? (
        <Table striped bordered hover responsive className="payment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Supplier</th>
              <th>Bank</th>
              <th>Payment Amount</th>
              <th>Payment Slip</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id}>
                <td>{index + 1}</td>
                <td>{payment.supplier}</td>
                <td>{payment.bank}</td>
                <td>${payment.paymentAmount}</td>
                <td>
                  {payment.slip ? (
                    <a href={`http://localhost:5000/${payment.slip}`} target="_blank" rel="noopener noreferrer">
                      View Slip
                    </a>
                  ) : (
                    'No Slip Available'
                  )}
                </td>
                <td>{new Date(payment.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No payment records found.</Alert>
      )}
    </Container>
  );
};

export default PaymentList;
