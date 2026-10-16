import * as fs from 'node:fs'
import * as path from 'node:path'
import prisma from './prisma'

export interface SiteSettingsData {
  // Navbar & Jam Operasional
  operationalHoursWeekdays: string
  operationalHoursWeekends: string
  announcementText: string
  showAnnouncement: boolean
  brandName: string
  brandSubtitle: string
  brandLogoUrl: string

  // Presensi Kunjungan (Google Form)
  attendanceFormUrl: string
  attendanceButtonText: string

  // Hero Section
  heroBadgeText: string
  heroBadgeIcon: string
  heroHeadline: string
  heroSubheadline: string
  heroPopularKeywords: string

  // Footer & Informasi
  footerDescription: string
  footerAccreditation: string
  footerBuilding: string
  footerAddress: string
  footerPhone: string
  footerEmail: string
  footerCopyright: string
}

export const defaultSiteSettings: SiteSettingsData = {
  // Navbar
  operationalHoursWeekdays: 'Senin - Jumat: 08.00 - 20.00',
  operationalHoursWeekends: 'Sabtu: 08.00 - 16.00 WIB',
  announcementText: 'Digital Repository • E-Journal Terindeks • Akses Database Riset Kampus',
  showAnnouncement: true,
  brandName: 'Perpustakaan Universitas',
  brandSubtitle: 'Knowledge & Research Hub',
  brandLogoUrl: '', // kosong = default icon local_library

  // Presensi Kunjungan
  attendanceFormUrl: 'https://forms.gle/sample-presensi-kunjungan',
  attendanceButtonText: 'Presensi Kunjungan',

  // Hero
  heroBadgeText: 'Pusat Literasi, Riset, & Inovasi Akademik Sivitas',
  heroBadgeIcon: 'verified',
  heroHeadline: 'Eksplorasi Cakrawala Ilmu & Koleksi Pustaka Terbaik Kampus',
  heroSubheadline: 'Akses lebih dari 120.000 judul monograf, jurnal ilmiah internasional terindeks, dan ruang belajar modern untuk menunjang keunggulan riset sivitas akademika.',
  heroPopularKeywords: 'Metodologi Penelitian, Artificial Intelligence, Bumi Manusia, Hukum Perdata, Macroeconomics',

  // Footer
  footerDescription: 'Menyediakan akses komprehensif ke repositori ilmiah terbuka, koleksi monograf terlengkap, pangkalan data jurnal terindeks Scopus & SINTA, serta ruang kolaboratif digital.',
  footerAccreditation: 'Terakreditasi "A" - Perpustakaan Nasional RI',
  footerBuilding: 'Gedung Pusat Pembelajaran & Riset',
  footerAddress: 'Gedung Perpustakaan Pusat, Kampus Terpadu, Jl. Universitas No. 1',
  footerPhone: '+62 21 7890 1234',
  footerEmail: 'perpustakaan@univ.ac.id',
  footerCopyright: '© 2026 Perpustakaan Universitas. Seluruh hak cipta dilindungi undang-undang.'
}

const getFilePath = () => {
  const dir = path.resolve(process.cwd(), 'server', 'data')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return path.join(dir, 'site-settings.json')
}

export const getSiteSettings = async (): Promise<SiteSettingsData> => {
  let settings: SiteSettingsData = { ...defaultSiteSettings }

  // 1. Coba baca dari file JSON
  try {
    const filePath = getFilePath()
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(raw)
      settings = { ...settings, ...parsed }
    }
  } catch (err) {
    console.warn('Gagal membaca site-settings.json:', err)
  }

  // 2. Coba baca dari Prisma jika model siteSetting tersedia di database
  try {
    if ((prisma as any).siteSetting) {
      const dbSettings = await (prisma as any).siteSetting.findMany()
      for (const item of dbSettings) {
        if (item.key in settings) {
          try {
            (settings as any)[item.key] = JSON.parse(item.value)
          } catch {
            (settings as any)[item.key] = item.value
          }
        }
      }
    }
  } catch {
    // Abaikan jika tabel belum ada atau DB mati
  }

  return settings
}

export const saveSiteSettings = async (newSettings: Partial<SiteSettingsData>): Promise<SiteSettingsData> => {
  const current = await getSiteSettings()
  const merged: SiteSettingsData = {
    ...current,
    ...newSettings
  }

  // 1. Simpan ke file JSON
  try {
    const filePath = getFilePath()
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8')
  } catch (err) {
    console.error('Gagal menulis site-settings.json:', err)
  }

  // 2. Simpan ke Prisma jika tersedia
  try {
    if ((prisma as any).siteSetting) {
      for (const [key, val] of Object.entries(merged)) {
        await (prisma as any).siteSetting.upsert({
          where: { key },
          update: { value: JSON.stringify(val) },
          create: { key, value: JSON.stringify(val) }
        })
      }
    }
  } catch {
    // Abaikan error Prisma
  }

  return merged
}
