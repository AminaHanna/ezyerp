import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PDFOptions {
  title?: string;
  subtitle?: string;
  companyName?: string;
  companyAddress?: string;
  fileName?: string;
  pageSize?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
}

interface TableColumn {
  header: string;
  dataKey: string;
  width?: number;
  align?: "left" | "center" | "right";
  format?: (value: any) => string;
}

/**
 * Generate a professional PDF with header and footer
 */
export const generatePDF = (options: PDFOptions = {}) => {
  const {
    title = "Report",
    subtitle = "",
    companyName = "EzyERP",
    companyAddress = "",
    pageSize = "a4",
    orientation = "portrait",
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: pageSize,
  });

  // Add header
  addHeader(doc, companyName, companyAddress, title, subtitle);

  return doc;
};

/**
 * Add header to PDF
 */
const addHeader = (
  doc: jsPDF,
  companyName: string,
  companyAddress: string,
  title: string,
  subtitle: string
) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Company name
  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text(companyName, pageWidth / 2, 15, { align: "center" });

  // Company address
  if (companyAddress) {
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(companyAddress, pageWidth / 2, 22, { align: "center" });
  }

  // Title
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(title, pageWidth / 2, 32, { align: "center" });

  // Subtitle
  if (subtitle) {
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text(subtitle, pageWidth / 2, 39, { align: "center" });
  }

  // Horizontal line
  doc.setDrawColor(0, 0, 0);
  doc.line(10, 42, pageWidth - 10, 42);
};

/**
 * Add table to PDF
 */
export const addTableToPDF = (
  doc: jsPDF,
  columns: TableColumn[],
  data: any[],
  startY: number = 50
) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Format data for autoTable
  const formattedData = data.map((row) =>
    columns.map((col) => {
      const value = row[col.dataKey];
      return col.format ? col.format(value) : value;
    })
  );

  autoTable(doc, {
    head: [columns.map((col) => col.header)],
    body: formattedData,
    startY,
    margin: { left: 10, right: 10 },
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
      lineColor: [0, 0, 0],
    },
    bodyStyles: {
      textColor: [0, 0, 0],
      lineColor: [200, 200, 200],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: columns.reduce(
      (acc, col, idx) => {
        acc[idx] = {
          halign: col.align || "left",
          cellWidth: col.width,
        };
        return acc;
      },
      {} as Record<number, any>
    ),
    didDrawPage: (data) => {
      addFooter(doc, data.pageNumber);
    },
  });

  return doc;
};

/**
 * Add summary section to PDF
 */
export const addSummaryToPDF = (
  doc: jsPDF,
  summaryData: Record<string, string | number>,
  startY: number
) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = startY + 10;

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Summary", 10, currentY);

  currentY += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");

  Object.entries(summaryData).forEach(([key, value]) => {
    doc.text(`${key}: ₹ ${formatCurrency(value)}`, 10, currentY);
    currentY += 6;
  });

  return doc;
};

/**
 * Add footer to PDF
 */
