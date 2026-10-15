import { getAllBooks } from '../../utils/booksRepository'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = typeof query.q === 'string' ? query.q.trim() : ''
  const scope = typeof query.scope === 'string' ? query.scope : 'all'
  const discipline = typeof query.discipline === 'string' ? query.discipline : ''
  const category = typeof query.category === 'string' ? query.category : ''
  const featured = query.featured === 'true'
  const literature = query.literature === 'true'
  const sort = typeof query.sort === 'string' ? query.sort : 'popular'

  try {
    const books = await getAllBooks({
      search,
      scope,
      discipline,
      category,
      featured,
      literature,
      sort
    })

    return {
      success: true,
      total: books.length,
      data: books
    }
  } catch (err: any) {
    return createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal memuat katalog buku'
    })
  }
})
