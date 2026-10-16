<template>
  <div class="w-full">
    <!-- HERO SECTION -->
    <section class="relative w-full py-8 sm:py-12 md:py-20 overflow-hidden bg-gradient-to-b from-surface-container-low/60 to-surface">
      <div class="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <!-- University Badge -->
        <div class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary-fixed text-primary font-semibold text-[10px] sm:text-xs tracking-wider uppercase shadow-subtle mb-4 sm:mb-6">
          <span class="material-symbols-outlined text-xs sm:text-sm">{{ settings.heroBadgeIcon || 'verified' }}</span>
          <span>{{ settings.heroBadgeText }}</span>
        </div>

        <!-- Headline & Subheadline -->
        <h1 class="font-serif font-bold text-2xl sm:text-4xl md:text-5xl text-primary tracking-tight leading-tight max-w-4xl mb-3 sm:mb-6">
          {{ settings.heroHeadline }}
        </h1>
        <p class="text-xs sm:text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-6 sm:mb-8">
          {{ settings.heroSubheadline }}
        </p>

        <!-- Advanced Search Bar -->
        <div class="w-full max-w-3xl">
          <form @submit.prevent="onSearchSubmit" class="bg-surface-container-lowest p-1.5 sm:p-2 rounded-2xl shadow-elevated border border-surface-container-high flex flex-col sm:flex-row items-stretch gap-1.5 sm:gap-2">
            <!-- Filter Ruang Lingkup -->
            <div class="sm:w-48 bg-surface-container-low rounded-xl flex items-center px-3 py-1">
              <span class="material-symbols-outlined text-outline text-base sm:text-lg mr-1.5">filter_list</span>
              <select v-model="selectedScope" class="w-full bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer py-1.5 sm:py-2">
                <option value="all">Semua Lingkup</option>
                <option value="title">Judul Buku</option>
                <option value="author">Pengarang</option>
                <option value="isbn">ISBN / Barcode</option>
              </select>
            </div>

            <!-- Search Input -->
            <div class="flex-1 flex items-center bg-surface-container-low rounded-xl px-3 sm:px-4 py-1">
              <span class="material-symbols-outlined text-outline text-lg sm:text-xl mr-2 shrink-0">search</span>
              <input
                v-model="searchInput"
                type="text"
                placeholder="Cari monograf, jurnal, atau skripsi..."
                class="w-full bg-transparent text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none py-1.5 sm:py-2"
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="bg-secondary text-on-secondary hover:bg-secondary-container px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0"
            >
              <span>Cari Koleksi</span>
              <span class="material-symbols-outlined text-sm sm:text-base">arrow_forward</span>
            </button>
          </form>

          <!-- Keyword Suggestions (Swipeable di mobile) -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:flex-wrap sm:justify-center mt-3 sm:mt-4 text-[11px] text-on-surface-variant">
            <span class="font-semibold text-primary shrink-0 hidden sm:inline">Kata kunci populer:</span>
            <button
              v-for="kw in popularKeywordsList"
              :key="kw"
              @click="applyKeyword(kw)"
              class="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded-md text-on-surface transition-colors whitespace-nowrap shrink-0 text-[10px] sm:text-[11px]"
            >
              {{ kw }}
            </button>
          </div>
        </div>

        <!-- Quick Metrics Strip (Swipeable Horizontal di HP, Grid di Desktop) -->
        <div class="w-full flex overflow-x-auto pb-2 gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 mt-8 sm:mt-12 pt-2 sm:pt-4">
          <div class="min-w-[200px] sm:min-w-0 flex-1 bg-surface-container-lowest p-3.5 sm:p-5 rounded-xl text-left border border-surface-container-high shadow-subtle flex items-center gap-3 sm:gap-4 shrink-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl sm:text-2xl">menu_book</span>
            </div>
            <div>
              <div class="font-serif font-bold text-lg sm:text-xl text-primary">120K+</div>
              <div class="text-[10px] sm:text-xs text-on-surface-variant">Judul Buku Fisik</div>
            </div>
          </div>

          <div class="min-w-[200px] sm:min-w-0 flex-1 bg-surface-container-lowest p-3.5 sm:p-5 rounded-xl text-left border border-surface-container-high shadow-subtle flex items-center gap-3 sm:gap-4 shrink-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl sm:text-2xl">dataset</span>
            </div>
            <div>
              <div class="font-serif font-bold text-lg sm:text-xl text-primary">45K+</div>
              <div class="text-[10px] sm:text-xs text-on-surface-variant">E-Journal Global</div>
            </div>
          </div>

          <div class="min-w-[200px] sm:min-w-0 flex-1 bg-surface-container-lowest p-3.5 sm:p-5 rounded-xl text-left border border-surface-container-high shadow-subtle flex items-center gap-3 sm:gap-4 shrink-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl sm:text-2xl">chair</span>
            </div>
            <div>
              <div class="font-serif font-bold text-lg sm:text-xl text-primary">1.200</div>
              <div class="text-[10px] sm:text-xs text-on-surface-variant">Kapasitas Harian</div>
            </div>
          </div>

          <div class="min-w-[200px] sm:min-w-0 flex-1 bg-surface-container-lowest p-3.5 sm:p-5 rounded-xl text-left border border-surface-container-high shadow-subtle flex items-center gap-3 sm:gap-4 shrink-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl sm:text-2xl">workspace_premium</span>
            </div>
            <div>
              <div class="font-serif font-bold text-lg sm:text-xl text-primary">Akreditasi A</div>
              <div class="text-[10px] sm:text-xs text-on-surface-variant">Perpusnas RI Resmi</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: SHOWCASE BUKU UNGGULAN -->
    <section class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2 sm:gap-4">
        <div>
          <div class="flex items-center gap-1.5 text-secondary text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
            <span class="material-symbols-outlined text-sm">stars</span>
            <span>Kurasi Pustakawan</span>
          </div>
          <h2 class="font-serif font-bold text-xl sm:text-3xl text-primary">
            Koleksi Unggulan & Terpopuler
          </h2>
        </div>

        <NuxtLink
          to="/buku-unggulan"
          class="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-secondary-container transition-colors"
        >
          <span>Lihat Semua Unggulan</span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </NuxtLink>
      </div>

      <!-- Book Grid (2 Kolom di Mobile, 3 di Tablet, 6 di Desktop untuk 6 Buku Rapi) -->
      <div v-if="featuredBooks.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
        <BookCard
          v-for="b in featuredBooks"
          :key="b.id"
          :book="b"
          @select-book="$emit('select-book', b)"
        />
      </div>

      <div v-else class="text-center py-12 text-on-surface-variant text-sm">
        Memuat koleksi buku unggulan...
      </div>
    </section>

    <!-- SECTION 3: EKSPLORASI DISIPLIN ILMU -->
    <section class="bg-surface-container-low py-16 border-y border-surface-container-high">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <div class="inline-flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
            <span class="material-symbols-outlined text-sm">category</span>
            <span>Klasifikasi Desimal Dewey (DDC)</span>
          </div>
          <h2 class="font-serif font-bold text-2xl sm:text-3xl text-primary mb-3">
            Jelajahi Pustaka Berdasarkan Disiplin Ilmu
          </h2>
          <p class="text-xs sm:text-sm text-on-surface-variant">
            Temukan literatur akademik terspesialisasi yang dikelompokkan secara terstruktur untuk memudahkan studi lintas jurusan.
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <NuxtLink
            v-for="item in disciplines"
            :key="item.id || item.slug"
            :to="`/eksplorasi-genre?kategori=${item.slug}`"
            class="bg-surface-container-lowest p-3.5 sm:p-5 rounded-xl border border-surface-container-high hover:border-primary-container hover:shadow-card transition-all group flex flex-col justify-between"
          >
            <div>
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white shadow-xs group-hover:scale-105 transition-transform"
                :style="{ backgroundColor: item.color || '#00236f' }"
              >
                <span class="material-symbols-outlined text-xl">{{ item.icon || 'menu_book' }}</span>
              </div>
              <h3 class="font-serif font-bold text-xs sm:text-sm text-primary mb-1 group-hover:text-primary-container line-clamp-1">
                {{ item.name }}
              </h3>
              <p class="text-[10px] sm:text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                {{ item.description || item.desc || 'Koleksi monograf dan literatur keilmuan.' }}
              </p>
            </div>
            <div class="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-surface-container flex items-center justify-between text-[10px] sm:text-[11px] text-secondary font-semibold">
              <span>{{ item.bookCount !== undefined ? `${item.bookCount} Judul` : (item.count || '0 Judul') }}</span>
              <span class="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- SECTION 4: RAK NOVEL & SASTRA HIGHLIGHT -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-primary text-on-primary rounded-2xl p-8 lg:p-12 relative overflow-hidden shadow-elevated">
        <div class="relative z-10 max-w-2xl space-y-4">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-on-secondary text-[11px] font-bold uppercase tracking-wider">
            <span class="material-symbols-outlined text-sm">auto_stories</span>
            <span>Ruang Santai & Literasi Humaniora</span>
          </div>
          <h2 class="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight">
            Rak Sastra Kanonik & Fiksi Dunia
          </h2>
          <p class="text-xs sm:text-sm text-on-primary/80 leading-relaxed">
            Dari mahakarya Tetralogi Buru karya Pramoedya Ananta Toer, sajak Sapardi Djoko Damono, hingga karya realisme magis internasional. Temukan kedalaman rasa dan bahasa di lantai 3 perpustakaan.
          </p>
          <div class="pt-2">
            <NuxtLink
              to="/rak-sastra"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary-container text-on-secondary font-bold text-xs hover:bg-secondary transition-all shadow-sm"
            >
              <span>Kunjungi Rak Sastra</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineEmits(['select-book'])
