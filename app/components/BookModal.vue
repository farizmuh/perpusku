<template>
  <div v-if="book" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
    <div
      class="relative w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-elevated border border-surface-container-high overflow-hidden"
      @click.stop
    >
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface-container-highest/80 hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors"
        aria-label="Tutup Dialog"
      >
        <span class="material-symbols-outlined text-xl">close</span>
      </button>

      <div class="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
        <!-- Left Column: Cover & Bibliographic Meta -->
        <div class="md:col-span-5 bg-surface-container-low p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-surface-container-high">
          <!-- 3:4 Book Cover -->
          <div class="w-48 aspect-[3/4] rounded-lg overflow-hidden shadow-card border border-outline-variant/40 mb-4 bg-surface-container">
            <img :src="book.coverUrl" :alt="book.title" class="w-full h-full object-cover" />
          </div>

          <!-- Availability Tag -->
          <div class="w-full text-center mb-5">
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

          <!-- Quick Metadata Table -->
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
              <span class="text-right truncate max-w-[140px]">{{ book.publisher || 'Penerbit Akademika' }}</span>
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
        <div class="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <!-- Category & Rating -->
            <div class="flex items-center gap-3 text-xs mb-2">
              <span class="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-semibold uppercase tracking-wider text-[11px]">
                {{ book.discipline || book.category?.name }}
              </span>
              <div class="flex items-center gap-1 text-amber-600 font-bold">
                <span class="material-symbols-outlined text-[16px]">star</span>
                <span>{{ book.rating }}</span>
                <span class="text-on-surface-variant/70 text-[11px]">({{ book.reviewsCount }} ulasan pustaka)</span>
              </div>
            </div>

            <!-- Title -->
            <h2 class="font-serif font-bold text-xl md:text-2xl text-primary leading-tight mb-2">
              {{ book.title }}
            </h2>

            <!-- Author -->
            <p class="text-sm text-secondary font-semibold mb-4">
              Oleh: {{ book.author }}
            </p>

            <!-- Synopsis Section -->
            <div class="mb-6">
              <h3 class="text-xs font-bold uppercase tracking-wider text-outline mb-2">Sinopsis & Ringkasan</h3>
              <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed text-justify">
                {{ book.synopsis }}
              </p>
            </div>
          </div>

          <!-- Availability & Physical Circulation Notice -->
          <div class="border-t border-surface-container-high pt-5 mt-4">
            <div v-if="book.available > 0" class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                <span class="text-xs font-bold">Status: Buku Tersedia di Perpustakaan ({{ book.available }} Eksemplar)</span>
              </div>
              <p class="text-xs text-emerald-800 leading-relaxed">
                Peminjaman fisik dilayani langsung oleh pustakawan di <strong>Meja Sirkulasi Perpustakaan</strong>. Silakan kunjungi lokasi rak <strong>{{ book.shelfLocation }}</strong> dengan nomor panggil <strong class="font-mono">{{ book.callNumber }}</strong> dan tunjukkan kartu identitas/KTM Anda ke petugas.
              </p>
            </div>

            <div v-else class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-rose-600 text-lg">cancel</span>
                <span class="text-xs font-bold">Status: Sedang Dipinjam Semua (0 Tersedia)</span>
              </div>
              <p class="text-xs text-rose-800 leading-relaxed">
                Semua eksemplar buku ini saat ini sedang dipinjam oleh pemustaka lain. Anda dapat menanyakan jadwal pengembalian atau melakukan pengecekan berkala ke petugas sirkulasi.
              </p>
            </div>

            <button
              @click="$emit('close')"
              class="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span class="material-symbols-outlined text-base">arrow_back</span>
              <span>Tutup Detail Buku</span>
            </button>
          </div>
        </div>
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
