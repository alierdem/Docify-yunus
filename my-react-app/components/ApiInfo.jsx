import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { analyzeInvoice } from '../services/api.js';

function ApiInfo() {
  const [invoiceData, setInvoiceData] = useState(null);

  const handleGetInfo = async () => {
    try {
      const data = await analyzeInvoice();
      setInvoiceData(data);
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      alert('An error occurred while fetching invoice data');
    }
  };

  return (
    <div>
      <h2>API Information</h2>
      <Button variant="primary" onClick={handleGetInfo}>
        Get Invoice Info
      </Button>
      {invoiceData && (
        <div className="mt-3">
          <h3>Invoice Details:</h3>
          <p>Vendor Name: {invoiceData.VendorName}</p>
          <p>Customer Name: {invoiceData.CustomerName}</p>
          <p>Invoice Date: {invoiceData.InvoiceDate}</p>
          <p>Due Date: {invoiceData.DueDate}</p>
          <p>Subtotal: {invoiceData.SubTotal}</p>
          <p>Total Tax: {invoiceData.TotalTax}</p>
          <p>Amount Due: {invoiceData.AmountDue}</p>
        </div>
      )}
    </div>
  );
}

export default ApiInfo;