import fs from 'node:fs'
import path from 'node:path'
import prisma from './prisma'
import { initialBooks, SeedBook } from './seedData'
import { getAllCategories } from './categoriesRepository'

export type BookData = SeedBook

const getFilePath = () => {
  const dir = path.resolve(process.cwd(), 'server', 'data')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return path.join(dir, 'books.json')
}

export const getRawBooks = async (): Promise<BookData[]> => {
  const filePath = getFilePath()

  // 1. Coba baca dari file JSON
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    } catch (err) {
      console.warn('Gagal membaca books.json:', err)
    }
  }

  // 2. Coba baca dari database Prisma
  try {
    const dbBooks = await prisma.book.findMany({
      include: { category: true },
      orderBy: { id: 'asc' }
    })
    if (dbBooks && dbBooks.length > 0) {
      const mapped: BookData[] = dbBooks.map((b: any) => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        author: b.author,
        isbn: b.isbn,
        publisher: b.publisher || 'Penerbit Universitas',
        year: b.year,
        pages: b.pages,
        callNumber: b.callNumber,
        shelfLocation: b.shelfLocation,
        coverUrl: b.coverUrl,
        synopsis: b.synopsis,
        stock: b.stock,
        available: b.available,
        rating: b.rating,
        reviewsCount: b.reviewsCount,
        isFeatured: b.isFeatured,
        isLiterature: b.isLiterature,
        discipline: b.discipline,
        categoryId: b.categoryId,
        category: b.category
      }))
      fs.writeFileSync(filePath, JSON.stringify(mapped, null, 2), 'utf-8')
      return mapped
    }
  } catch {
    // DB offline
  }

  // 3. Fallback ke initialBooks
  try {
    fs.writeFileSync(filePath, JSON.stringify(initialBooks, null, 2), 'utf-8')
  } catch {}

  return [...initialBooks]
}

export const getAllBooks = async (filter?: {
  search?: string
  scope?: string
  discipline?: string
  category?: string
  featured?: boolean
  literature?: boolean
  sort?: string
}) => {
  const books = await getRawBooks()
  const categories = await getAllCategories()

  // Pastikan category object tersinkronisasi
  const enriched = books.map((b) => {
    const cat = categories.find((c) => c.id === b.categoryId) || categories.find((c) => c.slug === b.category?.slug)
    return {
      ...b,
      category: cat || b.category
    }
  })

  let filtered = [...enriched]

  if (filter?.search) {
    const q = filter.search.toLowerCase()
    const scope = filter.scope || 'all'
    filtered = filtered.filter((b) => {
      if (scope === 'title') return b.title.toLowerCase().includes(q)
      if (scope === 'author') return b.author.toLowerCase().includes(q)
      if (scope === 'isbn') return b.isbn.toLowerCase().includes(q)
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.synopsis.toLowerCase().includes(q)
      )
    })
  }

  if (filter?.discipline && filter.discipline !== 'Semua') {
    filtered = filtered.filter((b) => b.discipline === filter.discipline)
  }

  if (filter?.category && filter.category !== 'semua') {
    filtered = filtered.filter((b) => b.category?.slug === filter.category)
  }

  if (filter?.featured) {
    filtered = filtered.filter((b) => b.isFeatured)
  }

  if (filter?.literature) {
    filtered = filtered.filter((b) => b.isLiterature)
  }

  if (filter?.sort === 'newest') {
    filtered.sort((a, b) => b.year - a.year)
  } else if (filter?.sort === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  } else if (filter?.sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating)
  } else {
    filtered.sort((a, b) => b.reviewsCount - a.reviewsCount)
  }

  return filtered
}

export const getBookById = async (id: number): Promise<BookData | null> => {
  const books = await getRawBooks()
  return books.find((b) => b.id === id) || null
}

