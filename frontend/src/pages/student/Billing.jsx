// src/pages/student/Billing.jsx
import React, { useState } from 'react';
import './Billing.css';
import { FaDownload, FaCreditCard, FaHistory, FaCheckCircle, FaTimes, FaCoins, FaExclamationTriangle, FaPrint } from 'react-icons/fa';

const initialFees = [
  {
    id: "INV-2026-001",
    title: "Semester 6 Tuition Fee",
    dueDate: "15 Mar 2026",
    amount: 85000,
    paid: 0,
    status: "Pending",
    semester: "Sem 6"
  },
  {
    id: "INV-2025-089",
    title: "Hostel Fee (Annual)",
    dueDate: "10 Jan 2026",
    amount: 45000,
    paid: 45000,
    status: "Paid",
    semester: "Sem 5"
  },
  {
    id: "INV-2025-055",
    title: "Library Fine",
    dueDate: "20 Dec 2025",
    amount: 500,
    paid: 500,
    status: "Paid",
    semester: "Sem 5"
  },
  {
    id: "INV-2026-002",
    title: "Exam Fee (Regular)",
    dueDate: "01 Apr 2026",
    amount: 2500,
    paid: 0,
    status: "Pending",
    semester: "Sem 6"
  }
];

const Billing = () => {
  const [fees, setFees] = useState(initialFees);
  const [activeTab, setActiveTab] = useState('All');

  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [activeCheckoutFee, setActiveCheckoutFee] = useState(null);
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // Invoice Details Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);

  // --- CALCULATE ANALYTICS ---
  const totalAmount = fees.reduce((acc, item) => acc + item.amount, 0);
  const paidAmount = fees.reduce((acc, item) => acc + item.paid, 0);
  const dueAmount = totalAmount - paidAmount;
  const defaultersCount = fees.filter(fee => fee.status === 'Pending' && new Date(fee.dueDate) < new Date()).length;

  // --- FILTER LOGIC ---
  const filteredFees = fees.filter(fee => {
    if (activeTab === 'All') return true;
    return fee.status === activeTab;
  });

  const formatCurrency = (amount) => {
    return "₹" + amount.toLocaleString('en-IN');
  };

  // --- TRIGGER PAY MODAL ---
  const openCheckout = (fee) => {
    setActiveCheckoutFee(fee);
    setShowCheckoutModal(true);
    setCardHolder("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
  };

  // --- SUBMIT PAYMENT ---
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
      alert("Please fill in all card credentials.");
      return;
    }

    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setShowCheckoutModal(false);
      
      // Update fee payment status dynamically in state
      setFees(prev => prev.map(item => {
        if (item.id === activeCheckoutFee.id) {
          return {
            ...item,
            status: "Paid",
            paid: item.amount
          };
        }
        return item;
      }));

      alert(`Payment of ${formatCurrency(activeCheckoutFee.amount)} processed successfully!`);
    }, 1500); // Mock processing delay
  };

  // --- VIEW INVOICE MODAL ---
  const openInvoice = (fee) => {
    setActiveInvoice(fee);
    setShowInvoiceModal(true);
  };

  return (
    <div className="fees-container">
      
      {/* HEADER */}
      <div className="fees-header-panel">
        <div>
          <h2>Billing & Fee Collections 💳</h2>
          <p>Inspect collections metrics, generate receipts, and settle dues online</p>
        </div>
      </div>

      {/* FINANCIAL SUMMARY CARDS (Fee Analytics Panel) */}
      <div className="fees-summary-analytics">
        
        {/* Card 1: Total Invoiced */}
        <div className="dashboard-card fee-analytic-card">
          <div className="card-top">
            <span className="analytic-label">Total Invoiced</span>
            <div className="analytic-icon stat-blue"><FaHistory /></div>
          </div>
          <div className="analytic-value text-blue">{formatCurrency(totalAmount)}</div>
          <span className="analytic-sub">Across 4 charges</span>
        </div>

        {/* Card 2: Paid Collection */}
        <div className="dashboard-card fee-analytic-card">
          <div className="card-top">
            <span className="analytic-label">Total Collection</span>
            <div className="analytic-icon stat-green"><FaCoins /></div>
          </div>
          <div className="analytic-value text-green">{formatCurrency(paidAmount)}</div>
          <span className="analytic-sub">Collection rate: {Math.round((paidAmount / totalAmount) * 100)}%</span>
        </div>

        {/* Card 3: Outstanding Due */}
        <div className="dashboard-card fee-analytic-card">
          <div className="card-top">
            <span className="analytic-label">Outstanding Due</span>
            <div className="analytic-icon stat-red"><FaCreditCard /></div>
          </div>
          <div className="analytic-value text-red">{formatCurrency(dueAmount)}</div>
          <span className="analytic-sub">Next date: 15 Mar 2026</span>
        </div>

        {/* Card 4: Defaulters */}
        <div className="dashboard-card fee-analytic-card">
          <div className="card-top">
            <span className="analytic-label">Defaulters</span>
            <div className="analytic-icon stat-purple"><FaExclamationTriangle /></div>
          </div>
          <div className="analytic-value text-purple">{defaultersCount} Accounts</div>
          <span className="analytic-sub">Dues exceeded deadline</span>
        </div>
      </div>

      {/* FILTER & ACTIONS BAR */}
      <div className="fees-controls-bar">
        <div className="fee-tabs-group">
          {['All', 'Pending', 'Paid'].map(tab => (
            <button 
              key={tab}
              className={`fee-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab} Bills
            </button>
          ))}
        </div>
        
        {dueAmount > 0 && (
          <button className="btn-pay-all" onClick={() => openCheckout({ id: "ALL-DUE", title: "All Outstanding Dues", amount: dueAmount })}>
            Settle All Dues ({formatCurrency(dueAmount)})
          </button>
        )}
      </div>

      {/* INVOICES LIST TABLE */}
      <div className="dashboard-card fees-table-card-wrapper">
        <div className="table-overflow-box">
          <table className="fees-styled-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Fee Description</th>
                <th>Due Date</th>
                <th className="amount-col">Amount</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((fee) => (
                <tr key={fee.id}>
                  <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{fee.id}</td>
                  <td>
                    <div className="fee-title-cell" onClick={() => openInvoice(fee)} style={{ cursor: 'pointer' }}>
                      <span className="title-bold">{fee.title}</span>
                      <span className="semester-small">{fee.semester}</span>
                    </div>
                  </td>
                  <td>{fee.dueDate}</td>
                  <td className="amount-col" style={{ fontWeight: '700' }}>{formatCurrency(fee.amount)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge-pill ${fee.status === 'Paid' ? 'success' : 'warning'}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {fee.status === 'Pending' ? (
                      <button className="btn-table-pay" onClick={() => openCheckout(fee)}>Pay Now</button>
                    ) : (
                      <button className="btn-table-receipt" onClick={() => openInvoice(fee)}>
                        <FaDownload size={11} /> Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredFees.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontWeight: '500' }}>
                    No {activeTab.toLowerCase()} invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ONLINE CHECKOUT CREDIT CARD PAYMENT MODAL */}
      {/* ======================================================== */}
      {showCheckoutModal && (
        <div className="billing-modal-overlay">
          <div className="billing-modal-card animate-zoom">
            <div className="modal-header">
              <h3>Secure Online Checkout</h3>
              <button className="modal-close-icon" onClick={() => setShowCheckoutModal(false)}><FaTimes /></button>
            </div>
            
            <div className="checkout-fee-info-row">
              <span>Settling: <strong>{activeCheckoutFee.title}</strong></span>
              <span>Amount: <strong>{formatCurrency(activeCheckoutFee.amount)}</strong></span>
            </div>

            {/* STYLIZED CREDIT CARD GRAPHIC */}
            <div className="stylized-credit-card-preview">
              <div className="card-chip" />
              <div className="card-preview-number">
                {cardNumber || "•••• •••• •••• ••••"}
              </div>
              <div className="card-preview-footer">
                <div className="card-holder-col">
                  <span className="card-small-label">CARD HOLDER</span>
                  <span className="card-small-value">{cardHolder.toUpperCase() || "NAME SURNAME"}</span>
                </div>
                <div className="card-expiry-col">
                  <span className="card-small-label">EXPIRES</span>
                  <span className="card-small-value">{cardExpiry || "MM/YY"}</span>
                </div>
              </div>
            </div>

            {/* PAYMENT FORM CREDENTIALS */}
            <form onSubmit={handlePaymentSubmit} className="checkout-payment-form">
              <div className="form-input-group">
                <label>Cardholder Name</label>
                <input 
                  type="text" 
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Enter name on card"
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  maxLength="19"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  placeholder="0000 0000 0000 0000"
                  required
                />
              </div>

              <div className="checkout-form-split">
                <div className="form-input-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    maxLength="5"
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                      setCardExpiry(val);
                    }}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                
                <div className="form-input-group">
                  <label>CVV Code</label>
                  <input 
                    type="password" 
                    maxLength="3"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit-payment" disabled={isPaying}>
                {isPaying ? "Processing Authorization..." : `Settle Payment - ${formatCurrency(activeCheckoutFee.amount)}`}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ERP INVOICE DETAILS MODAL */}
      {/* ======================================================== */}
      {showInvoiceModal && (
        <div className="billing-modal-overlay">
          <div className="billing-modal-card invoice-details animate-zoom" style={{ width: '550px' }}>
            <div className="modal-header">
              <h3>University Fee Invoice</h3>
              <button className="modal-close-icon" onClick={() => setShowInvoiceModal(false)}><FaTimes /></button>
            </div>

            <div className="invoice-print-frame">
              <div className="invoice-brand-row">
                <div className="invoice-logo">U</div>
                <div className="invoice-header-meta">
                  <h4>ADANI UNIVERSITY ERP</h4>
                  <p>Admissions & Billing Sector</p>
                  <p>Ahmedabad, Gujarat, IN</p>
                </div>
              </div>

              <div className="invoice-user-meta-grid">
                <div>
                  <strong>BILL TO:</strong>
                  <p>Harsh Patel</p>
                  <p>Roll No: AU210045</p>
                  <p>Course: B.Tech (CSE)</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>INVOICE DETAILS:</strong>
                  <p>Invoice ID: {activeInvoice.id}</p>
                  <p>Due Date: {activeInvoice.dueDate}</p>
                  <p>Status: <strong style={{ color: activeInvoice.status === 'Paid' ? 'var(--success)' : 'var(--warning)' }}>{activeInvoice.status.toUpperCase()}</strong></p>
                </div>
              </div>

              <div className="invoice-table-charges">
                <table className="charges-table">
                  <thead>
                    <tr>
                      <th>Charge Description</th>
                      <th>Term</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: '600' }}>{activeInvoice.title}</td>
                      <td>{activeInvoice.semester}</td>
                      <td style={{ textAlign: 'right', fontWeight: '700' }}>{formatCurrency(activeInvoice.amount)}</td>
                    </tr>
                    <tr className="invoice-total-row">
                      <td colSpan="2" style={{ textAlign: 'right', fontWeight: '700' }}>TOTAL CHARGED:</td>
                      <td style={{ textAlign: 'right', fontWeight: '800' }}>{formatCurrency(activeInvoice.amount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="invoice-footer-notes">
                <p>This is a computer generated transaction bill. No physical signature required.</p>
                <p>For inquiries, contact: <strong>billing@adani.edu.in</strong></p>
              </div>
            </div>

            <button type="button" className="btn-print-invoice" onClick={() => window.print()}>
              <FaPrint /> Print / Save PDF Invoice
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Billing;