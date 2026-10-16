<template>
  <div>
    <!-- Sticky Top Header -->
    <header class="fixed top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-b border-surface-container-high shadow-subtle">
      <!-- Top Announcement & Operational Bar -->
      <div v-if="settings.showAnnouncement" class="bg-primary text-on-primary py-1 sm:py-1.5 border-b border-primary-container text-[11px] sm:text-xs">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 truncate">
            <span class="material-symbols-outlined text-secondary-container text-xs sm:text-sm shrink-0">schedule</span>
            <span class="font-medium truncate">
              {{ settings.operationalHoursWeekdays }}
            </span>
          </div>
          <div class="flex items-center gap-2 sm:gap-4 shrink-0 text-on-primary/90 text-[10px] sm:text-xs">
            <span class="hidden md:inline">{{ settings.announcementText }}</span>
            <div class="flex items-center gap-1 font-semibold text-secondary-fixed bg-white/10 px-1.5 py-0.5 rounded">
              <span class="material-symbols-outlined text-[11px] sm:text-[13px]">language</span>
              <span>ID</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Navigation Bar -->
      <div class="h-16 sm:h-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        <!-- Brand Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5 sm:gap-3 group min-w-0">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-serif font-bold text-lg sm:text-xl shadow-subtle group-hover:bg-primary-container transition-colors overflow-hidden shrink-0">
            <img v-if="settings.brandLogoUrl" :src="settings.brandLogoUrl" :alt="settings.brandName" class="w-full h-full object-cover" />
            <span v-else class="material-symbols-outlined text-xl sm:text-2xl text-secondary-container">local_library</span>
          </div>
          <div class="flex flex-col min-w-0 truncate">
            <span class="font-serif font-bold text-base sm:text-lg text-primary tracking-tight leading-tight group-hover:text-primary-container transition-colors truncate">
              {{ settings.brandName }}
            </span>
            <span class="text-[10px] sm:text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider truncate">
              {{ settings.brandSubtitle }}
            </span>
          </div>
        </NuxtLink>

        <!-- Center Nav Links (Desktop) -->
        <nav class="hidden lg:flex items-center gap-1 font-medium text-sm">
          <NuxtLink
            to="/"
            class="px-3.5 py-2 rounded-lg transition-all"
            :class="$route.path === '/' ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'"
          >
            Beranda
          </NuxtLink>
          <NuxtLink
            to="/buku-unggulan"
            class="px-3.5 py-2 rounded-lg transition-all"
            :class="$route.path === '/buku-unggulan' ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'"
          >
            Buku Unggulan
          </NuxtLink>
          <NuxtLink
            to="/eksplorasi-genre"
            class="px-3.5 py-2 rounded-lg transition-all"
            :class="$route.path.startsWith('/eksplorasi-genre') ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'"
          >
            Eksplorasi Genre
          </NuxtLink>
          <NuxtLink
            to="/rak-sastra"
            class="px-3.5 py-2 rounded-lg transition-all"
            :class="$route.path === '/rak-sastra' ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'"
          >
            Rak Novel & Sastra
          </NuxtLink>
        </nav>

        <!-- Right Action Buttons -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <!-- Tombol Pencarian Desktop -->
          <button
            @click="$emit('open-search')"
            class="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
            title="Buka Pencarian Cepat"
          >
            <span class="material-symbols-outlined text-lg">search</span>
            <span class="text-xs">Cari Buku...</span>
            <kbd class="px-1.5 py-0.5 text-[10px] bg-surface-container-highest rounded border border-outline-variant font-mono">⌘K</kbd>
          </button>

          <!-- Tombol Presensi Kunjungan (Tampil di Desktop & Mobile) -->
          <a
            :href="settings.attendanceFormUrl || 'https://forms.gle/sample-presensi-kunjungan'"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-all font-semibold text-xs shadow-sm"
            title="Isi Presensi Kunjungan Perpustakaan"
          >
            <span class="material-symbols-outlined text-sm sm:text-base">how_to_reg</span>
            <span class="hidden sm:inline">{{ settings.attendanceButtonText || 'Presensi Kunjungan' }}</span>
            <span class="sm:hidden">Presensi</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Mobile Bottom Navigation Bar (Dock Aplikasi Bawah Layar) -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-surface-container-high shadow-lg px-2 py-1.5 flex items-center justify-around safe-bottom">
      <!-- Beranda -->
      <NuxtLink
        to="/"
        class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-w-[56px]"
        :class="$route.path === '/' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'"
      >
        <span
          class="material-symbols-outlined text-2xl transition-transform"
          :class="{ 'scale-110 fill-1 font-bold': $route.path === '/' }"
        >home</span>
        <span class="text-[10px] tracking-tight mt-0.5">Beranda</span>
        <span v-if="$route.path === '/'" class="w-1.5 h-1.5 bg-primary rounded-full absolute bottom-0.5"></span>
      </NuxtLink>

      <!-- Eksplorasi Genre -->
      <NuxtLink
        to="/eksplorasi-genre"
        class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-w-[56px]"
        :class="$route.path.startsWith('/eksplorasi-genre') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'"
      >
        <span
          class="material-symbols-outlined text-2xl transition-transform"
          :class="{ 'scale-110 fill-1 font-bold': $route.path.startsWith('/eksplorasi-genre') }"
        >category</span>
        <span class="text-[10px] tracking-tight mt-0.5">Genre</span>
        <span v-if="$route.path.startsWith('/eksplorasi-genre')" class="w-1.5 h-1.5 bg-primary rounded-full absolute bottom-0.5"></span>
      </NuxtLink>

      <!-- Quick Search Center FAB -->
      <button
        @click="$emit('open-search')"
        class="flex flex-col items-center justify-center -mt-4 group"
        title="Pencarian Cepat"
      >
        <div class="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md shadow-primary/30 group-active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-2xl">search</span>
        </div>
        <span class="text-[10px] font-bold text-primary mt-0.5">Cari</span>
      </button>

      <!-- Buku Unggulan -->
      <NuxtLink
        to="/buku-unggulan"
        class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-w-[56px]"
        :class="$route.path === '/buku-unggulan' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'"
      >
        <span
          class="material-symbols-outlined text-2xl transition-transform"
          :class="{ 'scale-110 fill-1 font-bold': $route.path === '/buku-unggulan' }"
        >stars</span>
        <span class="text-[10px] tracking-tight mt-0.5">Unggulan</span>
        <span v-if="$route.path === '/buku-unggulan'" class="w-1.5 h-1.5 bg-primary rounded-full absolute bottom-0.5"></span>
      </NuxtLink>

      <!-- Rak Sastra -->
      <NuxtLink
        to="/rak-sastra"
        class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-w-[56px]"
        :class="$route.path === '/rak-sastra' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'"
      >
        <span
          class="material-symbols-outlined text-2xl transition-transform"
          :class="{ 'scale-110 fill-1 font-bold': $route.path === '/rak-sastra' }"
        >auto_stories</span>
        <span class="text-[10px] tracking-tight mt-0.5">Sastra</span>
        <span v-if="$route.path === '/rak-sastra'" class="w-1.5 h-1.5 bg-primary rounded-full absolute bottom-0.5"></span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
defineEmits(['open-search'])
const { settings } = useSiteSettings()
</script>
