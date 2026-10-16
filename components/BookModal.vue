<template>
  <div
    v-if="book"
    class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200"
    @click.self="$emit('close')"
  >
    <div
      class="relative w-full max-w-3xl bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-elevated border-t sm:border border-surface-container-high overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300"
      @click.stop
    >
      <!-- Mobile Drag Handle Bar -->
      <div class="sm:hidden w-full pt-3 pb-1.5 flex justify-center shrink-0 cursor-grab" @click="$emit('close')">
        <div class="w-12 h-1.5 rounded-full bg-slate-300"></div>
      </div>

      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-container-highest/80 hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors"
        aria-label="Tutup Dialog"
      >
        <span class="material-symbols-outlined text-lg sm:text-xl">close</span>
      </button>

      <!-- Scrollable Body -->
      <div class="overflow-y-auto flex-1">
        <!-- MOBILE ONLY: Compact Top Header (Cover + Info Sejajar) -->
        <div class="sm:hidden p-4 bg-surface-container-low flex items-start gap-3.5 border-b border-surface-container">
          <div class="w-20 aspect-[3/4] rounded-lg overflow-hidden shadow-sm border border-outline-variant/40 bg-surface-container shrink-0">
            <img :src="book.coverUrl" :alt="book.title" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0 pr-6">
            <span class="text-[9px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary-fixed uppercase tracking-wider">
              {{ book.discipline || book.category?.name }}
            </span>
            <h2 class="font-serif font-bold text-sm text-primary leading-snug mt-1 line-clamp-2">
              {{ book.title }}
            </h2>
            <p class="text-[11px] text-secondary font-medium truncate mt-0.5">
              {{ book.author }} ({{ book.year }})
            </p>
            <div class="flex items-center gap-2 mt-2">
              <span
                v-if="book.available > 0"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Tersedia: {{ book.available }} Eks
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800"
              >
                Dipinjam Penuh
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-12">
          <!-- Left Column (Desktop Cover & Bibliographic Meta) -->
          <div class="hidden sm:flex sm:col-span-5 bg-surface-container-low p-6 flex-col items-center border-r border-surface-container-high">
            <!-- 3:4 Book Cover -->
            <div class="w-44 aspect-[3/4] rounded-lg overflow-hidden shadow-card border border-outline-variant/40 mb-4 bg-surface-container">
              <img :src="book.coverUrl" :alt="book.title" class="w-full h-full object-cover" />
            </div>

            <!-- Availability Tag Desktop -->
            <div class="w-full text-center mb-4">
              <span
                v-if="book.available > 0"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800"
              >
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Tersedia: {{ book.available }} dari {{ book.stock }} Eksemplar
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800"
              >
                Sedang Dipinjam Semua (0 Tersedia)
              </span>
            </div>

            <!-- Quick Metadata Table Desktop -->
            <div class="w-full space-y-2 text-xs border-t border-surface-container pt-4 text-on-surface-variant">
              <div class="flex justify-between">
                <span class="font-medium text-outline">Call Number:</span>
                <span class="font-mono font-bold text-primary">{{ book.callNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium text-outline">Lokasi Rak:</span>
                <span class="font-semibold text-on-surface">{{ book.shelfLocation }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium text-outline">ISBN:</span>
                <span class="font-mono">{{ book.isbn }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium text-outline">Penerbit:</span>
                <span class="text-right truncate max-w-[130px]">{{ book.publisher || 'Penerbit Akademika' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium text-outline">Tahun Terbit:</span>
                <span>{{ book.year }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium text-outline">Tebal:</span>
                <span>{{ book.pages || 350 }} Halaman</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Content & Status Section -->
          <div class="sm:col-span-7 p-4 sm:p-8 flex flex-col justify-between">
            <div>
              <!-- Category & Rating (Desktop only) -->
              <div class="hidden sm:flex items-center gap-3 text-xs mb-2">
                <span class="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-semibold uppercase tracking-wider text-[11px]">
                  {{ book.discipline || book.category?.name }}
                </span>
                <div class="flex items-center gap-1 text-amber-600 font-bold">
                  <span class="material-symbols-outlined text-[16px]">star</span>
                  <span>{{ book.rating }}</span>
                  <span class="text-on-surface-variant/70 text-[11px]">({{ book.reviewsCount }} ulasan)</span>
                </div>
              </div>

              <!-- Desktop Title & Author -->
              <div class="hidden sm:block">
                <h2 class="font-serif font-bold text-xl md:text-2xl text-primary leading-tight mb-1.5">
                  {{ book.title }}
                </h2>
                <p class="text-sm text-secondary font-semibold mb-4">
                  Oleh: {{ book.author }}
                </p>
              </div>

              <!-- Metadata Chips Mobile -->
              <div class="sm:hidden grid grid-cols-2 gap-2 mb-4 p-3 bg-slate-50 rounded-xl text-[11px] border border-slate-200/70">
                <div>
                  <span class="text-slate-400 block text-[9px]">Nomor Panggil:</span>
                  <span class="font-mono font-bold text-primary">{{ book.callNumber }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[9px]">Lokasi Rak:</span>
                  <span class="font-semibold text-slate-700 truncate block">{{ book.shelfLocation }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[9px]">ISBN:</span>
                  <span class="font-mono text-slate-600">{{ book.isbn }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[9px]">Rating Koleksi:</span>
                  <span class="font-bold text-amber-600 flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-xs fill-1">star</span>
                    {{ book.rating }} ({{ book.reviewsCount }} ulasan)
                  </span>
                </div>
              </div>

              <!-- Synopsis Section -->
              <div class="mb-4 sm:mb-6">
                <h3 class="text-xs font-bold uppercase tracking-wider text-outline mb-1.5 sm:mb-2">Sinopsis & Ringkasan</h3>
                <p class="text-xs sm:text-sm text-on-surface-variant leading-relaxed text-justify">
                  {{ book.synopsis }}
                </p>
              </div>
            </div>

            <!-- Availability & Physical Circulation Notice -->
            <div class="border-t border-surface-container-high pt-3 sm:pt-5 mt-2">
              <div v-if="book.available > 0" class="p-3 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1 sm:space-y-2">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-emerald-600 text-base sm:text-lg">check_circle</span>
                  <span class="text-[11px] sm:text-xs font-bold">Status: Tersedia di Perpustakaan ({{ book.available }} Eksemplar)</span>
                </div>
                <p class="text-[10px] sm:text-xs text-emerald-800 leading-relaxed">
                  Peminjaman fisik dilayani di <strong>Meja Sirkulasi</strong>. Silakan kunjungi rak <strong>{{ book.shelfLocation }}</strong> (No: <strong class="font-mono">{{ book.callNumber }}</strong>) lalu tunjukkan KTM ke pustakawan.
                </p>
              </div>

              <div v-else class="p-3 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1 sm:space-y-2">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-rose-600 text-base sm:text-lg">cancel</span>
                  <span class="text-[11px] sm:text-xs font-bold">Status: Sedang Dipinjam Semua</span>
                </div>
                <p class="text-[10px] sm:text-xs text-rose-800 leading-relaxed">
                  Buku ini sedang dipinjam oleh pemustaka lain. Silakan periksa berkala ke petugas sirkulasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Thumb Action Bar -->
      <div class="p-3 sm:p-4 bg-surface-container-lowest border-t border-surface-container shrink-0 safe-bottom">
        <button
          @click="$emit('close')"
          class="w-full py-2.5 sm:py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
        >
          <span class="material-symbols-outlined text-base">check</span>
          <span>Selesai Melihat Buku</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  book: any
}>()

defineEmits(['close'])
</script>
