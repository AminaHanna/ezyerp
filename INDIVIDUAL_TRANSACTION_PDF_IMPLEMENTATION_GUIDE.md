# Individual Transaction/Bill PDF Export - Implementation Guide

## 📋 Overview

This guide outlines how to implement PDF export for individual transactions/bills across different pages in the EzyERP application.

---

## 🔍 Pages Requiring Transaction PDF Export

Based on the codebase analysis, the following pages likely need individual transaction PDF export:

### 1. **Sales Page** (`src/pages/Sales.tsx` - if exists)
**Transaction Type**: Sales Invoices
**Fields to Include**:
- Invoice number
- Date
- Customer name
- Line items (product, quantity, rate, amount)
- Subtotal, tax, total
- Payment terms

### 2. **Receipts Page** (`src/pages/Receipts.tsx`)
**Transaction Type**: Receipt Vouchers
**Fields to Include**:
- Receipt number
- Date
- Customer/Payer name
- Amount received
- Payment method
- Reference number
- Remarks

### 3. **Other Potential Pages**
- Purchase Orders
- Payment Vouchers
- Delivery Notes
- Credit Notes
- Debit Notes

---

## 🛠️ Implementation Steps

### Step 1: Identify Transaction Data Structure

For each page, identify:
1. **Transaction ID field** (invoice_no, receipt_no, etc.)
2. **Date field** (date, created_date, etc.)
3. **Customer/Vendor field** (customer_name, vendor_name, etc.)
4. **Amount fields** (total, subtotal, tax, etc.)
5. **Line items** (if applicable)
6. **Additional fields** (payment method, reference, remarks, etc.)

### Step 2: Create Transaction-Specific PDF Generator

Add to `src/utils/pdfGenerator.ts`:

```typescript
/**
 * Generate Sales Invoice PDF
 */
export const generateSalesInvoicePDF = (
  invoiceData: any,
  lineItems: any[],
  fileName: string
) => {
  const doc = generatePDF({
    title: "Sales Invoice",
    subtitle: `Invoice #${invoiceData.invoiceNumber}`,
    fileName,
  });

  // Add invoice details
  // Add line items table
  // Add totals
  // Add terms and conditions

  return doc;
};

/**
 * Generate Receipt Voucher PDF
 */
export const generateReceiptVoucherPDF = (
  receiptData: any,
  fileName: string
) => {
  const doc = generatePDF({
    title: "Receipt Voucher",
    subtitle: `Receipt #${receiptData.receiptNumber}`,
    fileName,
  });

  // Add receipt details
  // Add payment details
  // Add signature area

  return doc;
};
```

### Step 3: Add PDF Export Button to Component

```typescript
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateSalesInvoicePDF, downloadPDF } from "@/utils/pdfGenerator";

