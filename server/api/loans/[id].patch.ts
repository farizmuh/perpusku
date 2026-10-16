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

    const body = await readBody(event)
    const { action, additionalDays = 7 } = body

    const loan = await prisma.loanRequest.findUnique({
      where: { id },
      include: { book: true }
    })

    if (!loan) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Data peminjaman tidak ditemukan'
      })
    }

    if (action === 'return') {
      if (loan.status === 'RETURNED') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Buku ini sudah tercatat telah dikembalikan sebelumnya.'
        })
      }

      // Mark as returned & increment book available count
      const updated = await prisma.$transaction(async (tx) => {
        const res = await tx.loanRequest.update({
          where: { id },
          data: {
            status: 'RETURNED'
          },
          include: { book: true }
        })

        // Ensure available doesn't exceed stock
        if (loan.book && loan.book.available < loan.book.stock) {
          await tx.book.update({
            where: { id: loan.bookId },
            data: {
              available: { increment: 1 }
            }
          })
        }

        return res
      })

      // Also update books.json repository to keep file cache in sync
      if (loan.book) {
        try {
          await updateBook(loan.bookId, {
            available: Math.min(loan.book.stock, loan.book.available + 1)
          })
        } catch {}
      }

      return {
        success: true,
        message: `Buku "${loan.book?.title || 'Buku'}" berhasil ditandai telah dikembalikan.`,
        data: updated
      }
    } else if (action === 'extend') {
      if (loan.status === 'RETURNED') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Tidak dapat memperpanjang buku yang sudah dikembalikan.'
        })
      }

      const currentDue = new Date(loan.dueDate)
      currentDue.setDate(currentDue.getDate() + Number(additionalDays))

      const updated = await prisma.loanRequest.update({
        where: { id },
        data: {
          dueDate: currentDue
        },
        include: { book: true }
      })

      return {
        success: true,
        message: `Tenggat waktu peminjaman berhasil diperpanjang hingga ${currentDue.toLocaleDateString('id-ID')}.`,
        data: updated
      }
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'Aksi tidak valid. Pilihan aksi: return atau extend.'
      })
    }
  } catch (error: any) {
    console.error('Error updating loan:', error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Gagal memperbarui status peminjaman'
    })
  }
})
