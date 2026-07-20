// pages/InvoiceDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import invoiceService from "../services/invoiceService";
import { LoadingSpinner, ErrorMessage } from "../components/common";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError(
        err.response?.data?.message || "Failed to fetch invoice."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-6xl mx-auto p-6 animate-slideUp print-container">
      {/* Header - Hide print button in print */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 no-print">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/invoices')}
            className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-zinc-400 hover:text-white border border-slate-700/50 hover:border-orange-500/30 transition-all duration-200 flex items-center gap-2 group"
            aria-label="Back to Invoices"
          >
            <svg 
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline text-sm">Back</span>
          </button>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Invoice Details
            </h1>
            <p className="text-zinc-400 mt-1">
              Invoice #{invoice.invoiceNumber}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/invoices/print/${invoice._id}`)}
            className="print-button px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition"
          >
            🖨 Print Invoice
          </button>

          <div
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
              invoice.paymentStatus === "Paid"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
            }`}
          >
            {invoice.paymentStatus}
          </div>
        </div>
      </div>

      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Information */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Invoice
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-zinc-500">Invoice Number</p>
              <p className="text-orange-400 font-medium">
                {invoice.invoiceNumber}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Created On</p>
              <p className="text-white">
                {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Payment Status</p>
              <p className="text-white">
                {invoice.paymentStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Customer
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-zinc-500">Name</p>
              <p className="text-white">
                {invoice.customer?.name || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Phone</p>
              <p className="text-white">
                {invoice.customer?.phone || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Email</p>
              <p className="text-white">
                {invoice.customer?.email || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Vehicle
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-zinc-500">Brand</p>
              <p className="text-white">
                {invoice.vehicle?.brand || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Model</p>
              <p className="text-white">
                {invoice.vehicle?.model || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Registration</p>
              <p className="text-white">
                {invoice.vehicle?.registrationNumber || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Repair Job */}
      <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Repair Job
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-zinc-500">Job Number</p>
            <p className="text-white font-medium">
              {invoice.repairJob?.jobNumber || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">Status</p>
            <p className="text-white font-medium">
              {invoice.repairJob?.status || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">Estimated Hours</p>
            <p className="text-white font-medium">
              {invoice.repairJob?.estimatedHours ?? "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">Arrival Date</p>
            <p className="text-white font-medium">
              {invoice.repairJob?.arrivalDate
                ? new Date(invoice.repairJob.arrivalDate).toLocaleDateString("en-IN", {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-zinc-500 mb-2">
            Customer Complaint
          </p>

          <div className="bg-slate-900/40 rounded-lg p-4 text-white">
            {invoice.repairJob?.customerComplaint || "N/A"}
          </div>
        </div>

        {invoice.repairJob?.diagnosticNotes && (
          <div className="mt-4">
            <p className="text-sm text-zinc-500 mb-2">
              Diagnostic Notes
            </p>

            <div className="bg-slate-900/40 rounded-lg p-4 text-white">
              {invoice.repairJob.diagnosticNotes}
            </div>
          </div>
        )}
      </div>

      {/* Parts Used */}
      <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Parts Used
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 text-zinc-400">Part</th>
                <th className="text-center py-3 text-zinc-400">Qty</th>
                <th className="text-right py-3 text-zinc-400">Price</th>
                <th className="text-right py-3 text-zinc-400">Total</th>
              </tr>
            </thead>

            <tbody>
              {invoice.parts && invoice.parts.length > 0 ? (
                invoice.parts.map((part, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-800"
                  >
                    <td className="py-3 text-white">
                      {part.partName}
                    </td>

                    <td className="text-center text-zinc-300">
                      {part.quantity}
                    </td>

                    <td className="text-right text-zinc-300">
                      {formatCurrency(part.price)}
                    </td>

                    <td className="text-right text-orange-400 font-medium">
                      {formatCurrency(part.quantity * part.price)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-zinc-400">
                    No parts used in this invoice
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Notes
          </h2>

          <div className="bg-slate-900/40 rounded-lg p-4 min-h-[140px]">
            <p className="text-zinc-300 whitespace-pre-wrap">
              {invoice.notes || "No notes added."}
            </p>
          </div>
        </div>

        {/* Charges Summary */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Invoice Summary
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-400">
                Parts Subtotal
              </span>

              <span className="text-white">
                {formatCurrency((invoice.subtotal || 0) - (invoice.laborCharge || 0))}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">
                Labor Charge
              </span>

              <span className="text-white">
                {formatCurrency(invoice.laborCharge || 0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">
                Tax
              </span>

              <span className="text-white">
                {formatCurrency(invoice.tax || 0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">
                Discount
              </span>

              <span className="text-red-400">
                -{formatCurrency(invoice.discount || 0)}
              </span>
            </div>

            <hr className="border-slate-700" />

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">
                Grand Total
              </span>

              <span className="text-2xl font-bold text-orange-400">
                {formatCurrency(invoice.total || 0)}
              </span>
            </div>

            <div className="pt-4">
              <span
                className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
                  invoice.paymentStatus === "Paid"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : invoice.paymentStatus === "Pending"
                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                    : "bg-red-500/10 text-red-400 border border-red-500/30"
                }`}
              >
                {invoice.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;