export const createBook = async (data: Partial<BookData>): Promise<BookData> => {
  const books = await getRawBooks()
  const categories = await getAllCategories()
  const newId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1

  const matchedCat = categories.find((c) => c.id === Number(data.categoryId)) || categories[0]

  const safeNum = (val: any, fallback: number) => {
    if (val === undefined || val === null || val === '') return fallback
    const n = Number(val)
    return isNaN(n) ? fallback : n
  }

  const stockVal = safeNum(data.stock, 3)
  const availableVal = safeNum(data.available, stockVal)

  const newBook: BookData = {
    id: newId,
    title: data.title?.trim() || 'Judul Buku Baru',
    slug: data.slug || (data.title?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || `buku-${newId}`),
    author: data.author?.trim() || 'Penulis Buku',
    isbn: data.isbn?.trim() || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    publisher: data.publisher?.trim() || 'Penerbit Kampus',
    year: safeNum(data.year, new Date().getFullYear()),
    pages: safeNum(data.pages, 250),
    callNumber: data.callNumber?.trim() || `000.${newId} PER`,
    shelfLocation: data.shelfLocation?.trim() || 'Lantai 1 - Rak Umum',
    coverUrl: data.coverUrl?.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    synopsis: data.synopsis?.trim() || 'Sinopsis dan deskripsi ringkas isi buku.',
    stock: stockVal,
    available: availableVal,
    rating: safeNum(data.rating, 4.8),
    reviewsCount: safeNum(data.reviewsCount, 10),
    isFeatured: Boolean(data.isFeatured),
    isLiterature: Boolean(data.isLiterature),
    discipline: data.discipline?.trim() || matchedCat.name,
    categoryId: matchedCat.id,
    category: matchedCat
  }

  books.push(newBook)
  fs.writeFileSync(getFilePath(), JSON.stringify(books, null, 2), 'utf-8')

  // Coba simpan ke DB
  try {
    await prisma.book.create({
      data: {
        id: newBook.id,
        title: newBook.title,
        slug: newBook.slug,
        author: newBook.author,
        isbn: newBook.isbn,
        publisher: newBook.publisher,
        year: newBook.year,
        pages: newBook.pages,
        callNumber: newBook.callNumber,
        shelfLocation: newBook.shelfLocation,
        coverUrl: newBook.coverUrl,
        synopsis: newBook.synopsis,
        stock: newBook.stock,
        available: newBook.available,
        rating: newBook.rating,
        reviewsCount: newBook.reviewsCount,
        isFeatured: newBook.isFeatured,
        isLiterature: newBook.isLiterature,
        discipline: newBook.discipline,
        categoryId: newBook.categoryId
      }
    })
  } catch {}

  return newBook
}

export const updateBook = async (id: number, data: Partial<BookData>): Promise<BookData | null> => {
  const books = await getRawBooks()
  const categories = await getAllCategories()
  const index = books.findIndex((b) => b.id === id)
  if (index === -1) return null

  const existing = books[index]
  const catId = data.categoryId ? Number(data.categoryId) : existing.categoryId
  const matchedCat = categories.find((c) => c.id === catId) || existing.category

  const updated: BookData = {
    ...existing,
    ...data,
    id,
    categoryId: catId,
    category: matchedCat,
    stock: data.stock !== undefined ? Number(data.stock) : existing.stock,
    available: data.available !== undefined ? Number(data.available) : existing.available,
    year: data.year !== undefined ? Number(data.year) : existing.year,
    pages: data.pages !== undefined ? Number(data.pages) : existing.pages
  }

  books[index] = updated
  fs.writeFileSync(getFilePath(), JSON.stringify(books, null, 2), 'utf-8')

  // Coba update ke DB
  try {
    await prisma.book.update({
      where: { id },
      data: {
        title: updated.title,
        slug: updated.slug,
        author: updated.author,
        isbn: updated.isbn,
        publisher: updated.publisher,
        year: updated.year,
        pages: updated.pages,
        callNumber: updated.callNumber,
        shelfLocation: updated.shelfLocation,
        coverUrl: updated.coverUrl,
        synopsis: updated.synopsis,
        stock: updated.stock,
        available: updated.available,
        rating: updated.rating,
        reviewsCount: updated.reviewsCount,
        isFeatured: updated.isFeatured,
        isLiterature: updated.isLiterature,
        discipline: updated.discipline,
        categoryId: updated.categoryId
      }
    })
  } catch {}

  return updated
}

export const deleteBook = async (id: number): Promise<boolean> => {
  const books = await getRawBooks()
  const filtered = books.filter((b) => b.id !== id)
  if (filtered.length === books.length) return false

  fs.writeFileSync(getFilePath(), JSON.stringify(filtered, null, 2), 'utf-8')

  try {
    await prisma.book.delete({
      where: { id }
    })
  } catch {}

  return true
}
