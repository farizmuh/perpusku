import { getAllCategories } from '../../utils/categoriesRepository'

export default defineEventHandler(async () => {
  try {
    const categories = await getAllCategories()
    return {
      success: true,
      total: categories.length,
      data: categories
    }
  } catch (err: any) {
    return createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal memuat kategori genre'
    })
  }
})
