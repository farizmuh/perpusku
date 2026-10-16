import * as fs from 'node:fs'
import * as path from 'node:path'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const filePath = path.resolve(process.cwd(), 'public', 'uploads', slug)

  // Cegah directory traversal
  const uploadsBase = path.resolve(process.cwd(), 'public', 'uploads')
  if (!filePath.startsWith(uploadsBase)) {
    return createError({ statusCode: 403, statusMessage: 'Akses ditolak' })
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return createError({ statusCode: 404, statusMessage: 'File gambar tidak ditemukan' })
  }

  const ext = path.extname(filePath).toLowerCase()
  let contentType = 'application/octet-stream'
  if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
  else if (ext === '.png') contentType = 'image/png'
  else if (ext === '.webp') contentType = 'image/webp'
  else if (ext === '.gif') contentType = 'image/gif'
  else if (ext === '.svg') contentType = 'image/svg+xml'

  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Cache-Control', 'public, max-age=86400')

  return fs.readFileSync(filePath)
})
