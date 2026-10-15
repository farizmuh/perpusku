<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
      <NuxtLink to="/" class="hover:text-primary transition-colors">Beranda</NuxtLink>
      <span>/</span>
      <span class="text-on-surface font-semibold">Rak Novel & Sastra</span>
    </nav>

    <!-- Page Header with Literary Banner -->
    <div class="bg-gradient-to-r from-primary to-primary-container text-white p-8 sm:p-12 rounded-3xl shadow-elevated mb-10 relative overflow-hidden">
      <div class="relative z-10 max-w-3xl space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-container text-on-secondary text-xs font-bold uppercase tracking-wider">
          <span class="material-symbols-outlined text-sm">auto_stories</span>
          <span>Koleksi Sastra Kanonik Lantai 3</span>
        </div>
        <h1 class="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight">
          Rak Novel, Puisi, & Sastra Dunia
        </h1>
        <p class="text-sm sm:text-base text-white/80 leading-relaxed font-serif italic">
          "Seorang terpelajar harus sudah berbuat adil sejak dalam pikiran, apalagi dalam perbuatan." — Pramoedya Ananta Toer, Bumi Manusia
        </p>
      </div>

      <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <span class="material-symbols-outlined text-[300px]">book</span>
      </div>
    </div>

    <!-- Literary Curations Filter Tabs -->
    <div class="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-surface-container">
      <div class="flex items-center gap-2 overflow-x-auto">
        <button
          v-for="sub in ['Semua Sastra', 'Kanonik Indonesia', 'Sastra Dunia Klasik', 'Antologi Puisi']"
          :key="sub"
          @click="activeSubFilter = sub"
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
          :class="activeSubFilter === sub ? 'bg-secondary text-on-secondary shadow-sm' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'"
        >
          {{ sub }}
        </button>
      </div>

      <div class="text-xs text-on-surface-variant">
        <span>Menampilkan <strong>{{ filteredBooks.length }}</strong> karya sastra terdaftar</span>
      </div>
    </div>

    <!-- Bookshelf Grid Display -->
    <div v-if="isLoading" class="py-20 text-center text-xs text-outline flex items-center justify-center gap-2">
      <span class="material-symbols-outlined animate-spin text-xl">progress_activity</span>
      <span>Menata rak sastra...</span>
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
import { ref, computed, onMounted } from 'vue'

defineEmits(['select-book'])

const books = ref<any[]>([])
const isLoading = ref(true)
const activeSubFilter = ref('Semua Sastra')

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
