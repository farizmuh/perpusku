import { getAllCategories } from '../../utils/categoriesRepository'
import { getRawBooks } from '../../utils/booksRepository'

export default defineEventHandler(async () => {
  try {
    const [categories, books] = await Promise.all([
      getAllCategories(),
      getRawBooks()
    ])

    const data = categories.map((c) => {
      const count = books.filter((b) => b.categoryId === c.id || b.category?.slug === c.slug).length
      return {
        ...c,
        bookCount: count
      }
    })

    return {
      success: true,
      total: data.length,
      data
    }
  } catch (err: any) {
    return createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal memuat kategori genre'
    })
  }
})
