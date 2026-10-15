import { createCategory } from '../../utils/categoriesRepository'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    if (!body || !body.name) {
      return createError({
        statusCode: 400,
        statusMessage: 'Nama rumpun/genre wajib diisi.'
      })
    }

    const newCategory = await createCategory(body)
    return {
      success: true,
      message: 'Genre baru berhasil ditambahkan',
      data: newCategory
    }
  } catch (err: any) {
    return createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal menambahkan genre baru'
    })
  }
})
