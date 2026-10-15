import prisma from '../../utils/prisma'
import { initialCategories } from '../../utils/seedData'

export default defineEventHandler(async () => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { books: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    if (categories.length > 0) {
      return {
        success: true,
        source: 'database',
        data: categories
      }
    }
  } catch (error: any) {
    console.warn('Prisma categories query fallback:', error.message)
  }

  return {
    success: true,
    source: 'seed-catalog',
    data: initialCategories
  }
})
