<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
      <NuxtLink to="/" class="hover:text-primary transition-colors">Beranda</NuxtLink>
      <span>/</span>
      <span class="text-on-surface font-semibold">Buku Unggulan</span>
    </nav>

    <!-- Page Header -->
    <div class="mb-8">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-secondary text-xs font-bold uppercase tracking-wider mb-2">
        <span class="material-symbols-outlined text-sm">stars</span>
        <span>Koleksi Pilihan & Rekomendasi</span>
      </div>
      <h1 class="font-serif font-bold text-3xl sm:text-4xl text-primary mb-3">
        Katalog Buku Unggulan Universitas
      </h1>
      <p class="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
        Daftar monograf dan literatur penting berakreditasi tinggi yang paling banyak dirujuk dan direkomendasikan oleh dosen serta peneliti fakultas.
      </p>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-subtle mb-8 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <!-- Search Input -->
        <div class="md:col-span-5 relative flex items-center bg-surface-container-low rounded-lg px-3 py-1">
          <span class="material-symbols-outlined text-outline text-lg mr-2">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari judul, pengarang, atau ISBN..."
            class="w-full bg-transparent text-xs sm:text-sm text-on-surface focus:outline-none py-1.5 placeholder:text-outline"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="text-outline hover:text-on-surface">
            <span class="material-symbols-outlined text-sm">cancel</span>
          </button>
        </div>

        <!-- Category Dropdown -->
        <div class="md:col-span-3 bg-surface-container-low rounded-lg px-3 py-1 flex items-center">
          <span class="material-symbols-outlined text-outline text-lg mr-2">category</span>
          <select v-model="selectedDiscipline" class="w-full bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer py-2">
            <option value="">Semua Disiplin</option>
            <option value="Sains & Teknologi">Sains & Teknologi</option>
            <option value="Ilmu Sosial">Ilmu Sosial & Politik</option>
            <option value="Ekonomi & Bisnis">Ekonomi & Bisnis</option>
            <option value="Sastra & Fiksi">Sastra & Fiksi</option>
            <option value="Ilmu Hukum">Ilmu Hukum</option>
            <option value="Humaniora">Humaniora & Filsafat</option>
            <option value="Kedokteran">Kedokteran & Kesehatan</option>
          </select>
        </div>

        <!-- Sort Option -->
        <div class="md:col-span-2 bg-surface-container-low rounded-lg px-3 py-1 flex items-center">
          <span class="material-symbols-outlined text-outline text-lg mr-2">sort</span>
          <select v-model="selectedSort" class="w-full bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer py-2">
            <option value="popular">Paling Populer</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="newest">Tahun Terbaru</option>
            <option value="title">Judul (A-Z)</option>
          </select>
        </div>

        <!-- Only Available Checkbox -->
        <div class="md:col-span-2 flex items-center justify-end">
          <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-on-surface select-none">
            <input v-model="onlyAvailable" type="checkbox" class="rounded border-outline text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
            <span>Hanya yang Tersedia</span>
          </label>
        </div>
      </div>

      <!-- Result Count & Active Filters -->
      <div class="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-container">
        <span>Menampilkan <strong>{{ filteredBooks.length }}</strong> judul buku</span>
        <button
          v-if="searchQuery || selectedDiscipline || onlyAvailable"
          @click="resetFilters"
          class="text-secondary hover:underline font-semibold flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-xs">restart_alt</span>
          <span>Reset Semua Filter</span>
        </button>
      </div>
    </div>

    <!-- Books Grid -->
    <div v-if="isLoading" class="py-20 text-center text-xs text-outline flex items-center justify-center gap-2">
      <span class="material-symbols-outlined animate-spin text-xl">progress_activity</span>
      <span>Memuat katalog buku...</span>
    </div>

    <div v-else-if="filteredBooks.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <BookCard
        v-for="b in filteredBooks"
        :key="b.id"
        :book="b"
        @select-book="$emit('select-book', b)"
      />
    </div>

    <div v-else class="text-center py-20 bg-surface-container-low rounded-2xl border border-surface-container-high p-8">
      <div class="w-16 h-16 rounded-full bg-surface-container text-outline flex items-center justify-center mx-auto mb-3">
        <span class="material-symbols-outlined text-3xl">search_off</span>
      </div>
      <h3 class="font-serif font-bold text-lg text-primary mb-1">Tidak Ada Buku Ditemukan</h3>
      <p class="text-xs text-on-surface-variant max-w-sm mx-auto mb-4">
        Coba gunakan kata kunci lain atau ubah pengaturan filter pencarian Anda.
      </p>
      <button @click="resetFilters" class="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-container transition-colors">
        Reset Filter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

defineEmits(['select-book'])
const route = useRoute()

const books = ref<any[]>([])
const isLoading = ref(true)

const searchQuery = ref('')
const selectedDiscipline = ref('')
const selectedSort = ref('popular')
const onlyAvailable = ref(false)

const loadBooks = async () => {
  isLoading.value = true
  try {
    const res: any = await $fetch('/api/books')
    if (res && res.data) {
      books.value = res.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const filteredBooks = computed(() => {
  return books.value.filter((b) => {
    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const match =
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q)
      if (!match) return false
    }

    // Discipline
    if (selectedDiscipline.value && b.discipline !== selectedDiscipline.value) {
      return false
    }

    // Only Available
    if (onlyAvailable.value && b.available <= 0) {
      return false
    }

    return true
  }).sort((a, b) => {
    if (selectedSort.value === 'rating') return b.rating - a.rating
    if (selectedSort.value === 'newest') return b.year - a.year
    if (selectedSort.value === 'title') return a.title.localeCompare(b.title)
    return b.reviewsCount - a.reviewsCount
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedDiscipline.value = ''
  selectedSort.value = 'popular'
  onlyAvailable.value = false
}

onMounted(async () => {
  await loadBooks()
  if (route.query.q) {
    searchQuery.value = String(route.query.q)
  }
})
</script>
