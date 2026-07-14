import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type Column = {
  key: string;
  label: string;
};

type Row = Record<string, string | number | boolean | null | undefined>;

/**
 * Convert an array of objects into a flat array of string values for export.
 */
function flattenRows<T extends Record<string, any>>(
  data: T[],
  columns: Column[],
  formatters?: Record<string, (val: any, row: T) => string>
): Row[] {
  return data.map((item) => {
    const row: Row = {};
    for (const col of columns) {
      const raw = col.key.split('.').reduce((obj, key) => obj?.[key], item) as any;
      row[col.label] = formatters?.[col.key]
        ? formatters[col.key](raw, item)
        : raw ?? '';
    }
    return row;
  });
}

// ======================== EXCEL ========================

export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  columns: Column[],
  filename: string,
  formatters?: Record<string, (val: any, row: T) => string>
): void {
  const rows = flattenRows(data, columns, formatters);
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-fit column widths
  const colWidths = columns.map((col) => {
    const maxLen = Math.max(
      col.label.length,
      ...data.map((item) => {
        const raw = col.key.split('.').reduce((obj, key) => obj?.[key], item);
        const formatted = formatters?.[col.key] ? formatters[col.key](raw, item) : (raw ?? '');
        return String(formatted).length;
      })
    );
    return { wch: Math.min(maxLen + 3, 50) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// ======================== PDF ========================

export function exportToPdf<T extends Record<string, any>>(
  data: T[],
  columns: Column[],
  title: string,
  filename: string,
  formatters?: Record<string, (val: any, row: T) => string>
): void {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(14);
  doc.text(title, pageWidth / 2, 20, { align: 'center' });

  // Sub-header line
  doc.setFontSize(8);
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 27, { align: 'center' });

  // Table
  const pdfColumns = columns.map((c) => ({ header: c.label, dataKey: c.label }));
  const pdfRows = flattenRows(data, columns, formatters);

  (doc as any).autoTable({
    columns: pdfColumns,
    body: pdfRows,
    startY: 32,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 245, 250] },
    margin: { top: 32, bottom: 15 },
    didDrawPage: (data: any) => {
      // Footer
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(7);
      doc.text(
        `Halaman ${data.pageNumber} dari ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    },
  });

  doc.save(`${filename}.pdf`);
}
