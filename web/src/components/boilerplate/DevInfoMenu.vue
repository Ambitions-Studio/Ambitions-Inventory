<script setup lang="ts">
import { mdiMenu, mdiInformation, mdiCheck } from '@/icons'

defineProps<{
  currentView: string
}>()
</script>

<template>
  <div class="absolute top-4 right-4 z-50">
    <VMenu
      open-on-hover
      :close-delay="200"
      :open-delay="100"
      location="bottom end"
      transition="scale-transition"
    >
      <template #activator="{ props }">
        <VBtn
          v-bind="props"
          icon
          size="small"
          color="transparent"
          elevation="0"
          class="bg-charcoal-elegant !border border-gray-400/30 hover:scale-105 transition-transform duration-300 2k:!w-20 2k:!h-20 2k:!min-w-0"
        >
          <VIcon :icon="mdiMenu" color="white" class="2k:!text-3xl" />
        </VBtn>
      </template>

      <VCard
        width="280"
        elevation="0"
        class="bg-charcoal-elegant !border border-gray-400/30 !shadow-2xl"
      >
        <VCardTitle
          class="!text-white !text-sm !font-semibold !py-3 !px-4 flex items-center gap-2 !border-b border-gray-600/30"
        >
          <VIcon :icon="mdiInformation" class="text-blue-400" size="small" />
          Informations Dev
        </VCardTitle>

        <VCardText class="!p-4">
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-300 text-xs">Mode:</span>
              <VChip
                size="x-small"
                class="!bg-green-500/20 !text-green-400 !border border-green-500/30"
                variant="outlined"
              >
                Development
              </VChip>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-gray-300 text-xs">Vue actuelle:</span>
              <VChip
                size="x-small"
                class="!bg-blue-500/20 !text-blue-400 !border border-blue-500/30 !font-mono"
                variant="outlined"
              >
                {{ currentView }}
              </VChip>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-gray-300 text-xs">Vuetify:</span>
              <VChip
                size="x-small"
                class="!bg-green-500/20 !text-green-400 !border border-green-500/30"
                variant="outlined"
                :prepend-icon="mdiCheck"
              >
                Activé
              </VChip>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-gray-300 text-xs">Tailwind:</span>
              <VChip
                size="x-small"
                class="!bg-green-500/20 !text-green-400 !border border-green-500/30"
                variant="outlined"
                :prepend-icon="mdiCheck"
              >
                Activé
              </VChip>
            </div>
          </div>

          <VDivider class="!my-3 !border-gray-600/30" />

          <p class="text-xs text-gray-400">
            Cette interface n'apparaît qu'en mode développement.
          </p>
        </VCardText>
      </VCard>
    </VMenu>
  </div>
</template>
