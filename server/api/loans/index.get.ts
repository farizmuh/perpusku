import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const loans = await prisma.loanRequest.findMany({
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            callNumber: true,
            shelfLocation: true,
            coverUrl: true,
            available: true,
            stock: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      data: loans
    }
  } catch (error: any) {
    console.error('Error fetching loans:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal memuat data peminjaman'
    })
  }
})
