import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Suppliers from './component/Suppliers';
import AddSupplier from './component/AddSupplier';
import Navigation from './component/Navigation';
import AddPayment from './component/AddPayment'; 
import AddSupply from './component/AddSupply';
import PaymentList from './component/paymentDetails';
import Supplies from './component/Supplies';
import PayBalance from "./component/newpay";


function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Suppliers />} />
          <Route path="/add-supplier" element={<AddSupplier />} />
          <Route path="/add-payment" element={<AddPayment />} />
          <Route path="/supply" element={<AddSupply />} />
          <Route path="/payment" element={<AddPayment />} />
          <Route path="/payments" element={<PaymentList />} />
          <Route path="/supplies" element={<Supplies />} />
          <Route path="/paybalance" element={<PayBalance />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
