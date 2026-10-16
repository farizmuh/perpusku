import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface LoanExportOptions {
  startDate?: string
  endDate?: string
  statusFilter?: string
  statusLabel?: string
}

const formatDate = (dateStr: string | Date | undefined): string => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export const exportLoansToExcel = (loans: any[], options: LoanExportOptions = {}) => {
  if (!loans || loans.length === 0) {
    alert('Tidak ada data peminjaman untuk diekspor pada rentang tanggal yang dipilih.')
    return
  }

  const rows = loans.map((loan, idx) => {
    const isOverdue = loan.status !== 'RETURNED' && new Date(loan.dueDate) < new Date()
    const statusText = loan.status === 'RETURNED' ? 'DIKEMBALIKAN' : (isOverdue ? 'TERLAMBAT' : 'DIPINJAM')

    return {
      'No': idx + 1,
      'Tanggal Pinjam': formatDate(loan.borrowDate),
      'Batas Tenggat': formatDate(loan.dueDate),
      'Nama Pemustaka': loan.borrowerName || '-',
      'NIM': loan.borrowerNim || '-',
      'Kontak / Email': loan.borrowerEmail || '-',
      'Judul Buku': loan.book?.title || '-',
      'Pengarang': loan.book?.author || '-',
      'No. Panggil / ISBN': `${loan.book?.callNumber || '-'} / ${loan.book?.isbn || '-'}`,
      'Status': statusText,
      'Catatan': loan.notes || '-'
    }
  })

  const ws = XLSX.utils.json_to_sheet(rows)

  // Configure column widths
  ws['!cols'] = [
    { wch: 6 },  // No
    { wch: 16 }, // Tanggal Pinjam
    { wch: 16 }, // Batas Tenggat
    { wch: 25 }, // Nama Pemustaka
    { wch: 16 }, // NIM
    { wch: 24 }, // Kontak
    { wch: 36 }, // Judul Buku
    { wch: 22 }, // Pengarang
    { wch: 26 }, // No. Panggil / ISBN
    { wch: 16 }, // Status
    { wch: 28 }  // Catatan
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data Peminjaman')

  const startFormatted = options.startDate ? options.startDate.replace(/[^0-9]/g, '') : 'awal'
  const endFormatted = options.endDate ? options.endDate.replace(/[^0-9]/g, '') : 'akhir'
  const filename = `Laporan_Peminjaman_${startFormatted}_sd_${endFormatted}.xlsx`

  XLSX.writeFile(wb, filename)
}

export const exportLoansToPdf = (loans: any[], options: LoanExportOptions = {}) => {
  if (!loans || loans.length === 0) {
    alert('Tidak ada data peminjaman untuk diekspor pada rentang tanggal yang dipilih.')
    return
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Title Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(0, 35, 111) // Primary dark blue
  doc.text('LAPORAN SIRKULASI PEMINJAMAN BUKU', 14, 15)

  // Metadata Sub-header
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(70, 70, 70)

  const periodeStr = options.startDate && options.endDate
    ? `${formatDate(options.startDate)} s/d ${formatDate(options.endDate)}`
    : 'Semua Periode'
  const statusStr = options.statusLabel || 'Semua Status'
  const printTimeStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  doc.text(`Periode Laporan: ${periodeStr}   |   Status: ${statusStr}`, 14, 21)
  doc.text(`Tanggal Cetak: ${printTimeStr}   |   Total Data: ${loans.length} Catatan`, 14, 26)

  // Divider Line
  doc.setDrawColor(220, 225, 230)
  doc.setLineWidth(0.4)
  doc.line(14, 29, 283, 29)

  // Prepare table headers and body
  const headers = [[
    'No',
    'Tgl Pinjam',
    'Tenggat',
    'Nama Pemustaka',
    'NIM',
    'Judul Buku',
    'No. Panggil',
    'Status',
    'Catatan'
  ]]

  const body = loans.map((loan, idx) => {
    const isOverdue = loan.status !== 'RETURNED' && new Date(loan.dueDate) < new Date()
    const statusText = loan.status === 'RETURNED' ? 'DIKEMBALIKAN' : (isOverdue ? 'TERLAMBAT' : 'DIPINJAM')

    return [
      idx + 1,
      formatDate(loan.borrowDate),
      formatDate(loan.dueDate),
      loan.borrowerName || '-',
      loan.borrowerNim || '-',
      loan.book?.title || '-',
      loan.book?.callNumber || '-',
      statusText,
      loan.notes || '-'
    ]
  })

  autoTable(doc, {
    startY: 32,
    head: headers,
    body: body,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [0, 35, 111],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 22 },
      2: { halign: 'center', cellWidth: 22 },
      3: { cellWidth: 35 },
      4: { halign: 'center', cellWidth: 24 },
      5: { cellWidth: 60 },
      6: { halign: 'center', cellWidth: 26 },
      7: { halign: 'center', cellWidth: 24 },
      8: { cellWidth: 46 }
    },
    didParseCell: (data) => {
      // Highlight status badge colors
      if (data.section === 'body' && data.column.index === 7) {
        const text = String(data.cell.raw)
        if (text === 'TERLAMBAT') {
          data.cell.styles.textColor = [185, 28, 28] // Red
          data.cell.styles.fontStyle = 'bold'
        } else if (text === 'DIKEMBALIKAN') {
          data.cell.styles.textColor = [4, 120, 87] // Green
        } else {
          data.cell.styles.textColor = [30, 64, 175] // Blue
        }
      }
    }
  })

  const startFormatted = options.startDate ? options.startDate.replace(/[^0-9]/g, '') : 'awal'
  const endFormatted = options.endDate ? options.endDate.replace(/[^0-9]/g, '') : 'akhir'
  const filename = `Laporan_Peminjaman_${startFormatted}_sd_${endFormatted}.pdf`

  doc.save(filename)
}
