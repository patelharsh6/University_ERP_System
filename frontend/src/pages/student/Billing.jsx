// src/pages/student/Billing.jsx
import React, { useState } from 'react';
import './Billing.css';
import { FiDownload, FiCreditCard, FiFileText, FiPieChart, FiAlertTriangle, FiCheck, FiX, FiInfo } from 'react-icons/fi';

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
        if (item.id === activeCheckoutFee.id || activeCheckoutFee.id === "ALL-DUE") {
          if (item.status === "Pending") {
            return {
              ...item,
              status: "Paid",
              paid: item.amount
            };
          }
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
        <div className="header-icon-wrapper">
          <FiCreditCard />
        </div>
        <div>
          <h2>Billing & Fee Collections</h2>
          <p>Inspect collections, generate receipts, settle dues</p>
        </div>
      </div>

      {/* FINANCIAL SUMMARY CARDS (Fee Analytics Panel) */}
      <div className="fees-summary-analytics">
        
        {/* Card 1: Total Invoiced */}
        <div className="fee-analytic-card invoiced">
          <div className="card-top">
            <span className="analytic-label">Total Invoiced</span>
            <div className="analytic-icon"><FiFileText /></div>
          </div>
          <div className="analytic-value">{formatCurrency(totalAmount)}</div>
          <span className="analytic-sub">Across {fees.length} charges</span>
        </div>

        {/* Card 2: Paid Collection */}
        <div className="fee-analytic-card collected">
          <div className="card-top">
            <span className="analytic-label">Total Collected</span>
            <div className="analytic-icon"><FiPieChart /></div>
          </div>
          <div className="analytic-value">{formatCurrency(paidAmount)}</div>
          <span className="analytic-sub">Collection rate: {Math.round((paidAmount / totalAmount) * 100)}%</span>
        </div>

        {/* Card 3: Outstanding Due */}
        <div className="fee-analytic-card outstanding">
          <div className="card-top">
            <span className="analytic-label">Outstanding Due</span>
            <div className="analytic-icon"><FiCreditCard /></div>
          </div>
          <div className="analytic-value">{formatCurrency(dueAmount)}</div>
          <span className="analytic-sub">Next: 15 Mar 2026</span>
        </div>

        {/* Card 4: Defaulters */}
        <div className="fee-analytic-card defaulters">
          <div className="card-top">
            <span className="analytic-label">Defaulters</span>
            <div className="analytic-icon"><FiAlertTriangle /></div>
          </div>
          <div className="analytic-value">{defaultersCount} Accounts</div>
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
            <FiAlertTriangle size={16} /> Settle All ({formatCurrency(dueAmount)})
          </button>
        )}
      </div>

      {/* INVOICES LIST TABLE */}
      <div className="fees-table-card-wrapper">
        <div className="table-overflow-box">
          <table className="fees-styled-table">
            <thead>
              <tr>
                <th>Invoice details</th>
                <th>Due date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((fee) => (
                <tr key={fee.id}>
                  <td>
                    <div className="fee-title-cell">
                      <span className="title-bold">{fee.title}</span>
                      <span className="semester-small">{fee.id} • {fee.semester}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--bill-text-muted)" }}>{fee.dueDate}</td>
                  <td className="amount-col">{formatCurrency(fee.amount)}</td>
                  <td>
                    <span className={`status-pill ${fee.status.toLowerCase()}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td>
                    {fee.status === 'Pending' ? (
                      <button className="btn-table-pay" onClick={() => openCheckout(fee)}>
                        Pay Now
                      </button>
                    ) : (
                      <button className="btn-table-receipt" onClick={() => openInvoice(fee)}>
                        <FiDownload size={12} /> Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredFees.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--bill-text-muted)', padding: '24px' }}>
                    No {activeTab.toLowerCase()} bills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================
          MODALS SECTION (CHECKOUT & INVOICE) 
          ========================================= */}

      {/* CHECKOUT PAYMENT MODAL */}
      {showCheckoutModal && activeCheckoutFee && (
        <div className="billing-modal-overlay">
          <div className="billing-modal-card">
            
            <div className="modal-header">
              <h3>Secure Checkout</h3>
              <button className="modal-close-icon" onClick={() => setShowCheckoutModal(false)}>
                <FiX />
              </button>
            </div>

            <div className="checkout-fee-info-row">
              <span style={{ fontWeight: 600 }}>{activeCheckoutFee.title}</span>
              <span style={{ fontWeight: 700, color: "var(--bill-accent-teal)" }}>
                {formatCurrency(activeCheckoutFee.amount)}
              </span>
            </div>

            {/* STYLIZED CREDIT CARD PREVIEW */}
            <div className="stylized-credit-card-preview">
              <div className="card-chip"></div>
              <div className="card-preview-number">
                {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : "•••• •••• •••• ••••"}
              </div>
              <div className="card-preview-footer">
                <div>
                  <span className="card-small-label">Card Holder</span>
                  <span className="card-small-value">{cardHolder || "NAME ON CARD"}</span>
                </div>
                <div>
                  <span className="card-small-label">Valid Thru</span>
                  <span className="card-small-value">{cardExpiry || "MM/YY"}</span>
                </div>
              </div>
            </div>

            {/* PAYMENT FORM */}
            <form className="checkout-payment-form" onSubmit={handlePaymentSubmit}>
              <input 
                type="text" 
                placeholder="Card Holder Name" 
                value={cardHolder} 
                onChange={e => setCardHolder(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                placeholder="Card Number (16 digits)" 
                maxLength="16"
                value={cardNumber} 
                onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))} 
                required 
              />
              <div className="checkout-form-split">
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  maxLength="5"
                  value={cardExpiry} 
                  onChange={e => setCardExpiry(e.target.value)} 
                  required 
                />
                <input 
                  type="password" 
                  placeholder="CVV" 
                  maxLength="3"
                  value={cardCvv} 
                  onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))} 
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                className="btn-submit-payment"
                disabled={isPaying}
              >
                {isPaying ? "Processing..." : `Pay ${formatCurrency(activeCheckoutFee.amount)}`}
              </button>
            </form>

            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--bill-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <FiCheck /> Secured by AES-256 Encryption
            </div>
          </div>
        </div>
      )}

      {/* VIEW INVOICE / RECEIPT MODAL */}
      {showInvoiceModal && activeInvoice && (
        <div className="billing-modal-overlay" onClick={() => setShowInvoiceModal(false)}>
          <div className="billing-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            
            <div className="modal-header">
              <h3>Receipt</h3>
              <button className="modal-close-icon" onClick={() => setShowInvoiceModal(false)}>
                <FiX />
              </button>
            </div>

            {/* PRINTABLE INVOICE FRAME */}
            <div className="invoice-print-frame">
              <div className="invoice-brand-row">
                <div className="invoice-logo">U</div>
                <div className="invoice-header-meta">
                  <h4>University ERP</h4>
                  <p>Tax Invoice / Receipt</p>
                </div>
              </div>
              
              <div className="invoice-user-meta-grid">
                <div>
                  <p style={{ color: "var(--bill-text-muted)" }}>Billed To</p>
                  <p><strong>Harsh Patel</strong></p>
                  <p>Student ID: 2023CSB1045</p>
                  <p>B.Tech Computer Science</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: "var(--bill-text-muted)" }}>Invoice Details</p>
                  <p><strong>No: {activeInvoice.id}</strong></p>
                  <p>Date: {new Date().toLocaleDateString('en-GB')}</p>
                  <p style={{ color: "var(--badge-paid-text)", fontWeight: 600, marginTop: '4px' }}>Status: PAID</p>
                </div>
              </div>

              <div className="invoice-table-charges">
                <table className="charges-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{activeInvoice.title}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(activeInvoice.amount)}</td>
                    </tr>
                    <tr className="invoice-total-row">
                      <td style={{ textAlign: 'right' }}>Total Paid:</td>
                      <td style={{ textAlign: 'right', fontSize: '1.1rem', color: "var(--bill-text-primary)" }}>
                        {formatCurrency(activeInvoice.amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="invoice-footer-notes">
                <p>This is a computer generated receipt and does not require a signature.</p>
                <p>For any queries, please contact accounts@university.edu</p>
              </div>
            </div>

            <button className="btn-print-invoice" onClick={() => window.print()}>
              <FiDownload size={16} /> Download PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Billing;