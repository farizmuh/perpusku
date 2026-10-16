import { updateBook } from '../../utils/booksRepository'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)
  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID buku tidak valid'
    })
  }

  try {
    const body = await readBody(event)
    const updated = await updateBook(id, body)
    if (!updated) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Buku tidak ditemukan'
      })
    }

    return {
      success: true,
      message: 'Data buku berhasil diperbarui',
      data: updated
    }
  } catch (err: any) {
    if (err.statusCode) {
      throw err
    }
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal memperbarui data buku'
    })
  }
})
