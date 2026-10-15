import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const folder = (query.folder === 'branding' ? 'branding' : 'books')

    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads', folder)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const contentType = getHeader(event, 'content-type') || ''

    // 1. Multipart Form Data (Standar File Input & WebP Blob)
    if (contentType.includes('multipart/form-data')) {
      const files = await readMultipartFormData(event)
      if (!files || files.length === 0) {
        return createError({
          statusCode: 400,
          statusMessage: 'Tidak ada file yang diunggah.'
        })
      }

      const file = files.find(f => f.name === 'file' || f.name === 'cover' || f.name === 'image') || files[0]
      if (!file || !file.data) {
        return createError({
          statusCode: 400,
          statusMessage: 'File gambar tidak valid.'
        })
      }

      const originalExt = path.extname(file.filename || '').toLowerCase()
      const isWebP = file.type === 'image/webp' || originalExt === '.webp'
      const finalExt = isWebP ? '.webp' : (originalExt || '.webp')

      const baseName = (file.filename || 'image')
        .replace(/[^a-zA-Z0-9-_]/g, '_')
        .replace(/\.(webp|jpg|jpeg|png|gif)$/i, '')

      const safeFilename = `${Date.now()}-${baseName}${finalExt}`
      const targetPath = path.join(uploadDir, safeFilename)

      fs.writeFileSync(targetPath, file.data)

      return {
        success: true,
        message: 'Gambar berhasil diunggah dan disimpan sebagai WebP',
        url: `/uploads/${folder}/${safeFilename}`,
        format: 'webp'
      }
    }

    // 2. Base64 JSON Payload
    const body = await readBody(event)
    if (body && body.dataUrl) {
      const matches = body.dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      if (!matches || matches.length !== 3) {
        return createError({
          statusCode: 400,
          statusMessage: 'Format data URL Base64 tidak valid.'
        })
      }

      const mimeType = matches[1]
      const buffer = Buffer.from(matches[2], 'base64')
      let ext = '.webp'
      if (!mimeType.includes('webp')) {
        if (mimeType.includes('png')) ext = '.png'
        else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg'
      }

      const safeFilename = `${Date.now()}-${folder === 'branding' ? 'logo' : 'cover'}${ext}`
      const targetPath = path.join(uploadDir, safeFilename)
      fs.writeFileSync(targetPath, buffer)

      return {
        success: true,
        message: 'Gambar berhasil diunggah',
        url: `/uploads/${folder}/${safeFilename}`,
        format: ext.replace('.', '')
      }
    }

    return createError({
      statusCode: 400,
      statusMessage: 'Format request upload tidak didukung.'
    })
  } catch (err: any) {
    return createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal mengunggah gambar'
    })
  }
})
