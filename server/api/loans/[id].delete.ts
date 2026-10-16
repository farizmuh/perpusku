import prisma from '../../utils/prisma'
import { updateBook } from '../../utils/booksRepository'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    if (!id || isNaN(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID peminjaman tidak valid'
      })
    }

    const loan = await prisma.loanRequest.findUnique({
      where: { id },
      include: { book: true }
    })

    if (!loan) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Data peminjaman tidak ditemukan atau telah dihapus'
      })
    }

    await prisma.$transaction(async (tx) => {
      // If loan is active (not returned), restore book available count
      if (loan.status !== 'RETURNED' && loan.book && loan.book.available < loan.book.stock) {
        await tx.book.update({
          where: { id: loan.bookId },
          data: {
            available: { increment: 1 }
          }
        })
      }

      await tx.loanRequest.delete({
        where: { id }
      })
    })

    // Also update books.json repository to keep file cache in sync
    if (loan.status !== 'RETURNED' && loan.book) {
      try {
        await updateBook(loan.bookId, {
          available: Math.min(loan.book.stock, loan.book.available + 1)
        })
      } catch {}
    }

    return {
      success: true,
      message: 'Catatan peminjaman berhasil dihapus/dibatalkan.'
    }
  } catch (error: any) {
    console.error('Error deleting loan:', error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Gagal menghapus catatan peminjaman'
    })
  }
})
