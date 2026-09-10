/**
 * Official PDF GST Tax Invoice Generator & Downloader
 * Module: components/order/TaxInvoiceModal.jsx
 * 
 * Provides store customers and administrators with a legally compliant
 * Indian GST Tax Invoice (HSN Code 8517 12 00) with instant 1-click PDF download
 * and clean print capabilities.
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Printer,
  Download,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Info,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper to convert number to words (Indian numbering format)
const numberToWords = (num) => {
  if (!num || isNaN(num)) return 'Zero Rupees Only';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertTens = (n) => {
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
  };

  const convertHundreds = (n) => {
    if (n > 99) {
      return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertTens(n % 100) : '');
    }
    return convertTens(n);
  };

  const integerPart = Math.floor(num);
  if (integerPart === 0) return 'Zero Rupees Only';

  let str = '';
  const crore = Math.floor(integerPart / 10000000);
  const lakh = Math.floor((integerPart % 10000000) / 100000);
  const thousand = Math.floor((integerPart % 100000) / 1000);
  const remainder = integerPart % 1000;

  if (crore > 0) str += convertHundreds(crore) + ' Crore ';
  if (lakh > 0) str += convertHundreds(lakh) + ' Lakh ';
  if (thousand > 0) str += convertHundreds(thousand) + ' Thousand ';
  if (remainder > 0) str += convertHundreds(remainder);

  return 'Rupees ' + str.trim() + ' Only';
};

const TaxInvoiceModal = ({ isOpen, onClose, order }) => {
  const invoiceRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen || !order) return null;

  // Invoice calculations
  const invoiceNumber = `MS-INV-2026-${order.orderNumber ? order.orderNumber.replace(/[^0-9A-Za-z]/g, '') : '8821'}`;
  const invoiceDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const totalAmount = Number(order.totalAmount || 0);
  const shippingFee = Number(order.shippingFee || 0);
  const discountAmount = Number(order.discountAmount || 0);

  // For 18% GST (9% CGST + 9% SGST for Telangana, or 18% IGST)
  // Taxable Value = Amount / 1.18
  const taxableSubtotal = Math.round((totalAmount / 1.18) * 100) / 100;
  const totalGst = Math.round((totalAmount - taxableSubtotal) * 100) / 100;
  const cgstAmount = Math.round((totalGst / 2) * 100) / 100;
  const sgstAmount = Math.round((totalGst - cgstAmount) * 100) / 100;

  const shipping = order.shippingAddress || {};
  const customerName = shipping.fullName || order.customerName || order.recipientName || 'Valued Customer';
  const customerPhone = shipping.phoneNumber || order.customerPhone || order.recipientPhone || 'N/A';
  const customerEmail = shipping.email || order.customerEmail || order.recipientEmail || 'N/A';
  const addrLine1 = shipping.addressLine1 || order.addressLine1 || (order.deliveryType === 'STORE_PICKUP' ? 'MS Flagship Experience Center Pickup' : 'Express Doorstep Delivery');
  const addrLine2 = shipping.addressLine2 || order.addressLine2 || '';
  const city = shipping.city || order.city || 'Hyderabad';
  const state = shipping.state || order.state || 'Telangana';
  const postalCode = shipping.postalCode || order.postalCode || '500081';

  // 1. Download PDF using html2canvas & jsPDF with locked desktop A4 resolution
  const handleDownloadPdf = async () => {
    if (!invoiceRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const element = invoiceRef.current;
      
      // Render clean canvas with desktop A4 width (800px) regardless of current device screen size
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const sheet = clonedDoc.getElementById('tax-invoice-sheet');
          if (sheet) {
            sheet.style.width = '800px';
            sheet.style.minWidth = '800px';
            sheet.style.maxWidth = '800px';
            sheet.style.padding = '36px 40px';
            sheet.style.margin = '0 auto';
            sheet.style.boxSizing = 'border-box';
            sheet.style.transform = 'none';
            sheet.style.borderRadius = '0px';
            sheet.style.boxShadow = 'none';
            sheet.style.border = 'none';
          }
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const maxContentWidth = pageWidth - (margin * 2); // 190mm
      const maxContentHeight = pageHeight - (margin * 2); // 277mm

      let imgWidth = maxContentWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If content is taller than available single page height, scale down proportionally so NO distortion occurs
      if (imgHeight > maxContentHeight) {
        const ratio = maxContentHeight / imgHeight;
        imgHeight = maxContentHeight;
        imgWidth = imgWidth * ratio;
      }

      // Center on page with clean margins
      const xPos = (pageWidth - imgWidth) / 2;
      const yPos = Math.max(margin, (pageHeight - imgHeight) / 2);

      pdf.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(`${invoiceNumber}.pdf`);
    } catch (err) {
      console.error('Error generating PDF invoice:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 2. Direct clean print
  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto print:p-0">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-dark-950/85 backdrop-blur-md print:hidden"
        />

        {/* Modal Dialog Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-dark-900 border border-dark-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-2 sm:my-8 print:border-none print:shadow-none print:rounded-none print:m-0 print:p-0"
        >
          {/* Top Floating Control Bar */}
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-dark-800 bg-dark-850/95 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
            <div className="flex items-center justify-between sm:justify-start gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent-500/10 border border-accent-500/30 flex items-center justify-center text-accent-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>GST Tax Invoice</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      HSN 8517
                    </span>
                  </h3>
                  <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 block">
                    {invoiceNumber}
                  </span>
                </div>
              </div>

              {/* Close Button on Mobile (top right) */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors sm:hidden"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-neutral-200 hover:text-white border border-dark-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-glow-sm disabled:opacity-50"
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>

              {/* Close button on desktop */}
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:flex p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors ml-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Parchment A4 Sheet Viewer */}
          <div className="p-2 sm:p-6 overflow-x-auto overflow-y-auto max-h-[75vh] sm:max-h-[80vh] print:max-h-none print:overflow-visible print:p-0 bg-neutral-900/60">
            {/* Mobile swipe helper hint */}
            <div className="sm:hidden mb-2 px-3 py-1.5 rounded-xl bg-dark-800/80 border border-dark-700/60 text-neutral-400 text-[10px] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Info className="w-3 h-3 text-accent-400 shrink-0" />
                Swipe horizontally to inspect full A4 sheet
              </span>
              <span className="font-mono text-accent-400 font-bold">100% Legal</span>
            </div>

            <div
              ref={invoiceRef}
              id="tax-invoice-sheet"
              className="bg-white text-neutral-900 p-6 sm:p-10 rounded-xl sm:rounded-2xl shadow-xl w-[740px] sm:w-full max-w-[800px] mx-auto text-[11px] font-sans leading-relaxed border border-neutral-200 print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-full select-text"
            >
              {/* Header Title & Original Recipient */}
              <div className="border-b-2 border-neutral-900 pb-3 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-900 uppercase">
                    MS Mobiles India Private Limited
                  </h1>
                  <p className="text-[10px] text-neutral-600 mt-0.5">
                    Authorized Flagship Retailer • Apple & Android Certified Experience Center
                  </p>
                  <p className="text-[10px] text-neutral-600">
                    Plot #14, Cyber Gateway, Cyber Towers Road, Hitec City, Hyderabad, Telangana - 500081
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-700 mt-1 flex-wrap">
                    <span><strong>GSTIN:</strong> 36AAACM1234F1Z5</span>
                    <span>•</span>
                    <span><strong>PAN:</strong> AAACM1234F</span>
                    <span>•</span>
                    <span><strong>State Code:</strong> 36 (Telangana)</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-block px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-[10px] font-bold uppercase tracking-wider text-neutral-800">
                    Tax Invoice
                  </div>
                  <span className="block text-[9px] text-neutral-500 uppercase mt-1">
                    Original for Recipient
                  </span>
                </div>
              </div>

              {/* Invoice & Order Details Grid */}
              <div className="grid grid-cols-2 gap-4 py-3 border-b border-neutral-200 text-[10px]">
                <div className="space-y-1">
                  <p><strong>Invoice Number:</strong> <span className="font-mono">{invoiceNumber}</span></p>
                  <p><strong>Invoice Date:</strong> {invoiceDate}</p>
                  <p><strong>Order Reference:</strong> <span className="font-mono">{order.orderNumber}</span></p>
                  <p><strong>Reverse Charge:</strong> No</p>
                </div>
                <div className="space-y-1 text-right">
                  <p><strong>Place of Supply:</strong> {order.state || order.city || 'Telangana (36)'}</p>
                  <p><strong>Payment Mode:</strong> {order.paymentMethod || 'Prepaid Online'}</p>
                  <p><strong>Payment Status:</strong> <span className="text-emerald-700 font-bold">PAID IN FULL</span></p>
                  <p><strong>Delivery Carrier:</strong> {order.deliveryType === 'STORE_PICKUP' ? 'Showroom Pickup' : 'Blue Dart Insured'}</p>
                </div>
              </div>

              {/* Billed To & Shipped To */}
              <div className="grid grid-cols-2 gap-4 py-3 border-b border-neutral-200">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Billed To (Customer Details)
                  </span>
                  <h4 className="font-bold text-neutral-900 text-xs">
                    {customerName}
                  </h4>
                  <p className="text-neutral-600">{addrLine1}</p>
                  {addrLine2 && <p className="text-neutral-600">{addrLine2}</p>}
                  <p className="text-neutral-600">
                    {city ? `${city}, ` : ''}{state ? `${state} - ` : ''}{postalCode || ''}
                  </p>
                  <p className="font-mono text-[10px] text-neutral-600 mt-1">
                    Phone: {customerPhone} • Email: {customerEmail}
                  </p>
                </div>

                <div className="space-y-0.5 text-right">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Shipped To (Destination)
                  </span>
                  <h4 className="font-bold text-neutral-900 text-xs">
                    {customerName}
                  </h4>
                  <p className="text-neutral-600">{addrLine1}</p>
                  <p className="text-neutral-600">
                    {city ? `${city}, ` : ''}{state ? `${state} - ` : ''}{postalCode || ''}
                  </p>
                  <p className="text-neutral-500 text-[10px]">India</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="py-4">
                <table className="w-full text-left border-collapse border border-neutral-300">
                  <thead>
                    <tr className="bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-300">
                      <th className="p-2 border-r border-neutral-300 w-8 text-center">#</th>
                      <th className="p-2 border-r border-neutral-300">Item Description</th>
                      <th className="p-2 border-r border-neutral-300 w-20 text-center font-mono">HSN Code</th>
                      <th className="p-2 border-r border-neutral-300 w-10 text-center">Qty</th>
                      <th className="p-2 border-r border-neutral-300 w-20 text-right">Rate (₹)</th>
                      <th className="p-2 border-r border-neutral-300 w-20 text-right">Taxable (₹)</th>
                      <th className="p-2 border-r border-neutral-300 w-16 text-right">GST</th>
                      <th className="p-2 w-24 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {order.items?.map((item, idx) => {
                      const itemTotal = Number(item.totalPrice || 0);
                      const itemTaxable = Math.round((itemTotal / 1.18) * 100) / 100;
                      const itemRate = Math.round((itemTaxable / (item.quantity || 1)) * 100) / 100;

                      return (
                        <tr key={item.id || idx} className="text-[10px]">
                          <td className="p-2 border-r border-neutral-300 text-center font-mono">{idx + 1}</td>
                          <td className="p-2 border-r border-neutral-300">
                            <span className="font-bold text-neutral-900 block">
                              {item.mobileBrand} {item.mobileName}
                            </span>
                            <span className="text-[9px] text-neutral-600 block">
                              {item.ram ? `${item.ram} RAM • ` : ''}{item.storage ? `${item.storage} Storage • ` : ''}1-Year Brand Warranty
                            </span>
                          </td>
                          <td className="p-2 border-r border-neutral-300 text-center font-mono">8517 12 00</td>
                          <td className="p-2 border-r border-neutral-300 text-center font-semibold">{item.quantity}</td>
                          <td className="p-2 border-r border-neutral-300 text-right font-mono">₹{itemRate.toLocaleString('en-IN')}</td>
                          <td className="p-2 border-r border-neutral-300 text-right font-mono">₹{itemTaxable.toLocaleString('en-IN')}</td>
                          <td className="p-2 border-r border-neutral-300 text-right font-mono">18%</td>
                          <td className="p-2 text-right font-bold font-mono">₹{itemTotal.toLocaleString('en-IN')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tax Summary & Invoice Totals */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
                {/* Left: GST Breakup Table */}
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">
                    GST Tax Breakdown (HSN 8517)
                  </span>
                  <table className="w-full text-[9px] border border-neutral-200">
                    <thead className="bg-neutral-50 font-bold border-b border-neutral-200">
                      <tr>
                        <th className="p-1.5 border-r border-neutral-200">Tax Type</th>
                        <th className="p-1.5 border-r border-neutral-200 text-center">Rate</th>
                        <th className="p-1.5 text-right">Tax Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 font-mono">
                      <tr>
                        <td className="p-1.5 border-r border-neutral-200">Central GST (CGST)</td>
                        <td className="p-1.5 border-r border-neutral-200 text-center">9.0%</td>
                        <td className="p-1.5 text-right">₹{cgstAmount.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 border-r border-neutral-200">State GST (SGST)</td>
                        <td className="p-1.5 border-r border-neutral-200 text-center">9.0%</td>
                        <td className="p-1.5 text-right">₹{sgstAmount.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="font-bold bg-neutral-50">
                        <td className="p-1.5 border-r border-neutral-200">Total Tax Amount</td>
                        <td className="p-1.5 border-r border-neutral-200 text-center">18.0%</td>
                        <td className="p-1.5 text-right">₹{totalGst.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Amount in words */}
                  <div className="p-2 rounded bg-neutral-50 border border-neutral-200 mt-2">
                    <span className="text-[9px] text-neutral-500 font-bold block uppercase">
                      Invoice Amount in Words:
                    </span>
                    <span className="text-[10px] font-bold text-neutral-800 italic">
                      {numberToWords(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Right: Net Summary Totals */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-600">Taxable Subtotal:</span>
                    <span className="font-mono font-semibold">₹{taxableSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-600">Total GST (18%):</span>
                    <span className="font-mono font-semibold">₹{totalGst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-600">Shipping & Transit Handling:</span>
                    <span className="font-mono font-semibold">
                      {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between py-1 border-b border-neutral-100 text-emerald-700 font-semibold">
                      <span>Promotional Discount:</span>
                      <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t-2 border-neutral-900 text-sm font-black text-neutral-900 mt-2">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Declaration & Signature Stamp */}
              <div className="mt-8 pt-4 border-t border-neutral-300 flex items-end justify-between gap-6">
                <div className="max-w-xs space-y-1 text-[9px] text-neutral-500">
                  <p className="font-bold uppercase text-neutral-700">Declaration & Terms:</p>
                  <p>1. We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                  <p>2. Goods covered under 1-Year Indian Manufacturer Brand Warranty.</p>
                  <p>3. This is a computer-generated tax invoice valid under the CGST/SGST Acts, 2017.</p>
                </div>

                <div className="text-center shrink-0">
                  {/* Digital Stamp Simulation */}
                  <div className="border-2 border-dashed border-accent-600/40 rounded-xl px-4 py-2 mb-2 bg-accent-50/50">
                    <span className="text-[9px] font-black text-accent-700 tracking-wider uppercase block">
                      MS Mobiles India Pvt Ltd
                    </span>
                    <span className="text-[8px] text-emerald-600 font-bold block">
                      ★ Verified Digitally Signed ★
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-800 block">
                    Authorized Signatory
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Close */}
          <div className="px-6 py-3.5 border-t border-dark-800 bg-dark-850/60 flex items-center justify-between text-xs print:hidden">
            <span className="text-neutral-500 text-[11px]">
              MS Mobiles Automated Billing & Tax Registry
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-neutral-300 hover:text-white transition-colors text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaxInvoiceModal;
