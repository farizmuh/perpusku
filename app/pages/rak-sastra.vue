<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-on-surface-variant mb-3 sm:mb-4">
      <NuxtLink to="/" class="hover:text-primary transition-colors">Beranda</NuxtLink>
      <span>/</span>
      <span class="text-on-surface font-semibold">Rak Novel & Sastra</span>
    </nav>

    <!-- Page Header with Literary Banner -->
    <div class="bg-gradient-to-r from-primary to-primary-container text-white p-5 sm:p-12 rounded-2xl sm:rounded-3xl shadow-elevated mb-6 sm:mb-10 relative overflow-hidden">
      <div class="relative z-10 max-w-3xl space-y-2 sm:space-y-4">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <span class="material-symbols-outlined text-sm">auto_stories</span>
          <span>Koleksi Sastra Kanonik Lantai 3</span>
        </div>
        <h1 class="font-serif font-bold text-2xl sm:text-4xl lg:text-5xl leading-tight">
          Rak Novel, Puisi, & Sastra
        </h1>
        <p class="text-xs sm:text-base text-white/80 leading-relaxed font-serif italic">
          "Seorang terpelajar harus sudah berbuat adil sejak dalam pikiran, apalagi dalam perbuatan." — Pramoedya Ananta Toer
        </p>
      </div>

      <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <span class="material-symbols-outlined text-[180px] sm:text-[300px]">book</span>
      </div>
    </div>

    <!-- Literary Curations Filter Tabs (Swipeable di HP) -->
    <div class="flex items-center justify-between flex-wrap gap-3 mb-6 sm:mb-8 pb-3 border-b border-surface-container">
      <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1">
        <button
          v-for="sub in ['Semua Sastra', 'Kanonik Indonesia', 'Sastra Dunia Klasik', 'Antologi Puisi']"
          :key="sub"
          @click="activeSubFilter = sub"
          class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0"
          :class="activeSubFilter === sub ? 'bg-secondary text-on-secondary shadow-sm' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'"
        >
          {{ sub }}
        </button>
      </div>

      <div class="text-[11px] sm:text-xs text-on-surface-variant">
        <span><strong>{{ filteredBooks.length }}</strong> karya sastra terdaftar</span>
      </div>
    </div>

    <!-- Bookshelf Grid Display (2 Kolom di Mobile) -->
    <div v-if="isLoading" class="py-20 text-center text-xs text-outline flex items-center justify-center gap-2">
      <span class="material-symbols-outlined animate-spin text-xl">progress_activity</span>
      <span>Menata rak sastra...</span>
    </div>

    <div v-else-if="filteredBooks.length > 0">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
        <BookCard
          v-for="b in paginatedBooks"
          :key="b.id"
          :book="b"
          @select-book="$emit('select-book', b)"
        />
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="mt-10 pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-on-surface-variant order-2 sm:order-1">
          Menampilkan <span class="font-semibold text-primary">{{ (currentPage - 1) * pageSize + 1 }}</span> – <span class="font-semibold text-primary">{{ Math.min(currentPage * pageSize, filteredBooks.length) }}</span> dari <span class="font-semibold text-primary">{{ filteredBooks.length }}</span> karya sastra
        </p>

        <div class="inline-flex items-center gap-2 order-1 sm:order-2">
          <!-- Previous Button -->
          <button
            type="button"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border"
            :class="currentPage === 1 ? 'opacity-40 cursor-not-allowed border-surface-container text-outline' : 'bg-surface-container-lowest border-surface-container-high hover:bg-surface-container text-on-surface hover:text-primary shadow-subtle'"
          >
            <span class="material-symbols-outlined text-sm">chevron_left</span>
            <span>Sebelumnya</span>
          </button>

          <!-- Page Indicator Numbers -->
          <div class="flex items-center gap-1">
            <button
              v-for="p in totalPages"
              :key="p"
              type="button"
              @click="goToPage(p)"
              class="w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center"
              :class="currentPage === p ? 'bg-primary text-white shadow-subtle' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high'"
            >
              {{ p }}
            </button>
          </div>

          <!-- Next Button -->
          <button
            type="button"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border"
            :class="currentPage === totalPages ? 'opacity-40 cursor-not-allowed border-surface-container text-outline' : 'bg-primary text-white hover:bg-primary-container shadow-subtle'"
          >
            <span>Berikutnya</span>
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-16 bg-surface-container-low rounded-2xl border border-surface-container-high p-8">
      <p class="text-xs text-on-surface-variant">Tidak ada koleksi yang sesuai dengan filter ini.</p>
    </div>

    <!-- Literary Highlights Section -->
    <div class="mt-16 bg-surface-container-low p-8 rounded-2xl border border-surface-container-high">
      <h3 class="font-serif font-bold text-lg text-primary mb-4 flex items-center gap-2">
        <span class="material-symbols-outlined text-secondary">format_quote</span>
        <span>Apresiasi Tokoh & Penulis Sastra Kampus</span>
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-on-surface-variant leading-relaxed">
        <div class="p-4 bg-white rounded-xl border border-surface-container shadow-subtle">
          <p class="italic mb-3">"Yang fana adalah waktu. Kita abadi: memungut detik demi detik, merangkainya seperti bunga..."</p>
          <div class="font-bold text-primary">— Sapardi Djoko Damono</div>
          <div class="text-[10px] text-outline">Koleksi Puisi Rak S-06</div>
        </div>

        <div class="p-4 bg-white rounded-xl border border-surface-container shadow-subtle">
          <p class="italic mb-3">"Hidup ini terlalu luas untuk dinikmati dengan kepicikan, terlalu kaya untuk dihabiskan dalam ratapan."</p>
          <div class="font-bold text-primary">— Buya Hamka</div>
          <div class="text-[10px] text-outline">Roman Klasik Rak S-03</div>
        </div>

        <div class="p-4 bg-white rounded-xl border border-surface-container shadow-subtle">
          <p class="italic mb-3">"Menulis adalah sebuah usaha untuk membuat keabadian dari apa yang fana."</p>
          <div class="font-bold text-primary">— Eka Kurniawan</div>
          <div class="text-[10px] text-outline">Fiksi Realisme Rak S-02</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

defineEmits(['select-book'])

const books = ref<any[]>([])
const isLoading = ref(true)
const activeSubFilter = ref('Semua Sastra')

const currentPage = ref(1)
const pageSize = 8

const filteredBooks = computed(() => {
  return books.value.filter((b) => {
    if (activeSubFilter.value === 'Kanonik Indonesia') {
      return b.author.includes('Pramoedya') || b.author.includes('Hamka') || b.author.includes('Kurniawan')
    }
    if (activeSubFilter.value === 'Antologi Puisi') {
      return b.author.includes('Sapardi') || b.title.includes('Puisi')
    }
    if (activeSubFilter.value === 'Sastra Dunia Klasik') {
      return b.author.includes('Dostoevsky') || b.discipline.includes('Sastra')
    }
    return true
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / pageSize) || 1
})

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredBooks.value.slice(start, start + pageSize)
})

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 380, behavior: 'smooth' })
}

watch(activeSubFilter, () => {
  currentPage.value = 1
})

onMounted(async () => {
  isLoading.value = true
  try {
    const res: any = await $fetch('/api/books?literature=true')
    if (res && res.data && res.data.length > 0) {
      books.value = res.data
    } else {
      // Fallback fetch all books and filter
      const all: any = await $fetch('/api/books')
      if (all && all.data) {
        books.value = all.data.filter((b: any) => b.isLiterature || b.discipline === 'Sastra & Fiksi' || b.category?.slug === 'sastra-fiksi-dan-puisi')
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})
</script>
