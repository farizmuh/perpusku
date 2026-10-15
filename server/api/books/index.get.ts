import prisma from '../../utils/prisma'
import { initialBooks } from '../../utils/seedData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = typeof query.q === 'string' ? query.q.trim().toLowerCase() : ''
  const scope = typeof query.scope === 'string' ? query.scope : 'all' // all, title, author, isbn
  const discipline = typeof query.discipline === 'string' ? query.discipline : ''
  const categorySlug = typeof query.category === 'string' ? query.category : ''
  const featured = query.featured === 'true'
  const literature = query.literature === 'true'
  const sort = typeof query.sort === 'string' ? query.sort : 'popular' // popular, newest, rating, title

  try {
    const whereClause: any = {}

    if (search) {
      if (scope === 'title') {
        whereClause.title = { contains: search }
      } else if (scope === 'author') {
        whereClause.author = { contains: search }
      } else if (scope === 'isbn') {
        whereClause.isbn = { contains: search }
      } else {
        whereClause.OR = [
          { title: { contains: search } },
          { author: { contains: search } },
          { isbn: { contains: search } },
          { synopsis: { contains: search } }
        ]
      }
    }

    if (discipline && discipline !== 'Semua') {
      whereClause.discipline = discipline
    }

    if (categorySlug && categorySlug !== 'semua') {
      whereClause.category = { slug: categorySlug }
    }

    if (featured) {
      whereClause.isFeatured = true
    }

    if (literature) {
      whereClause.isLiterature = true
    }

    let orderBy: any = { rating: 'desc' }
    if (sort === 'newest') {
      orderBy = { year: 'desc' }
    } else if (sort === 'title') {
      orderBy = { title: 'asc' }
    } else if (sort === 'popular') {
      orderBy = { reviewsCount: 'desc' }
    }

    const books = await prisma.book.findMany({
      where: whereClause,
      include: {
        category: true
      },
      orderBy
    })

    if (books.length > 0) {
      return {
        success: true,
        source: 'database',
        total: books.length,
        data: books
      }
    }
  } catch (error: any) {
    console.warn('Prisma query warning (fallback to embedded catalog):', error.message)
  }

  // Graceful fallback to initialBooks
  let filtered = [...initialBooks]

  if (search) {
    filtered = filtered.filter((b) => {
      if (scope === 'title') return b.title.toLowerCase().includes(search)
      if (scope === 'author') return b.author.toLowerCase().includes(search)
      if (scope === 'isbn') return b.isbn.toLowerCase().includes(search)
      return (
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search) ||
        b.isbn.toLowerCase().includes(search) ||
        b.synopsis.toLowerCase().includes(search)
      )
    })
  }

  if (discipline && discipline !== 'Semua') {
    filtered = filtered.filter((b) => b.discipline === discipline)
  }

  if (categorySlug && categorySlug !== 'semua') {
    filtered = filtered.filter((b) => b.category?.slug === categorySlug)
  }

  if (featured) {
    filtered = filtered.filter((b) => b.isFeatured)
  }

  if (literature) {
    filtered = filtered.filter((b) => b.isLiterature)
  }

  if (sort === 'newest') {
    filtered.sort((a, b) => b.year - a.year)
  } else if (sort === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating)
  } else {
    filtered.sort((a, b) => b.reviewsCount - a.reviewsCount)
  }

  return {
    success: true,
    source: 'seed-catalog',
    total: filtered.length,
    data: filtered
  }
})
