import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { bookId, borrowerName, borrowerNim, borrowerEmail, durationDays = 7, notes } = body

    if (!bookId || !borrowerName || !borrowerNim) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Harap lengkapi Nama Peminjam, NIM, dan Buku yang dipilih.'
      })
    }

    const book = await prisma.book.findUnique({
      where: { id: Number(bookId) }
    })

    if (!book) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Buku tidak ditemukan dalam katalog perpustakaan.'
      })
    }

    if (book.available <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Maaf, semua eksemplar buku ini sedang dipinjam.'
      })
    }

    const borrowDate = new Date()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + Number(durationDays))

    // Create loan request & decrement available copies
    const loan = await prisma.$transaction(async (tx) => {
      const createdLoan = await tx.loanRequest.create({
        data: {
          bookId: book.id,
          borrowerName,
          borrowerNim,
          borrowerEmail: borrowerEmail || null,
          borrowDate,
          dueDate,
          notes: notes || null,
          status: 'PENDING'
        }
      })

      await tx.book.update({
        where: { id: book.id },
        data: {
          available: { decrement: 1 }
        }
      })

      return createdLoan
    })

    return {
      success: true,
      message: `Peminjaman buku "${book.title}" berhasil diajukan! Harap ambil fisik buku di sirkulasi sebelum ${dueDate.toLocaleDateString('id-ID')}.`,
      data: loan
    }
  } catch (error: any) {
    console.error('Error submitting loan request:', error.message)
    return {
      success: false,
      message: error.statusMessage || error.message || 'Gagal mengajukan peminjaman.'
    }
  }
})
