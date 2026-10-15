<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed bottom-6 right-6 z-50 max-w-md bg-tertiary text-white px-5 py-4 rounded-xl shadow-elevated border border-tertiary-container flex items-start gap-3"
    >
      <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
        <span class="material-symbols-outlined text-lg">check_circle</span>
      </div>
      <div class="flex-1 text-xs">
        <div class="font-bold text-white text-sm mb-0.5">Berhasil!</div>
        <p class="text-on-tertiary-container leading-relaxed">{{ message }}</p>
      </div>
      <button @click="$emit('dismiss')" class="text-on-tertiary-container hover:text-white p-1">
        <span class="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  message: string
}>()

defineEmits(['dismiss'])
</script>
