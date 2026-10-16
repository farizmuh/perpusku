import prisma from '../../utils/prisma'
import { updateBook } from '../../utils/booksRepository'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      bookId,
      borrowerName,
      borrowerNim,
      borrowerEmail,
      borrowDate,
      dueDate,
      durationDays = 7,
      notes
    } = body

    if (!bookId || !borrowerName || !borrowerNim) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Buku, Nama Pemustaka, dan NIM wajib diisi.'
      })
    }

    const parsedBookId = Number(bookId)
    const book = await prisma.book.findUnique({
      where: { id: parsedBookId }
    })

    if (!book) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Buku tidak ditemukan dalam katalog.'
      })
    }

    if (book.available <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Semua eksemplar buku ini sedang dipinjam (stok tersedia: 0).'
      })
    }

    const parsedBorrowDate = borrowDate ? new Date(borrowDate) : new Date()
    let parsedDueDate: Date
    if (dueDate) {
      parsedDueDate = new Date(dueDate)
    } else {
      parsedDueDate = new Date(parsedBorrowDate)
      parsedDueDate.setDate(parsedDueDate.getDate() + Number(durationDays))
    }

    // Atomic transaction: create loan record & decrement book available count
    const loan = await prisma.$transaction(async (tx) => {
      const created = await tx.loanRequest.create({
        data: {
          bookId: book.id,
          borrowerName: borrowerName.trim(),
          borrowerNim: borrowerNim.trim(),
          borrowerEmail: borrowerEmail?.trim() || null,
          borrowDate: parsedBorrowDate,
          dueDate: parsedDueDate,
          status: 'BORROWED',
          notes: notes?.trim() || null
        },
        include: {
          book: true
        }
      })

      await tx.book.update({
        where: { id: book.id },
        data: {
          available: { decrement: 1 }
        }
      })

      return created
    })

    // Also update books.json repository to keep file cache in sync
    try {
      await updateBook(book.id, { available: Math.max(0, book.available - 1) })
    } catch {}

    return {
      success: true,
      message: `Peminjaman buku "${book.title}" untuk ${borrowerName} berhasil dicatat.`,
      data: loan
    }
  } catch (error: any) {
    console.error('Error creating manual loan:', error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Gagal mencatat peminjaman buku'
    })
  }
})
