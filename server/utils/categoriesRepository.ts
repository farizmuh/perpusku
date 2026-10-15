import fs from 'node:fs'
import path from 'node:path'
import prisma from './prisma'
import { initialCategories } from './seedData'

export interface CategoryData {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  color: string
  location?: string
}

const defaultCategoryLocations: Record<string, string> = {
  'sains-dan-teknologi': 'Lantai 2 - Sayap Barat',
  'ilmu-sosial-dan-politik': 'Lantai 1 - Ruang Baca A',
  'ekonomi-dan-manajemen-bisnis': 'Lantai 2 - Sayap Timur',
  'sastra-fiksi-dan-puisi': 'Lantai 3 - Rak Sastra',
  'ilmu-hukum-dan-konstitusi': 'Lantai 1 - Ruang Hukum',
  'humaniora-dan-filsafat': 'Lantai 3 - Sayap Utara',
  'kedokteran-dan-kesehatan': 'Lantai 1 - Koleksi Khusus'
}

const getFilePath = () => {
  const dir = path.resolve(process.cwd(), 'server', 'data')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return path.join(dir, 'categories.json')
}

export const getAllCategories = async (): Promise<CategoryData[]> => {
  const filePath = getFilePath()

  // 1. Coba baca dari file jika ada
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    } catch (err) {
      console.warn('Gagal membaca categories.json:', err)
    }
  }

  // 2. Coba baca dari database
  try {
    const dbCats = await prisma.category.findMany({
      orderBy: { id: 'asc' }
    })
    if (dbCats && dbCats.length > 0) {
      const result: CategoryData[] = dbCats.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        icon: c.icon || 'menu_book',
        color: c.color || '#1e3a8a',
        location: defaultCategoryLocations[c.slug] || 'Lantai 1'
      }))
      fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf-8')
      return result
    }
  } catch {
    // DB tidak aktif / offline
  }

  // 3. Fallback ke initialCategories
  const seedWithLocations: CategoryData[] = initialCategories.map((c) => ({
    ...c,
    location: defaultCategoryLocations[c.slug] || 'Lantai 1 - Ruang Umum'
  }))
  try {
    fs.writeFileSync(filePath, JSON.stringify(seedWithLocations, null, 2), 'utf-8')
  } catch {}

  return seedWithLocations
}

export const createCategory = async (data: Omit<CategoryData, 'id'>): Promise<CategoryData> => {
  const categories = await getAllCategories()
  const newId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1

  const newCategory: CategoryData = {
    id: newId,
    name: data.name.trim(),
    slug: data.slug ? data.slug.trim().toLowerCase() : data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: data.description || '',
    icon: data.icon || 'menu_book',
    color: data.color || '#1e3a8a',
    location: data.location || 'Lantai 1 - Ruang Umum'
  }

  categories.push(newCategory)
  fs.writeFileSync(getFilePath(), JSON.stringify(categories, null, 2), 'utf-8')

  // Coba simpan ke DB
  try {
    await prisma.category.create({
      data: {
        id: newCategory.id,
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
        icon: newCategory.icon,
        color: newCategory.color
      }
    })
  } catch {}

  return newCategory
}

export const updateCategory = async (id: number, data: Partial<CategoryData>): Promise<CategoryData | null> => {
  const categories = await getAllCategories()
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return null

  const updated: CategoryData = {
    ...categories[index],
    ...data,
    id // pertahankan id
  }

  if (data.name && !data.slug) {
    updated.slug = data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }

  categories[index] = updated
  fs.writeFileSync(getFilePath(), JSON.stringify(categories, null, 2), 'utf-8')

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: updated.name,
        slug: updated.slug,
        description: updated.description,
        icon: updated.icon,
        color: updated.color
      }
    })
  } catch {}

  return updated
}

export const deleteCategory = async (id: number): Promise<boolean> => {
  const categories = await getAllCategories()
  const filtered = categories.filter((c) => c.id !== id)
  if (filtered.length === categories.length) return false

  fs.writeFileSync(getFilePath(), JSON.stringify(filtered, null, 2), 'utf-8')

  try {
    await prisma.category.delete({
      where: { id }
    })
  } catch {}

  return true
}