const router = useRouter()
const { settings } = useSiteSettings()

const searchInput = ref('')
const selectedScope = ref('all')
const featuredBooks = ref<any[]>([])
const disciplines = ref<any[]>([])

const popularKeywordsList = computed(() => {
  if (!settings.value.heroPopularKeywords) return []
  return settings.value.heroPopularKeywords.split(',').map((k) => k.trim()).filter(Boolean)
})

const applyKeyword = (kw: string) => {
  searchInput.value = kw
  onSearchSubmit()
}

const onSearchSubmit = () => {
  if (!searchInput.value.trim()) return
  router.push({
    path: '/buku-unggulan',
    query: {
      q: searchInput.value.trim(),
      scope: selectedScope.value
    }
  })
}

onMounted(async () => {
  try {
    const [booksRes, catsRes]: any = await Promise.all([
      $fetch('/api/books?featured=true').catch(() => null),
      $fetch('/api/categories').catch(() => null)
    ])
    if (booksRes && booksRes.data && booksRes.data.length > 0) {
      if (booksRes.data.length >= 6) {
        featuredBooks.value = booksRes.data.slice(0, 6)
      } else {
        const allBooksRes: any = await $fetch('/api/books?sort=popular').catch(() => null)
        const combined = [...booksRes.data]
        if (allBooksRes && allBooksRes.data) {
          for (const b of allBooksRes.data) {
            if (!combined.some((item: any) => item.id === b.id)) {
              combined.push(b)
            }
            if (combined.length >= 6) break
          }
        }
        featuredBooks.value = combined.slice(0, 6)
      }
    } else {
      const popRes: any = await $fetch('/api/books?sort=popular').catch(() => null)
      if (popRes && popRes.data) {
        featuredBooks.value = popRes.data.slice(0, 6)
      }
    }
    if (catsRes && catsRes.data && catsRes.data.length > 0) {
      disciplines.value = catsRes.data
    }
  } catch (err) {
    console.error(err)
  }
})
</script>
