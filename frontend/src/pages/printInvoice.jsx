// src/pages/PrintInvoice.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import invoiceService from "../services/invoiceService";
import { LoadingSpinner, ErrorMessage } from "../components/common";

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getSafeNumber = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

function PrintInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [printTriggered, setPrintTriggered] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getInvoice(id);
      setInvoice(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch invoice.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-print when invoice loads
  useEffect(() => {
    if (!loading && invoice && !printTriggered) {
      setPrintTriggered(true);
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading, invoice, printTriggered]);

  // Handle after print
  useEffect(() => {
    const handleAfterPrint = () => {
      // Navigate back to invoice details after printing
      navigate(`/invoices/${id}`);
    };

    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LoadingSpinner size="lg" text="Loading invoice..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invoice not found</h2>
          <button
            onClick={() => navigate('/invoices')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Invoices
          </button>
        </div>    
      </div>
    );
  }

  // Calculate totals safely
  const subtotal = getSafeNumber(invoice.subtotal);
  const laborCharge = getSafeNumber(invoice.laborCharge);
  const tax = getSafeNumber(invoice.tax);
  const discount = getSafeNumber(invoice.discount);
  const total = getSafeNumber(invoice.total);
  const partsSubtotal = subtotal - laborCharge;

  // Calculate parts total from array
  const partsTotal = invoice.parts?.reduce((sum, part) => {
    return sum + (getSafeNumber(part.quantity) * getSafeNumber(part.price));
  }, 0) || 0;

  return (
    <div className="print-wrapper">
      {/* Print-only invoice */}
      <div className="print-invoice" id="invoice-print">
        {/* Header */}
        <div className="invoice-header">
          <h1 className="company-name">MotoFix Pro</h1>
          <p className="company-tagline">Motorcycle Repair &amp; Service Center</p>
          <div className="divider"></div>
        </div>

        {/* Invoice Title */}
        <div className="invoice-title">
          <h2>INVOICE</h2>
          <div className="invoice-meta">
            <span><strong>Invoice #:</strong> {invoice.invoiceNumber}</span>
            <span><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}</span>
          </div>
        </div>

        {/* Customer & Vehicle Section */}
        <div className="info-grid">
          <div className="info-section">
            <h3>Customer</h3>
            <p><strong>Name:</strong> {invoice.customer?.name || 'N/A'}</p>
            <p><strong>Phone:</strong> {invoice.customer?.phone || 'N/A'}</p>
            {invoice.customer?.email && (
              <p><strong>Email:</strong> {invoice.customer.email}</p>
            )}
          </div>

          <div className="info-section">
            <h3>Vehicle</h3>
            <p><strong>Brand:</strong> {invoice.vehicle?.brand || 'N/A'}</p>
            <p><strong>Model:</strong> {invoice.vehicle?.model || 'N/A'}</p>
            <p><strong>Registration:</strong> {invoice.vehicle?.registrationNumber || 'N/A'}</p>
          </div>

          <div className="info-section">
            <h3>Repair Job</h3>
            <p><strong>Job #:</strong> {invoice.repairJob?.jobNumber || 'N/A'}</p>
            <p><strong>Status:</strong> {invoice.repairJob?.status || 'N/A'}</p>
            <p><strong>Complaint:</strong> {invoice.repairJob?.customerComplaint || 'N/A'}</p>
          </div>
        </div>

        {/* Parts Table */}
        <div className="parts-section">
          <h3>Parts Used</h3>
          <table className="parts-table">
            <thead>
              <tr>
                <th className="text-left">Part</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Price (₹)</th>
                <th className="text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.parts && invoice.parts.length > 0 ? (
                invoice.parts.map((part, index) => {
                  const quantity = getSafeNumber(part.quantity);
                  const price = getSafeNumber(part.price);
                  const partTotal = quantity * price;
                  
                  return (
                    <tr key={index}>
                      <td className="text-left">{part.partName || 'N/A'}</td>
                      <td className="text-center">{quantity}</td>
                      <td className="text-right">{formatCurrency(price)}</td>
                      <td className="text-right">{formatCurrency(partTotal)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No parts used in this invoice
                  </td>
                </tr>
              )}
            </tbody>
            {invoice.parts && invoice.parts.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-right font-bold">Total Parts</td>
                  <td className="text-right font-bold">{formatCurrency(partsTotal)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Summary Section */}
        <div className="summary-section">
          <div className="summary-line">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>Labour Charge</span>
            <span>{formatCurrency(laborCharge)}</span>
          </div>
          <div className="summary-line">
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="summary-line">
            <span>Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-total">
            <span>Grand Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="summary-status">
            <span>Payment Status:</span>
            <span className={`status-badge ${invoice.paymentStatus === 'Paid' ? 'status-paid' : 'status-pending'}`}>
              {invoice.paymentStatus || 'Pending'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="invoice-footer">
          <div className="signature">
            <p>Authorized Signature</p>
            <div className="signature-line"></div>
          </div>
          <div className="footer-note">
            <p>Thank you for choosing MotoFix Pro!</p>
            <p className="footer-small">This is a computer-generated invoice.</p>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
       
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .print-wrapper {
          background: white;
          min-height: 100vh;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .print-invoice {
          max-width: 800px;
          width: 100%;
          background: white;
          padding: 40px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #1a1a1a;
        }

        .invoice-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .company-name {
          font-size: 28px;
          font-weight: 800;
          color: #ea580c;
          margin: 0;
          letter-spacing: 1px;
        }

        .company-tagline {
          font-size: 14px;
          color: #666;
          margin: 4px 0 0 0;
        }

        .divider {
          border-top: 2px solid #e5e7eb;
          margin-top: 12px;
        }

        .invoice-title {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 24px;
        }

        .invoice-title h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .invoice-meta {
          font-size: 14px;
          color: #4b5563;
        }

        .invoice-meta span {
          display: inline-block;
          margin-left: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .info-section h3 {
          font-size: 12px;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 8px 0;
        }

        .info-section p {
          font-size: 14px;
          margin: 4px 0;
          color: #1a1a1a;
        }

        .info-section p strong {
          font-weight: 600;
          color: #374151;
        }

        .parts-section {
          margin-bottom: 30px;
        }

        .parts-section h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: #1a1a1a;
        }

        .parts-table {
          width: 100%;
          border-collapse: collapse;
        }

        .parts-table th {
          background: #f3f4f6;
          padding: 10px 12px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #4b5563;
          border-bottom: 2px solid #e5e7eb;
        }

        .parts-table td {
          padding: 10px 12px;
          font-size: 14px;
          border-bottom: 1px solid #e5e7eb;
          color: #1a1a1a;
        }

        .parts-table tfoot td {
          font-weight: 700;
          padding-top: 12px;
          border-top: 2px solid #d1d5db;
          border-bottom: none;
        }

        .parts-table .text-left {
          text-align: left;
        }

        .parts-table .text-center {
          text-align: center;
        }

        .parts-table .text-right {
          text-align: right;
        }

        .summary-section {
          max-width: 400px;
          margin-left: auto;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 14px;
          color: #4b5563;
        }

        .summary-line span:last-child {
          font-weight: 500;
          color: #1a1a1a;
        }

        .summary-divider {
          border-top: 1px solid #d1d5db;
          margin: 8px 0;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .summary-total span:last-child {
          color: #ea580c;
        }

        .summary-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
        }

        .status-badge {
          padding: 4px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 13px;
        }

        .status-paid {
          background: #d1fae5;
          color: #065f46;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .invoice-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .signature p {
          font-size: 13px;
          color: #6b7280;
          margin: 0 0 8px 0;
        }

        .signature-line {
          width: 200px;
          border-top: 1px solid #1a1a1a;
          margin-top: 4px;
        }

        .footer-note {
          text-align: right;
        }

        .footer-note p {
          font-size: 14px;
          color: #1a1a1a;
          margin: 0;
        }

        .footer-small {
          font-size: 12px !important;
          color: #6b7280 !important;
          margin-top: 4px !important;
        }

        /* Print-specific styles */
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .print-wrapper {
            padding: 0 !important;
            background: white !important;
            display: block !important;
          }

          .print-invoice {
            padding: 20px 40px !important;
            max-width: 100% !important;
          }

          .info-grid {
            background: #f9fafb !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .parts-table th {
            background: #f3f4f6 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .summary-section {
            background: #f9fafb !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .status-paid {
            background: #d1fae5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .status-pending {
            background: #fef3c7 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print {
            display: none !important;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .print-invoice {
            padding: 20px !important;
          }

          .info-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }

          .invoice-title {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .invoice-meta span {
            display: block;
            margin-left: 0;
          }

          .summary-section {
            max-width: 100%;
          }

          .invoice-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .signature-line {
            width: 100%;
          }

          .footer-note {
            text-align: left;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default PrintInvoice;