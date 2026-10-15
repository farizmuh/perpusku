<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
      <NuxtLink to="/" class="hover:text-primary transition-colors">Beranda</NuxtLink>
      <span>/</span>
      <span class="text-on-surface font-semibold">Eksplorasi Disiplin & Genre</span>
    </nav>

    <!-- Page Header -->
    <div class="mb-8">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider mb-2">
        <span class="material-symbols-outlined text-sm">hub</span>
        <span>Struktur Klasifikasi Ilmu Pengetahuan</span>
      </div>
      <h1 class="font-serif font-bold text-3xl sm:text-4xl text-primary mb-3">
        Eksplorasi Genre & Disiplin Ilmu
      </h1>
      <p class="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
        Jelajahi karya ilmiah, buku teks kurikulum, dan monograf referensi yang dipetakan berdasarkan fakultas dan rumpun keilmuan.
      </p>
    </div>

    <!-- Category Selector Dropdown -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="relative w-full sm:w-80 md:w-96" ref="dropdownRef">
        <label class="block text-xs font-semibold text-on-surface-variant mb-1.5">
          Pilih Rumpun / Genre Keilmuan
        </label>
        
        <!-- Dropdown Trigger Button -->
        <button
          type="button"
          @click="isDropdownOpen = !isDropdownOpen"
          class="w-full flex items-center justify-between gap-3 px-4 py-3 bg-surface-container-lowest border border-surface-container-high rounded-xl hover:border-primary/50 transition-all shadow-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 text-left"
          :class="{ 'ring-2 ring-primary/20 border-primary': isDropdownOpen }"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">{{ currentCategory.icon }}</span>
            </div>
            <div class="truncate">
              <span class="block text-xs font-bold text-primary truncate">
                {{ currentCategory.name }}
              </span>
              <span class="block text-[11px] text-on-surface-variant truncate">
                {{ getCategoryCount(selectedCategory) }} judul tersedia
              </span>
            </div>
          </div>
          <span
            class="material-symbols-outlined text-outline transition-transform duration-200 shrink-0"
            :class="{ 'rotate-180 text-primary': isDropdownOpen }"
          >
            expand_more
          </span>
        </button>

        <!-- Dropdown Menu -->
        <transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="transform scale-95 opacity-0 -translate-y-1"
          enter-to-class="transform scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="transform scale-100 opacity-100 translate-y-0"
          leave-to-class="transform scale-95 opacity-0 -translate-y-1"
        >
          <div
            v-if="isDropdownOpen"
            class="absolute left-0 right-0 mt-2 z-50 bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-elevated overflow-hidden py-1.5 max-h-80 overflow-y-auto"
          >
            <!-- Opsi: Semua Disiplin -->
            <button
              type="button"
              @click="selectCategory('semua')"
              class="w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors hover:bg-surface-container-low"
              :class="selectedCategory === 'semua' ? 'bg-primary/5 text-primary font-bold' : 'text-on-surface'"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-base" :class="selectedCategory === 'semua' ? 'text-primary' : 'text-on-surface-variant'">apps</span>
                <span class="text-xs">Semua Disiplin</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
                  {{ books.length }}
                </span>
                <span v-if="selectedCategory === 'semua'" class="material-symbols-outlined text-base text-primary">check</span>
              </div>
            </button>

            <div class="h-px bg-surface-container-high my-1"></div>

            <!-- Opsi: Setiap Kategori -->
            <button
              v-for="cat in categories"
              :key="cat.slug"
              type="button"
              @click="selectCategory(cat.slug)"
              class="w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors hover:bg-surface-container-low"
              :class="selectedCategory === cat.slug ? 'bg-primary/5 text-primary font-bold' : 'text-on-surface'"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-base" :class="selectedCategory === cat.slug ? 'text-primary' : 'text-on-surface-variant'">{{ cat.icon }}</span>
                <span class="text-xs">{{ cat.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
                  {{ getCategoryCount(cat.slug) }}
                </span>
                <span v-if="selectedCategory === cat.slug" class="material-symbols-outlined text-base text-primary">check</span>
              </div>
            </button>
          </div>
        </transition>
      </div>

      <!-- Quick status & reset button if filtered -->
      <div class="flex items-center gap-3 text-xs text-on-surface-variant self-start sm:self-end pb-1">
        <span>Menampilkan <strong>{{ filteredBooks.length }}</strong> buku</span>
        <button
          v-if="selectedCategory !== 'semua'"
          @click="selectCategory('semua')"
          class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-container-high hover:bg-surface-container text-primary font-semibold text-xs transition-colors"
        >
          <span class="material-symbols-outlined text-sm">restart_alt</span>
          <span>Reset Filter</span>
        </button>
      </div>
    </div>

    <!-- Active Category Banner Info -->
    <div v-if="activeCategoryInfo" class="bg-surface-container-low p-6 rounded-2xl border border-surface-container-high mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-2xl">{{ activeCategoryInfo.icon }}</span>
        </div>
        <div>
          <h2 class="font-serif font-bold text-xl text-primary mb-1">{{ activeCategoryInfo.name }}</h2>
          <p class="text-xs sm:text-sm text-on-surface-variant max-w-2xl">{{ activeCategoryInfo.desc }}</p>
        </div>
      </div>
      <div class="text-xs bg-white px-4 py-2.5 rounded-xl border border-surface-container-high shrink-0">
        <span class="text-outline block text-[10px] uppercase font-semibold">Lokasi Ruang Koleksi</span>
        <span class="font-semibold text-primary">{{ activeCategoryInfo.location }}</span>
      </div>
    </div>

    <!-- Books Grid -->
    <div v-if="isLoading" class="py-20 text-center text-xs text-outline flex items-center justify-center gap-2">
      <span class="material-symbols-outlined animate-spin text-xl">progress_activity</span>
      <span>Memuat data koleksi...</span>
    </div>

    <div v-else-if="filteredBooks.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <BookCard
        v-for="b in filteredBooks"
        :key="b.id"
        :book="b"
        @select-book="$emit('select-book', b)"
      />
    </div>

    <div v-else class="text-center py-16 bg-surface-container-low rounded-2xl border border-surface-container-high p-8">
      <p class="text-xs text-on-surface-variant">Belum ada buku untuk kategori ini.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineEmits(['select-book'])
const route = useRoute()
const router = useRouter()

const selectedCategory = ref('semua')
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const books = ref<any[]>([])
const isLoading = ref(true)

const categories = [
  { name: 'Sains & Teknologi', slug: 'sains-dan-teknologi', icon: 'terminal', desc: 'Monograf komputasi, kecerdasan buatan, rekayasa software, elektro, dan fisika.', location: 'Lantai 2 - Sayap Barat' },
  { name: 'Ilmu Sosial & Politik', slug: 'ilmu-sosial-dan-politik', icon: 'public', desc: 'Sosiologi, hubungan internasional, kebijakan publik, dan komunikasi massa.', location: 'Lantai 1 - Ruang Baca A' },
  { name: 'Ekonomi & Bisnis', slug: 'ekonomi-dan-manajemen-bisnis', icon: 'trending_up', desc: 'Manajemen korporasi, akuntansi, pasar modal, dan teori ekonomi makro.', location: 'Lantai 2 - Sayap Timur' },
  { name: 'Sastra & Fiksi', slug: 'sastra-fiksi-dan-puisi', icon: 'auto_stories', desc: 'Roman kanonik Indonesia, antologi puisi, prosa klasik dunia, dan naskah drama.', location: 'Lantai 3 - Rak Sastra' },
  { name: 'Ilmu Hukum', slug: 'ilmu-hukum-dan-konstitusi', icon: 'gavel', desc: 'Kompilasi KUHPerdata, pidana, tata negara, dan hukum internasional.', location: 'Lantai 1 - Ruang Hukum' },
  { name: 'Humaniora & Filsafat', slug: 'humaniora-dan-filsafat', icon: 'history_edu', desc: 'Sejarah peradaban, epistemologi, etika moral, dan kebudayaan nusantara.', location: 'Lantai 3 - Sayap Utara' },
  { name: 'Kedokteran & Kesehatan', slug: 'kedokteran-dan-kesehatan', icon: 'medical_services', desc: 'Atlas anatomi, ilmu bedah, farmakologi, dan epidemiologi kesehatan.', location: 'Lantai 1 - Koleksi Khusus' }
]

const currentCategory = computed(() => {
  if (selectedCategory.value === 'semua') {
    return {
      name: 'Semua Disiplin Ilmu',
      icon: 'apps',
      desc: 'Seluruh koleksi pustaka',
      location: 'Semua Lokasi'
    }
  }
  return categories.find((c) => c.slug === selectedCategory.value) || {
    name: 'Pilih Disiplin',
    icon: 'apps',
    desc: '',
    location: ''
  }
})

const activeCategoryInfo = computed(() => {
  return categories.find((c) => c.slug === selectedCategory.value)
})

const filteredBooks = computed(() => {
  if (selectedCategory.value === 'semua') return books.value
  return books.value.filter((b) => b.category?.slug === selectedCategory.value)
})

const getCategoryCount = (slug: string) => {
  if (slug === 'semua') return books.value.length
  return books.value.filter((b) => b.category?.slug === slug).length
}

const selectCategory = (slug: string) => {
  selectedCategory.value = slug
  isDropdownOpen.value = false
  router.replace({
    query: slug === 'semua' ? {} : { kategori: slug }
  })
}

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isDropdownOpen.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isDropdownOpen.value = false
  }
}

onMounted(async () => {
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleKeydown)

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

  if (route.query.kategori) {
    selectedCategory.value = String(route.query.kategori)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('keydown', handleKeydown)
})
</script>
