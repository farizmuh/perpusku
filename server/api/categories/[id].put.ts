import { updateCategory } from '../../utils/categoriesRepository'

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
    const body = await readBody(event)
    const updated = await updateCategory(id, body)
    if (!updated) {
      return createError({
        statusCode: 404,
        statusMessage: 'Genre tidak ditemukan'
      })
    }

    return {
      success: true,
      message: 'Genre berhasil diperbarui',
      data: updated
    }
  } catch (err: any) {
    return createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal memperbarui genre'
    })
  }
})
