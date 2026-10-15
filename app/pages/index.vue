<template>
  <div class="w-full">
    <!-- HERO SECTION -->
    <section class="relative w-full py-12 md:py-20 overflow-hidden bg-gradient-to-b from-surface-container-low/60 to-surface">
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <!-- University Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed text-primary font-semibold text-xs tracking-wider uppercase shadow-subtle mb-6">
          <span class="material-symbols-outlined text-sm">{{ settings.heroBadgeIcon || 'verified' }}</span>
          <span>{{ settings.heroBadgeText }}</span>
        </div>

        <!-- Headline & Subheadline -->
        <h1 class="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-primary tracking-tight leading-tight max-w-4xl mb-6">
          {{ settings.heroHeadline }}
        </h1>
        <p class="text-sm sm:text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-8">
          {{ settings.heroSubheadline }}
        </p>

        <!-- Advanced Search Bar -->
        <div class="w-full max-w-3xl">
          <form @submit.prevent="onSearchSubmit" class="bg-surface-container-lowest p-2 rounded-2xl shadow-elevated border border-surface-container-high flex flex-col sm:flex-row items-stretch gap-2">
            <!-- Filter Ruang Lingkup -->
            <div class="sm:w-48 bg-surface-container-low rounded-xl flex items-center px-3.5 py-1">
              <span class="material-symbols-outlined text-outline text-lg mr-2">filter_list</span>
              <select v-model="selectedScope" class="w-full bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer py-2">
                <option value="all">Semua Lingkup</option>
                <option value="title">Judul Buku</option>
                <option value="author">Pengarang</option>
                <option value="isbn">ISBN / Barcode</option>
              </select>
            </div>

            <!-- Search Input -->
            <div class="flex-1 flex items-center bg-surface-container-low rounded-xl px-4 py-1">
              <span class="material-symbols-outlined text-outline text-xl mr-2">search</span>
              <input
                v-model="searchInput"
                type="text"
                placeholder="Cari monograf, jurnal, prosiding, atau tesis riset..."
                class="w-full bg-transparent text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none py-2"
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="bg-secondary text-on-secondary hover:bg-secondary-container px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <span>Cari Koleksi</span>
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </form>

          <!-- Keyword Suggestions -->
          <div class="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-on-surface-variant">
            <span class="font-semibold text-primary">Kata kunci populer:</span>
            <button
              v-for="kw in popularKeywordsList"
              :key="kw"
              @click="applyKeyword(kw)"
              class="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded-md text-on-surface transition-colors text-[11px]"
            >
              {{ kw }}
            </button>
          </div>
        </div>

        <!-- Quick Metrics Strip -->
        <div class="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-4">
          <div class="bg-surface-container-lowest p-5 rounded-xl text-left border border-surface-container-high shadow-subtle flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <div>
              <div class="font-serif font-bold text-xl text-primary">120K+</div>
              <div class="text-xs text-on-surface-variant">Judul Buku Fisik</div>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-5 rounded-xl text-left border border-surface-container-high shadow-subtle flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-2xl">dataset</span>
            </div>
            <div>
              <div class="font-serif font-bold text-xl text-primary">45K+</div>
              <div class="text-xs text-on-surface-variant">E-Journal Global</div>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-5 rounded-xl text-left border border-surface-container-high shadow-subtle flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-2xl">chair</span>
            </div>
            <div>
              <div class="font-serif font-bold text-xl text-primary">1.200</div>
              <div class="text-xs text-on-surface-variant">Kapasitas Baca Harian</div>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-5 rounded-xl text-left border border-surface-container-high shadow-subtle flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-2xl">workspace_premium</span>
            </div>
            <div>
              <div class="font-serif font-bold text-xl text-primary">Akreditasi A</div>
              <div class="text-xs text-on-surface-variant">Perpusnas RI Resmi</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: SHOWCASE BUKU UNGGULAN -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div class="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
            <span class="material-symbols-outlined text-sm">stars</span>
            <span>Kurasi Pustakawan</span>
          </div>
          <h2 class="font-serif font-bold text-2xl sm:text-3xl text-primary">
            Koleksi Unggulan & Terpopuler Minggu Ini
          </h2>
        </div>

        <NuxtLink
          to="/buku-unggulan"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-secondary-container transition-colors"
        >
          <span>Lihat Semua Koleksi Unggulan</span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </NuxtLink>
      </div>

      <!-- Book Grid -->
      <div v-if="featuredBooks.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <NuxtLink
            v-for="item in disciplines"
            :key="item.name"
            :to="`/eksplorasi-genre?kategori=${item.slug}`"
            class="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high hover:border-primary-container hover:shadow-card transition-all group flex flex-col justify-between"
          >
            <div>
              <div class="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
              </div>
              <h3 class="font-serif font-bold text-sm text-primary mb-1 group-hover:text-primary-container">
                {{ item.name }}
              </h3>
              <p class="text-[11px] text-on-surface-variant line-clamp-2">
                {{ item.desc }}
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-[11px] text-secondary font-semibold">
              <span>{{ item.count }} Judul</span>
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

const disciplines = [
  { name: 'Sains & Teknologi', slug: 'sains-dan-teknologi', icon: 'terminal', desc: 'Komputasi, AI, rekayasa software, elektro, dan fisika kuantum.', count: '1.420+' },
  { name: 'Ilmu Sosial & Politik', slug: 'ilmu-sosial-dan-politik', icon: 'public', desc: 'Sosiologi, hubungan internasional, kebijakan publik, dan komunikasi.', count: '980+' },
  { name: 'Ekonomi & Bisnis', slug: 'ekonomi-dan-manajemen-bisnis', icon: 'trending_up', desc: 'Ekonomi makro, manajemen strategis, akuntansi, dan keuangan pasar.', count: '1.150+' },
  { name: 'Sastra & Fiksi', slug: 'sastra-fiksi-dan-puisi', icon: 'auto_stories', desc: 'Roman klasik Indonesia, antologi puisi, prosa dunia, dan karya sastra.', count: '870+' },
  { name: 'Ilmu Hukum', slug: 'ilmu-hukum-dan-konstitusi', icon: 'gavel', desc: 'KUHPerdata, hukum pidana, tata negara, dan hukum internasional.', count: '730+' },
  { name: 'Humaniora & Filsafat', slug: 'humaniora-dan-filsafat', icon: 'history_edu', desc: 'Sejarah peradaban, epistemologi, etika moral, dan kebudayaan nusantara.', count: '640+' },
  { name: 'Kedokteran & Kesehatan', slug: 'kedokteran-dan-kesehatan', icon: 'medical_services', desc: 'Atlas anatomi, biomedika, farmakologi, dan epidemiologi klinis.', count: '890+' },
  { name: 'Metodologi Penelitian', slug: 'ilmu-sosial-dan-politik', icon: 'menu_book', desc: 'Panduan skripsi, riset kualitatif, kuantitatif, dan analisis statistik.', count: '450+' }
]

onMounted(async () => {
  try {
    const res: any = await $fetch('/api/books?featured=true')
    if (res && res.data && res.data.length > 0) {
      featuredBooks.value = res.data.slice(0, 4)
    }
  } catch (err) {
    console.error(err)
  }
})
</script>
