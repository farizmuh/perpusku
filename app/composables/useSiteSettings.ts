export interface SiteSettings {
  // Navbar
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

  // Hero
  heroBadgeText: string
  heroBadgeIcon: string
  heroHeadline: string
  heroSubheadline: string
  heroPopularKeywords: string

  // Footer
  footerDescription: string
  footerAccreditation: string
  footerBuilding: string
  footerAddress: string
  footerPhone: string
  footerEmail: string
  footerCopyright: string
}

export const defaultSettings: SiteSettings = {
  operationalHoursWeekdays: 'Senin - Jumat: 08.00 - 20.00',
  operationalHoursWeekends: 'Sabtu: 08.00 - 16.00 WIB',
  announcementText: 'Digital Repository • E-Journal Terindeks • Akses Database Riset Kampus',
  showAnnouncement: true,
  brandName: 'Perpustakaan Universitas',
  brandSubtitle: 'Knowledge & Research Hub',
  brandLogoUrl: '',

  // Presensi Kunjungan
  attendanceFormUrl: 'https://forms.gle/sample-presensi-kunjungan',
  attendanceButtonText: 'Presensi Kunjungan',

  heroBadgeText: 'Pusat Literasi, Riset, & Inovasi Akademik Sivitas',
  heroBadgeIcon: 'verified',
  heroHeadline: 'Eksplorasi Cakrawala Ilmu & Koleksi Pustaka Terbaik Kampus',
  heroSubheadline: 'Akses lebih dari 120.000 judul monograf, jurnal ilmiah internasional terindeks, dan ruang belajar modern untuk menunjang keunggulan riset sivitas akademika.',
  heroPopularKeywords: 'Metodologi Penelitian, Artificial Intelligence, Bumi Manusia, Hukum Perdata, Macroeconomics',

  footerDescription: 'Menyediakan akses komprehensif ke repositori ilmiah terbuka, koleksi monograf terlengkap, pangkalan data jurnal terindeks Scopus & SINTA, serta ruang kolaboratif digital.',
  footerAccreditation: 'Terakreditasi "A" - Perpustakaan Nasional RI',
  footerBuilding: 'Gedung Pusat Pembelajaran & Riset',
  footerAddress: 'Gedung Perpustakaan Pusat, Kampus Terpadu, Jl. Universitas No. 1',
  footerPhone: '+62 21 7890 1234',
  footerEmail: 'perpustakaan@univ.ac.id',
  footerCopyright: '© 2026 Perpustakaan Universitas. Seluruh hak cipta dilindungi undang-undang.'
}

export const useSiteSettings = () => {
  const settings = useState<SiteSettings>('siteSettings', () => ({ ...defaultSettings }))
  const isLoading = useState<boolean>('siteSettingsLoading', () => false)
  const isLoaded = useState<boolean>('siteSettingsLoaded', () => false)

  const fetchSettings = async (force = false) => {
    if (isLoaded.value && !force) return
    isLoading.value = true
    try {
      const res: any = await $fetch('/api/settings')
      if (res && res.data) {
        settings.value = { ...settings.value, ...res.data }
        isLoaded.value = true
      }
    } catch (err) {
      console.warn('Gagal memuat pengaturan situs dari API, menggunakan default:', err)
    } finally {
      isLoading.value = false
    }
  }

  const saveSettings = async (newSettings: Partial<SiteSettings>) => {
    isLoading.value = true
    try {
      const res: any = await $fetch('/api/settings', {
        method: 'PUT',
        body: newSettings
      })
      if (res && res.data) {
        settings.value = { ...settings.value, ...res.data }
      }
      return res
    } finally {
      isLoading.value = false
    }
  }

  const resetToDefault = async () => {
    isLoading.value = true
    try {
      const res: any = await $fetch('/api/settings', {
        method: 'PUT',
        body: { resetToDefault: true }
      })
      if (res && res.data) {
        settings.value = { ...settings.value, ...res.data }
      }
      return res
    } finally {
      isLoading.value = false
    }
  }

  return {
    settings,
    isLoading,
    isLoaded,
    fetchSettings,
    saveSettings,
    resetToDefault
  }
}
