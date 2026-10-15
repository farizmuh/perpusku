<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-surface-container-high shadow-subtle">
    <!-- Top Announcement & Operational Bar -->
    <div v-if="settings.showAnnouncement" class="bg-primary text-on-primary py-1.5 border-b border-primary-container">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary-container text-sm">schedule</span>
          <span class="font-medium">
            {{ settings.operationalHoursWeekdays }} | {{ settings.operationalHoursWeekends }}
          </span>
        </div>
        <div class="flex items-center gap-4 text-on-primary/80">
          <span>{{ settings.announcementText }}</span>
          <span class="opacity-40">•</span>
          <div class="flex items-center gap-1 font-semibold text-secondary-fixed">
            <span class="material-symbols-outlined text-[13px]">language</span>
            <span>ID / EN</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <!-- Brand Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-serif font-bold text-xl shadow-subtle group-hover:bg-primary-container transition-colors overflow-hidden">
          <img v-if="settings.brandLogoUrl" :src="settings.brandLogoUrl" :alt="settings.brandName" class="w-full h-full object-cover" />
          <span v-else class="material-symbols-outlined text-2xl text-secondary-container">local_library</span>
        </div>
        <div class="flex flex-col">
          <span class="font-serif font-bold text-lg text-primary tracking-tight leading-tight group-hover:text-primary-container transition-colors">
            {{ settings.brandName }}
          </span>
          <span class="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            {{ settings.brandSubtitle }}
          </span>
        </div>
      </NuxtLink>

      <!-- Center Nav Links -->
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
      <div class="flex items-center gap-3">
        <button
          @click="$emit('open-search')"
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
          title="Buka Pencarian Cepat"
        >
          <span class="material-symbols-outlined text-lg">search</span>
          <span class="hidden md:inline text-xs">Cari Buku...</span>
          <kbd class="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-surface-container-highest rounded border border-outline-variant font-mono">⌘K</kbd>
        </button>

        <a
          :href="settings.attendanceFormUrl || 'https://forms.gle/sample-presensi-kunjungan'"
          target="_blank"
          rel="noopener noreferrer"
          class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-all font-semibold text-xs shadow-sm"
          title="Isi Presensi Kunjungan Perpustakaan"
        >
          <span class="material-symbols-outlined text-sm">how_to_reg</span>
          <span>{{ settings.attendanceButtonText || 'Presensi Kunjungan' }}</span>
        </a>

        <!-- Mobile Menu Toggle -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="lg:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container"
          aria-label="Toggle Menu"
        >
          <span class="material-symbols-outlined text-2xl">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Dropdown -->
    <div v-if="isMobileMenuOpen" class="lg:hidden bg-surface-container-lowest border-b border-surface-container-high px-4 py-4 space-y-2">
      <NuxtLink
        to="/"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-medium"
        :class="$route.path === '/' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'"
      >
        Beranda
      </NuxtLink>
      <NuxtLink
        to="/buku-unggulan"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-medium"
        :class="$route.path === '/buku-unggulan' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'"
      >
        Buku Unggulan
      </NuxtLink>
      <NuxtLink
        to="/eksplorasi-genre"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-medium"
        :class="$route.path.startsWith('/eksplorasi-genre') ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'"
      >
        Eksplorasi Genre & Disiplin
      </NuxtLink>
      <NuxtLink
        to="/rak-sastra"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-medium"
        :class="$route.path === '/rak-sastra' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'"
      >
        Rak Novel & Sastra
      </NuxtLink>

      <div class="pt-2 border-t border-surface-container-high">
        <a
          :href="settings.attendanceFormUrl || 'https://forms.gle/sample-presensi-kunjungan'"
          target="_blank"
          rel="noopener noreferrer"
          @click="isMobileMenuOpen = false"
          class="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-all font-semibold text-xs shadow-sm"
        >
          <span class="material-symbols-outlined text-sm">how_to_reg</span>
          <span>{{ settings.attendanceButtonText || 'Presensi Kunjungan' }}</span>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineEmits(['open-search'])
const { settings } = useSiteSettings()
const isMobileMenuOpen = ref(false)
</script>
