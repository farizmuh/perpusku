import { saveSiteSettings, defaultSiteSettings } from '../../utils/siteSettings'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Jika ada parameter reset
    if (body.resetToDefault) {
      const data = await saveSiteSettings(defaultSiteSettings)
      return {
        success: true,
        message: 'Pengaturan berhasil dikembalikan ke setelan awal',
        data
      }
    }

    const data = await saveSiteSettings(body)
    return {
      success: true,
      message: 'Pengaturan berhasil diperbarui',
      data
    }
  } catch (err: any) {
    return createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal menyimpan pengaturan situs'
    })
  }
})