const SalesPage = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleExportPDF = async (transaction: any) => {
    try {
      setIsGeneratingPDF(true);
      const fileName = `Invoice_${transaction.invoiceNumber}_${new Date().toISOString().split("T")[0]}.pdf`;
      const doc = generateSalesInvoicePDF(transaction, transaction.lineItems, fileName);
      downloadPDF(doc, fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div>
      {/* Transaction list */}
      {transactions.map((transaction) => (
        <div key={transaction.id}>
          {/* Transaction details */}
          <Button
            onClick={() => handleExportPDF(transaction)}
            disabled={isGeneratingPDF}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      ))}
    </div>
  );
};
```

### Step 4: Add PDF Functions to Utility Module

For each transaction type, add a generator function:

```typescript
// Sales Invoice
export const generateSalesInvoicePDF = (invoiceData, lineItems, fileName) => {
  // Implementation
};

// Receipt Voucher
export const generateReceiptVoucherPDF = (receiptData, fileName) => {
  // Implementation
};

// Payment Voucher
export const generatePaymentVoucherPDF = (paymentData, fileName) => {
  // Implementation
};

// Delivery Note
export const generateDeliveryNotePDF = (deliveryData, lineItems, fileName) => {
  // Implementation
};
```

---

## 📊 PDF Content Structure

### Sales Invoice
```
┌─────────────────────────────────┐
│  Company Name & Address         │
│  SALES INVOICE                  │
│  Invoice #INV001                │
├─────────────────────────────────┤
│ Invoice Date: 2025-04-15        │
│ Customer: ABC Company           │
│ Address: ...                    │
├─────────────────────────────────┤
│ Item | Qty | Rate | Amount      │
├─────────────────────────────────┤
│ Product A | 10 | 100 | 1000     │
│ Product B | 5  | 200 | 1000     │
├─────────────────────────────────┤
│ Subtotal: ₹ 2000                │
│ Tax (18%): ₹ 360                │
│ Total: ₹ 2360                   │
├─────────────────────────────────┤
│ Terms & Conditions              │
│ Payment Due: 2025-05-15         │
└─────────────────────────────────┘
```

### Receipt Voucher
```
┌─────────────────────────────────┐
│  Company Name & Address         │
│  RECEIPT VOUCHER                │
│  Receipt #RCP001                │
├─────────────────────────────────┤
│ Receipt Date: 2025-04-15        │
│ Received From: ABC Company      │
│ Amount: ₹ 5000                  │
│ Payment Method: Cheque          │
│ Cheque #: CHQ123                │
│ Remarks: Payment for Invoice... │
├─────────────────────────────────┤
│ Authorized By: ___________      │
│ Date: ___________               │
└─────────────────────────────────┘
```

---

## 🔗 API Integration

For each transaction type, identify the API endpoint:

```typescript
// Example: Get sales invoice details
async getSalesInvoice(invoiceId: string) {
  return apiClient.post("salesinvoice.php", {
    invoiceid: invoiceId,
    officecode: this.officecode,
    officeid: this.officeid,
  });
}

// Example: Get receipt details
async getReceipt(receiptId: string) {
  return apiClient.post("receipt.php", {
    receiptid: receiptId,
    officecode: this.officecode,
    officeid: this.officeid,
  });
}
```

---

## 🎨 Styling Guidelines

### Consistent Elements
- Company logo/name in header
- Report title and transaction number
- Date and customer information
- Professional table formatting
- Summary section with totals
- Footer with page numbers and date

### Color Scheme
- Headers: Blue (#2980B9)
- Text: Black (#000000)
- Borders: Light gray (#C8C8C8)
- Alternating rows: Light gray (#F5F5F5)

### Fonts
- Title: Bold, 14pt
- Headers: Bold, 11pt
- Body: Regular, 10pt
- Footer: Regular, 9pt

---

## 📋 Implementation Checklist

### For Each Transaction Type:
- [ ] Identify API endpoint
- [ ] Identify data structure
- [ ] Create PDF generator function
- [ ] Add PDF export button to component
- [ ] Test PDF generation
- [ ] Test PDF download
- [ ] Verify formatting
- [ ] Test with multiple records
- [ ] Test error handling

---

## 🧪 Testing Approach

### Unit Testing
```typescript
describe("PDF Generation", () => {
  it("should generate sales invoice PDF", () => {
    const invoice = { invoiceNumber: "INV001", ... };
    const doc = generateSalesInvoicePDF(invoice, [], "test.pdf");
    expect(doc).toBeDefined();
  });
});
```

### Integration Testing
1. Navigate to transaction page
2. Click "Export PDF" button
3. Verify PDF downloads
4. Open PDF and verify content
5. Check formatting and layout

### User Acceptance Testing
1. Test with real data
2. Verify all fields display correctly
3. Check PDF quality
4. Verify file naming
5. Test on different browsers

---

## 🚀 Priority Order

### Phase 1 (High Priority)
1. Sales Invoices
2. Receipt Vouchers

### Phase 2 (Medium Priority)
1. Payment Vouchers
2. Delivery Notes

### Phase 3 (Low Priority)
1. Credit Notes
2. Debit Notes
3. Purchase Orders

---

## 📝 Notes

- Use consistent file naming: `{TransactionType}_{TransactionID}_{Date}.pdf`
- Always include error handling
- Show loading indicators during PDF generation
- Disable buttons when no data available
- Test with various data sizes
- Consider page breaks for large reports
- Add watermarks if needed (e.g., "DRAFT", "COPY")

---

## 🔗 Related Files

- `src/utils/pdfGenerator.ts` - PDF generation utilities
- `src/pages/CreditAging.tsx` - Example implementation
- `src/pages/CustomerStatement.tsx` - Example implementation
- `src/services/ezyerpService.ts` - API service methods

---

**Status**: 📋 **READY FOR IMPLEMENTATION**
**Last Updated**: 2025-10-23

