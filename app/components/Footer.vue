<template>
  <footer class="bg-tertiary text-on-tertiary border-t border-tertiary-container pt-10 sm:pt-16 pb-8 sm:pb-12 mt-12 sm:mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-8 sm:pb-12 border-b border-tertiary-container/60">
        <!-- Col 1: Identity & Accreditation -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-serif font-bold text-xl overflow-hidden shrink-0">
              <img v-if="settings.brandLogoUrl" :src="settings.brandLogoUrl" :alt="settings.brandName" class="w-full h-full object-cover" />
              <span v-else class="material-symbols-outlined text-2xl text-secondary-container">local_library</span>
            </div>
            <div>
              <h3 class="font-serif font-bold text-lg text-white">{{ settings.brandName }}</h3>
              <p class="text-xs text-on-tertiary-container uppercase tracking-wider font-semibold">{{ settings.footerBuilding }}</p>
            </div>
          </div>
          <p class="text-xs sm:text-sm text-on-tertiary-container leading-relaxed max-w-sm">
            {{ settings.footerDescription }}
          </p>
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary-container text-secondary-fixed text-xs font-semibold">
            <span class="material-symbols-outlined text-sm">verified</span>
            <span>{{ settings.footerAccreditation }}</span>
          </div>
        </div>

        <!-- Col 2: Navigasi Katalog -->
        <div>
          <h4 class="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-tertiary-container pb-2">
            Layanan Katalog
          </h4>
          <ul class="space-y-2.5 text-xs text-on-tertiary-container">
            <li><NuxtLink to="/buku-unggulan" class="hover:text-white transition-colors">Buku Unggulan & Rekomendasi</NuxtLink></li>
            <li><NuxtLink to="/eksplorasi-genre" class="hover:text-white transition-colors">Katalog Berdasarkan Disiplin</NuxtLink></li>
            <li><NuxtLink to="/rak-sastra" class="hover:text-white transition-colors">Koleksi Fiksi & Sastra Dunia</NuxtLink></li>
            <li><a href="#" class="hover:text-white transition-colors">Repositori Skripsi & Disertasi</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Pangkalan Jurnal Elektronik</a></li>
          </ul>
        </div>

        <!-- Col 3: Layanan Pemustaka -->
        <div>
          <h4 class="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-tertiary-container pb-2">
            Pemustaka
          </h4>
          <ul class="space-y-2.5 text-xs text-on-tertiary-container">
            <li><a href="#" class="hover:text-white transition-colors">Presensi Kunjungan Fisik</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Peminjaman & Pengembalian</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Reservasi Ruang Diskusi</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Cek Plagiarisme Turnitin</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Bebas Pustaka Kelulusan</a></li>
          </ul>
        </div>

        <!-- Col 4: Jam & Kontak -->
        <div>
          <h4 class="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-tertiary-container pb-2">
            Kontak & Lokasi
          </h4>
          <ul class="space-y-2.5 text-xs text-on-tertiary-container">
            <li class="flex items-start gap-2">
              <span class="material-symbols-outlined text-sm text-secondary-fixed shrink-0 mt-0.5">location_on</span>
              <span>{{ settings.footerAddress }}</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-secondary-fixed shrink-0">mail</span>
              <span>{{ settings.footerEmail }}</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-secondary-fixed shrink-0">call</span>
              <span>{{ settings.footerPhone }}</span>
            </li>
            <li class="flex items-center gap-2 pt-1 border-t border-tertiary-container/40">
              <span class="material-symbols-outlined text-sm text-secondary-fixed shrink-0">schedule</span>
              <span class="text-[11px]">{{ settings.operationalHoursWeekdays }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-on-tertiary-container gap-3 sm:gap-4 text-center sm:text-left">
        <div>
          {{ settings.footerCopyright }}
        </div>
        <div class="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
          <a href="#" class="hover:text-white transition-colors">Kebijakan Privasi</a>
          <a href="#" class="hover:text-white transition-colors">Syarat Penggunaan</a>
          <a href="#" class="hover:text-white transition-colors">Peta Situs</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { settings } = useSiteSettings()
</script>
