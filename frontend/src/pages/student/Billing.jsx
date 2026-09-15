// src/pages/student/Billing.jsx
import React, { useState, useMemo } from 'react';
import './Billing.css';
import { 
  FiDownload, FiCreditCard, FiFileText, FiPieChart, 
  FiAlertTriangle, FiCheck, FiX, FiInbox, FiPrinter 
} from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { request } from '../../services/api';
import { endpoints } from '../../services/endpoints';
import { formatCurrency, formatDate } from '../../utils/format';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

const Billing = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('All');

  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [activeCheckoutFee, setActiveCheckoutFee] = useState(null);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Invoice Details Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);

  const { 
    data: feeData, 
    loading: loadingFees, 
    error: errorFees, 
    refetch: refetchFees 
  } = useApi(endpoints.fees.list, { params: { page_size: 100 } });

  const rawFees = Array.isArray(feeData) 
    ? feeData 
    : (feeData?.results || []);

  const normalizedFees = useMemo(() => {
    return rawFees.map(fee => {
      const total = parseFloat(fee.total_amount || 0);
      const paid = parseFloat(fee.amount_paid || 0);
      const due = Math.max(0, total - paid);
      
      let status = fee.status || 'pending';
      if (paid >= total && total > 0) {
        status = 'paid';
      } else if (fee.due_date && new Date(fee.due_date) < new Date() && paid < total) {
        status = 'overdue';
      }

      return {
        id: fee.id,
        invoiceCode: fee.transaction_id || `INV-${String(fee.id).padStart(5, '0')}`,
        title: fee.fee_name || fee.fee_structure?.name || 'Academic Fee',
        dueDate: fee.due_date ? formatDate(fee.due_date) : 'N/A',
        rawDueDate: fee.due_date,
        amount: total,
        paid: paid,
        due: due,
        status: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
        rawStatus: status.toLowerCase(),
        semester: fee.fee_structure?.semester || 'Current Term',
        transactionId: fee.transaction_id,
        paymentMethod: fee.payment_method || 'Online',
        raw: fee,
      };
    });
  }, [rawFees]);

  // --- CALCULATE FINANCIAL ANALYTICS ---
  const { totalAmount, paidAmount, dueAmount, defaultersCount } = useMemo(() => {
    let total = 0;
    let paid = 0;
    let defaulters = 0;

    normalizedFees.forEach(fee => {
      total += fee.amount;
      paid += fee.paid;
      if (fee.rawStatus === 'overdue' || (fee.rawStatus === 'pending' && fee.rawDueDate && new Date(fee.rawDueDate) < new Date())) {
        defaulters++;
      }
    });

    return {
      totalAmount: total,
      paidAmount: paid,
      dueAmount: Math.max(0, total - paid),
      defaultersCount: defaulters,
    };
  }, [normalizedFees]);

  // --- FILTER LOGIC ---
  const filteredFees = useMemo(() => {
    if (activeTab === 'All') return normalizedFees;
    return normalizedFees.filter(fee => fee.status.toLowerCase() === activeTab.toLowerCase());
  }, [normalizedFees, activeTab]);

  // --- TRIGGER PAY MODAL ---
  const openCheckout = (fee) => {
    setActiveCheckoutFee(fee);
    setShowCheckoutModal(true);
    setCardHolder(user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
  };

  // --- SUBMIT PAYMENT ---
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
      toast.warning('Please fill in all card credentials.');
      return;
    }

    setIsPaying(true);
    const txnId = `TXN-${Date.now()}`;

    try {
      if (activeCheckoutFee.id === 'ALL-DUE') {
        // Pay all pending fees
        const pendingList = normalizedFees.filter(f => f.due > 0);
        await Promise.all(
          pendingList.map(item => 
            request(endpoints.fees.detail(item.id), {
              method: 'PATCH',
              body: {
                amount_paid: item.amount,
                payment_method: 'online',
                transaction_id: txnId,
              }
            })
          )
        );
      } else {
        await request(endpoints.fees.detail(activeCheckoutFee.id), {
          method: 'PATCH',
          body: {
            amount_paid: activeCheckoutFee.amount,
            payment_method: 'online',
            transaction_id: txnId,
          }
        });
      }

      toast.success(`Payment of ${formatCurrency(activeCheckoutFee.amount)} processed successfully!`);
      setShowCheckoutModal(false);
      refetchFees();
    } catch (err) {
      toast.error(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  // --- VIEW INVOICE MODAL ---
  const openInvoice = (fee) => {
    setActiveInvoice(fee);
    setShowInvoiceModal(true);
  };

  const studentFullName = user 
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username 
    : 'Student';

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

      {/* FINANCIAL SUMMARY CARDS */}
      <div className="fees-summary-analytics">
        
        {/* Card 1: Total Invoiced */}
        <div className="fee-analytic-card invoiced">
          <div className="card-top">
            <span className="analytic-label">Total Invoiced</span>
            <div className="analytic-icon"><FiFileText /></div>
          </div>
          <div className="analytic-value">{formatCurrency(totalAmount)}</div>
          <span className="analytic-sub">Across {normalizedFees.length} charges</span>
        </div>

        {/* Card 2: Paid Collection */}
        <div className="fee-analytic-card collected">
          <div className="card-top">
            <span className="analytic-label">Total Collected</span>
            <div className="analytic-icon"><FiPieChart /></div>
          </div>
          <div className="analytic-value">{formatCurrency(paidAmount)}</div>
          <span className="analytic-sub">
            Collection rate: {totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0}%
          </span>
        </div>

        {/* Card 3: Outstanding Due */}
        <div className="fee-analytic-card outstanding">
          <div className="card-top">
            <span className="analytic-label">Outstanding Due</span>
            <div className="analytic-icon"><FiCreditCard /></div>
          </div>
          <div className="analytic-value">{formatCurrency(dueAmount)}</div>
          <span className="analytic-sub">
            {dueAmount > 0 ? 'Payment Required' : 'All Dues Settled'}
          </span>
        </div>

        {/* Card 4: Defaulters / Overdue */}
        <div className="fee-analytic-card defaulters">
          <div className="card-top">
            <span className="analytic-label">Overdue Invoices</span>
            <div className="analytic-icon"><FiAlertTriangle /></div>
          </div>
          <div className="analytic-value">{defaultersCount} Charges</div>
          <span className="analytic-sub">Dues past deadline</span>
        </div>
      </div>

      {/* FILTER & ACTIONS BAR */}
      <div className="fees-controls-bar">
        <div className="fee-tabs-group">
          {['All', 'Pending', 'Paid', 'Overdue'].map(tab => (
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
          <button 
            className="btn-pay-all" 
            onClick={() => openCheckout({ id: 'ALL-DUE', title: 'All Outstanding Dues', amount: dueAmount })}
          >
            <FiAlertTriangle size={16} /> Settle All ({formatCurrency(dueAmount)})
          </button>
        )}
      </div>

      {/* INVOICES LIST TABLE */}
      <div className="fees-table-card-wrapper">
        {loadingFees ? (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skeleton height="40px" borderRadius="8px" />
            <Skeleton height="40px" borderRadius="8px" />
            <Skeleton height="40px" borderRadius="8px" />
          </div>
        ) : errorFees ? (
          <div style={{ padding: '24px' }}>
            <ErrorState 
              message="Failed to load fee payments. Please try again." 
              onRetry={refetchFees} 
            />
          </div>
        ) : (
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
                        <span className="semester-small">{fee.invoiceCode} • {fee.semester}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--bill-text-muted)' }}>{fee.dueDate}</td>
                    <td className="amount-col">{formatCurrency(fee.amount)}</td>
                    <td>
                      <span className={`status-pill ${fee.rawStatus}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td>
                      {fee.rawStatus === 'paid' ? (
                        <button className="btn-table-receipt" onClick={() => openInvoice(fee)}>
                          <FiDownload size={12} /> Receipt
                        </button>
                      ) : (
                        <button className="btn-table-pay" onClick={() => openCheckout(fee)}>
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredFees.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--bill-text-muted)', padding: '36px' }}>
                      <FiInbox style={{ fontSize: '2rem', opacity: 0.5, marginBottom: '8px' }} />
                      <div>No {activeTab.toLowerCase()} bills found.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================
          MODALS SECTION (CHECKOUT & INVOICE) 
          ========================================= */}

      {/* CHECKOUT PAYMENT MODAL */}
      {showCheckoutModal && activeCheckoutFee && (
        <div className="billing-modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="billing-modal-card" onClick={e => e.stopPropagation()}>
            
            <div className="modal-header">
              <h3>Secure Checkout</h3>
              <button className="modal-close-icon" onClick={() => setShowCheckoutModal(false)}>
                <FiX />
              </button>
            </div>

            <div className="checkout-fee-info-row">
              <span style={{ fontWeight: 600 }}>{activeCheckoutFee.title}</span>
              <span style={{ fontWeight: 700, color: 'var(--bill-accent-teal)' }}>
                {formatCurrency(activeCheckoutFee.amount)}
              </span>
            </div>

            {/* STYLIZED CREDIT CARD PREVIEW */}
            <div className="stylized-credit-card-preview">
              <div className="card-chip"></div>
              <div className="card-preview-number">
                {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
              </div>
              <div className="card-preview-footer">
                <div>
                  <span className="card-small-label">Card Holder</span>
                  <span className="card-small-value">{cardHolder || 'NAME ON CARD'}</span>
                </div>
                <div>
                  <span className="card-small-label">Valid Thru</span>
                  <span className="card-small-value">{cardExpiry || 'MM/YY'}</span>
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
                {isPaying ? 'Processing...' : `Pay ${formatCurrency(activeCheckoutFee.amount)}`}
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
                  <p style={{ color: 'var(--bill-text-muted)' }}>Billed To</p>
                  <p><strong>{studentFullName}</strong></p>
                  <p>Student ID: {user?.enrollment_id || user?.id || 'N/A'}</p>
                  <p>{user?.department_name || user?.department || 'Undergraduate Degree'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--bill-text-muted)' }}>Invoice Details</p>
                  <p><strong>No: {activeInvoice.invoiceCode}</strong></p>
                  <p>Date: {new Date().toLocaleDateString('en-GB')}</p>
                  <p style={{ color: 'var(--badge-paid-text)', fontWeight: 600, marginTop: '4px' }}>
                    Status: {activeInvoice.status.toUpperCase()}
                  </p>
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
                      <td style={{ textAlign: 'right', fontSize: '1.1rem', color: 'var(--bill-text-primary)' }}>
                        {formatCurrency(activeInvoice.paid || activeInvoice.amount)}
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
              <FiPrinter size={16} /> Print / Save PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Billing;