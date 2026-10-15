<template>
  <div class="min-h-screen flex flex-col bg-background font-body text-on-surface antialiased">
    <!-- Navbar with sticky header (hanya di rute publik) -->
    <Navbar v-if="!isAdminRoute" @open-search="isSearchOpen = true" />

    <!-- Main Content Routed by Pages -->
    <main :class="isAdminRoute ? 'flex-1 pt-0' : 'flex-1 pt-28'">
      <NuxtPage @select-book="openBookModal" />
    </main>

    <!-- Scholarly Footer (hanya di rute publik) -->
    <Footer v-if="!isAdminRoute" />

    <!-- Book Detail & Loan Reservation Modal -->
    <BookModal
      v-if="selectedBook"
      :book="selectedBook"
      @close="selectedBook = null"
      @loan-success="onLoanSuccess"
    />

    <!-- Quick Search Command Modal (Cmd+K) -->
    <div
      v-if="isSearchOpen"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-20"
      @click="isSearchOpen = false"
    >
      <div
        class="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-elevated border border-surface-container-high overflow-hidden"
        @click.stop
      >
        <div class="p-4 border-b border-surface-container flex items-center gap-3">
          <span class="material-symbols-outlined text-outline text-2xl">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Ketik judul buku, pengarang, atau subjek ilmiah..."
            class="flex-1 bg-transparent text-sm font-body text-on-surface outline-none placeholder:text-outline"
            autofocus
            @keydown.esc="isSearchOpen = false"
          />
          <kbd class="text-[10px] px-2 py-0.5 rounded bg-surface-container text-outline border border-outline-variant font-mono">ESC</kbd>
        </div>

        <!-- Search Results List -->
        <div class="max-h-96 overflow-y-auto p-2">
          <div v-if="isSearching" class="p-8 text-center text-xs text-outline flex items-center justify-center gap-2">
            <span class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            <span>Mencari di pangkalan data katalog...</span>
          </div>

          <div v-else-if="searchResults.length === 0 && searchQuery" class="p-8 text-center text-xs text-outline">
            Tidak ada buku yang cocok dengan kata kunci "{{ searchQuery }}".
          </div>

          <div v-else-if="searchResults.length === 0" class="p-6 text-center text-xs text-outline space-y-2">
            <p>Pencarian cepat katalog monograf, jurnal, dan karya sastra.</p>
            <div class="flex flex-wrap justify-center gap-1.5 pt-2">
              <button
                v-for="kw in ['Artificial Intelligence', 'Bumi Manusia', 'Metodologi Penelitian', 'Hukum Perdata']"
                :key="kw"
                @click="searchQuery = kw"
                class="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant hover:bg-primary hover:text-white transition-colors text-[11px]"
              >
                {{ kw }}
              </button>
            </div>
          </div>

          <div v-else class="space-y-1">
            <div
              v-for="b in searchResults"
              :key="b.id"
              @click="openBookModal(b); isSearchOpen = false"
              class="p-2.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-3"
            >
              <div class="w-10 h-14 rounded overflow-hidden bg-surface-container shrink-0 border border-outline-variant/30">
                <img :src="b.coverUrl" :alt="b.title" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono font-bold text-primary px-1.5 py-0.2 bg-primary-fixed rounded">{{ b.callNumber }}</span>
                  <span class="text-[10px] text-secondary font-semibold uppercase">{{ b.discipline }}</span>
                </div>
                <h4 class="font-serif font-bold text-xs text-on-surface truncate">{{ b.title }}</h4>
                <p class="text-[11px] text-on-surface-variant truncate">{{ b.author }} ({{ b.year }}) - {{ b.shelfLocation }}</p>
              </div>
              <div class="text-right shrink-0">
                <span
                  :class="b.available > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'"
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                >
                  {{ b.available > 0 ? `${b.available} Eks` : 'Dipinjam' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification for Actions -->
    <Toast
      :show="toast.show"
      :message="toast.message"
      @dismiss="toast.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)

const selectedBook = ref<any>(null)
const toast = ref({
  show: false,
  message: ''
})

let searchTimeout: any = null

watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout)
  if (!newVal || newVal.trim().length === 0) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  searchTimeout = setTimeout(async () => {
    try {
      const res: any = await $fetch(`/api/books?q=${encodeURIComponent(newVal.trim())}`)
      if (res && res.data) {
        searchResults.value = res.data
      }
    } catch (e) {
      console.error(e)
    } finally {
      isSearching.value = false
    }
  }, 250)
})

const openBookModal = (book: any) => {
  selectedBook.value = book
}

const onLoanSuccess = (msg: string) => {
  toast.value = {
    show: true,
    message: msg
  }

  setTimeout(() => {
    toast.value.show = false
  }, 4500)
}

// Global Keyboard Shortcut: Cmd/Ctrl + K to open search
const onKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isSearchOpen.value = !isSearchOpen.value
  }
}

const { fetchSettings } = useSiteSettings()

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  fetchSettings()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>
