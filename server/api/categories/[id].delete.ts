import { deleteCategory } from '../../utils/categoriesRepository'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)
  if (!id || isNaN(id)) {
    return createError({
      statusCode: 400,
      statusMessage: 'ID genre tidak valid'
    })
  }

  try {
    const success = await deleteCategory(id)
    if (!success) {
      return createError({
        statusCode: 404,
        statusMessage: 'Genre tidak ditemukan atau telah dihapus'
      })
    }

    return {
      success: true,
      message: 'Genre berhasil dihapus'
    }
  } catch (err: any) {
    return createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal menghapus genre'
    })
  }
})
