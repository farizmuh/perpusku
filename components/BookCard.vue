<template>
  <div
    @click="$emit('select-book', book)"
    class="group cursor-pointer bg-surface-container-lowest rounded-xl sm:rounded-2xl border border-surface-container-high hover:border-primary-container p-2.5 sm:p-4 transition-all duration-300 hover:shadow-card flex flex-col justify-between"
  >
    <!-- Top Area: Cover 3:4 & Badges -->
    <div>
      <div class="relative w-full aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden bg-surface-container mb-2 sm:mb-3.5 shadow-xs border border-outline-variant/30">
        <img
          v-if="!imgFailed && book.coverUrl"
          :src="book.coverUrl"
          :alt="book.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          @error="imgFailed = true"
        />
        <div
          v-else
          class="w-full h-full bg-linear-to-br from-primary-container/20 via-surface-container to-surface-container-high flex flex-col items-center justify-center p-3 text-center"
        >
          <span class="material-symbols-outlined text-3xl sm:text-4xl text-primary/40 mb-1.5">auto_stories</span>
          <span class="text-[9px] sm:text-[10px] font-serif font-bold text-primary line-clamp-2 leading-tight">{{ book.title }}</span>
        </div>

        <!-- Status Tag Overlay (Top Left) -->
        <div class="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 z-10 pointer-events-none">
          <span
            v-if="book.available > 0"
            class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded sm:rounded-md text-[9px] sm:text-[10px] font-bold tracking-wide bg-emerald-600/95 backdrop-blur-md text-white shadow-xs"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse"></span>
            <span>Tersedia: {{ book.available }}</span>
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded sm:rounded-md text-[9px] sm:text-[10px] font-bold tracking-wide bg-rose-700/95 backdrop-blur-md text-white shadow-xs"
          >
            <span>Dipinjam</span>
          </span>
        </div>

        <!-- Call Number Badge (Bottom Right) -->
        <div class="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 z-10 pointer-events-none">
          <span class="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-primary/90 backdrop-blur-md text-white shadow-xs max-w-[85px] sm:max-w-none truncate inline-block">
            {{ book.callNumber }}
          </span>
        </div>
      </div>

      <!-- Category & Rating -->
      <div class="flex items-center justify-between text-[10px] sm:text-xs mb-1 gap-1">
        <span class="font-semibold text-secondary uppercase tracking-wider truncate text-[9px] sm:text-[11px]">
          {{ book.discipline || book.category?.name }}
        </span>
        <div class="flex items-center gap-0.5 text-amber-600 font-bold shrink-0 text-[10px] sm:text-xs">
          <span class="material-symbols-outlined text-[13px] sm:text-[15px] fill-1">star</span>
          <span>{{ book.rating }}</span>
        </div>
      </div>

      <!-- Title in Serif (Merriweather) -->
      <h3 class="font-serif font-bold text-xs sm:text-base text-primary group-hover:text-primary-container transition-colors line-clamp-2 leading-tight sm:leading-snug mb-1">
        {{ book.title }}
      </h3>

      <!-- Author and Year -->
      <p class="text-[10px] sm:text-xs text-on-surface-variant line-clamp-1 mb-1.5 sm:mb-2 font-medium">
        {{ book.author }} ({{ book.year }})
      </p>
    </div>

    <!-- Bottom Shelf Location & Action -->
    <div class="pt-2 sm:pt-3 border-t border-surface-container mt-1 sm:mt-2 flex items-center justify-between text-[10px] sm:text-xs">
      <div class="flex items-center gap-1 text-on-surface-variant text-[10px] sm:text-[11px] truncate">
        <span class="material-symbols-outlined text-xs sm:text-sm text-outline shrink-0">location_on</span>
        <span class="truncate max-w-[70px] xs:max-w-[90px] sm:max-w-[140px]">{{ book.shelfLocation }}</span>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded bg-surface-container hover:bg-primary hover:text-white transition-colors text-primary font-semibold text-[10px] sm:text-[11px] shrink-0"
      >
        <span>Detail</span>
        <span class="material-symbols-outlined text-[10px] sm:text-xs">arrow_forward</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  book: {
    id: number
    title: string
    author: string
    isbn: string
    publisher?: string
    year: number
    callNumber: string
    shelfLocation: string
    coverUrl: string
    synopsis: string
    available: number
    stock: number
    rating: number
    reviewsCount: number
    discipline?: string
    category?: { name: string; slug: string }
  }
}>()

defineEmits(['select-book'])

const imgFailed = ref(false)
</script>
