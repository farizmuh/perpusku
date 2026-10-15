<template>
  <div
    @click="$emit('select-book', book)"
    class="group cursor-pointer bg-surface-container-lowest rounded-xl border border-surface-container-high hover:border-primary-container p-4 transition-all duration-300 hover:shadow-card flex flex-col justify-between"
  >
    <!-- Top Area: Cover 3:4 & Badges -->
    <div>
      <div class="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-surface-container mb-3.5 shadow-sm border border-outline-variant/30">
        <img
          :src="book.coverUrl"
          :alt="book.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <!-- Status Tag Overlay -->
        <div class="absolute top-2.5 left-2.5">
          <span
            v-if="book.available > 0"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide bg-emerald-600/90 backdrop-blur-md text-white shadow-sm"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse"></span>
            <span>Tersedia: {{ book.available }} Eks</span>
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide bg-rose-700/90 backdrop-blur-md text-white shadow-sm"
          >
            <span>Dipinjam Penuh</span>
          </span>
        </div>

        <!-- Call Number Badge Top Right -->
        <div class="absolute top-2.5 right-2.5">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/85 backdrop-blur-md text-white">
            {{ book.callNumber }}
          </span>
        </div>
      </div>

      <!-- Category & Rating -->
      <div class="flex items-center justify-between text-xs mb-1.5 gap-2">
        <span class="text-[11px] font-semibold text-secondary uppercase tracking-wider truncate">
          {{ book.discipline || book.category?.name }}
        </span>
        <div class="flex items-center gap-1 text-amber-600 font-bold shrink-0 text-xs">
          <span class="material-symbols-outlined text-[15px] fill-1">star</span>
          <span>{{ book.rating }}</span>
          <span class="text-on-surface-variant/70 text-[11px]">({{ book.reviewsCount }})</span>
        </div>
      </div>

      <!-- Title in Serif (Merriweather) -->
      <h3 class="font-serif font-bold text-base text-primary group-hover:text-primary-container transition-colors line-clamp-2 leading-snug mb-1">
        {{ book.title }}
      </h3>

      <!-- Author and Year -->
      <p class="text-xs text-on-surface-variant line-clamp-1 mb-2 font-medium">
        {{ book.author }} ({{ book.year }})
      </p>
    </div>

    <!-- Bottom Shelf Location & Action -->
    <div class="pt-3 border-t border-surface-container mt-2 flex items-center justify-between text-xs">
      <div class="flex items-center gap-1 text-on-surface-variant text-[11px]">
        <span class="material-symbols-outlined text-sm text-outline">location_on</span>
        <span class="truncate max-w-[140px]">{{ book.shelfLocation }}</span>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-white transition-colors text-primary font-semibold text-[11px]"
      >
        <span>Detail</span>
        <span class="material-symbols-outlined text-xs">arrow_forward</span>
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
</script>
