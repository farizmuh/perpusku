import { getSiteSettings } from '../../utils/siteSettings'

export default defineEventHandler(async () => {
  try {
    const data = await getSiteSettings()
    return {
      success: true,
      data
    }
  } catch (err: any) {
    return createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal memuat pengaturan situs'
    })
  }
})