const addFooter = (doc: jsPDF, pageNumber: number) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Page number
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.text(
    `Page ${pageNumber}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Date
  const date = new Date().toLocaleDateString("en-IN");
  doc.text(`Generated on: ${date}`, 10, pageHeight - 10);
};

/**
 * Download PDF
 */
export const downloadPDF = (doc: jsPDF, fileName: string) => {
  doc.save(fileName);
};

/**
 * Format currency
 */
export const formatCurrency = (value: any): string => {
  const num = Number(value) || 0;
  return num.toFixed(2);
};

/**
 * Format date
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

/**
 * Generate Customer Statement PDF
 */
export const generateCustomerStatementPDF = (
  customerName: string,
  dateRange: string,
  transactions: any[],
  summary: Record<string, number>,
  fileName: string
) => {
  const doc = generatePDF({
    title: "Customer Statement",
    subtitle: dateRange,
    fileName,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 50;

  // Customer info
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text(`Customer: ${customerName}`, 10, currentY);
  currentY += 8;

  // Transaction table
  const columns: TableColumn[] = [
    { header: "Transaction ID", dataKey: "id", width: 30 },
    { header: "Date", dataKey: "date", width: 25, format: formatDate },
    { header: "Type", dataKey: "type", width: 30 },
    {
      header: "Debit (₹)",
      dataKey: "debit",
      width: 25,
      align: "right",
      format: formatCurrency,
    },
    {
      header: "Credit (₹)",
      dataKey: "credit",
      width: 25,
      align: "right",
      format: formatCurrency,
    },
    {
      header: "Balance (₹)",
      dataKey: "balance",
      width: 25,
      align: "right",
      format: formatCurrency,
    },
  ];

  addTableToPDF(doc, columns, transactions, currentY);

  // Add summary
  const finalY = (doc as any).lastAutoTable.finalY || currentY + 50;
  addSummaryToPDF(doc, summary, finalY);

  return doc;
};

/**
 * Generate Credit Aging Report PDF
 */
export const generateCreditAgingPDF = (
  customerName: string,
  dateRange: string,
  agingData: any[],
  summary: Record<string, number>,
  fileName: string
) => {
  const doc = generatePDF({
    title: "Credit Aging Report",
    subtitle: dateRange,
    fileName,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 50;

  // Customer info
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text(`Customer: ${customerName}`, 10, currentY);
  currentY += 8;

  // Aging table
  const columns: TableColumn[] = [
    { header: "Invoice Number", dataKey: "invoiceNumber", width: 35 },
    { header: "Date", dataKey: "date", width: 25, format: formatDate },
    {
      header: "Total (₹)",
      dataKey: "total",
      width: 25,
      align: "right",
      format: formatCurrency,
    },
    {
      header: "Balance (₹)",
      dataKey: "balance",
      width: 25,
      align: "right",
      format: formatCurrency,
    },
    { header: "Days Overdue", dataKey: "daysOverdue", width: 20, align: "center" },
  ];

  addTableToPDF(doc, columns, agingData, currentY);

  // Add summary
  const finalY = (doc as any).lastAutoTable.finalY || currentY + 50;
  addSummaryToPDF(doc, summary, finalY);

  return doc;
};

/**
 * Generate Individual Transaction PDF
 */
export const generateTransactionPDF = (
  transactionId: string,
  customerName: string,
  transaction: any,
  fileName: string
) => {
  const doc = generatePDF({
    title: "Transaction Details",
    subtitle: `Transaction #${transactionId}`,
    fileName,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 50;

  // Customer info
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text(`Customer: ${customerName}`, 10, currentY);
  currentY += 8;

  // Transaction details section
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");

  const details = [
    { label: "Transaction ID", value: transaction.id || transactionId },
    { label: "Date", value: formatDate(transaction.date) },
    { label: "Type", value: transaction.type },
    { label: "Debit Amount", value: `₹ ${formatCurrency(transaction.debit)}` },
    { label: "Credit Amount", value: `₹ ${formatCurrency(transaction.credit)}` },
    { label: "Balance", value: `₹ ${formatCurrency(transaction.balance)}` },
  ];

  // Draw details as key-value pairs
  details.forEach((detail) => {
    doc.setFont(undefined, "bold");
    doc.text(`${detail.label}:`, 10, currentY);
    doc.setFont(undefined, "normal");
    doc.text(detail.value, 80, currentY);
    currentY += 8;
  });

  currentY += 5;

  // Add a simple table with just this transaction
  const columns: TableColumn[] = [
    { header: "ID", dataKey: "id", width: 30 },
    { header: "Date", dataKey: "date", width: 30, format: formatDate },
    { header: "Type", dataKey: "type", width: 40 },
    { header: "Debit (₹)", dataKey: "debit", width: 25, align: "right", format: formatCurrency },
    { header: "Credit (₹)", dataKey: "credit", width: 25, align: "right", format: formatCurrency },
    { header: "Balance (₹)", dataKey: "balance", width: 25, align: "right", format: formatCurrency },
  ];

  addTableToPDF(doc, columns, [transaction], currentY);

  return doc;
};

