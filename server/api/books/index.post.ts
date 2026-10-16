import { createBook } from '../../utils/booksRepository'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    if (!body || !body.title?.trim() || !body.author?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Judul buku dan nama pengarang wajib diisi.'
      })
    }

    const newBook = await createBook(body)
    return {
      success: true,
      message: 'Buku berhasil ditambahkan ke katalog',
      data: newBook
    }
  } catch (err: any) {
    if (err.statusCode) {
      throw err
    }
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal menambahkan buku baru'
    })
  }
})
