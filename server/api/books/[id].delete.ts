import { deleteBook } from '../../utils/booksRepository'

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
    const success = await deleteBook(id)
    if (!success) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Buku tidak ditemukan atau telah dihapus'
      })
    }

    return {
      success: true,
      message: 'Buku berhasil dihapus dari katalog'
    }
  } catch (err: any) {
    if (err.statusCode) {
      throw err
    }
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal menghapus buku'
    })
  }
})
