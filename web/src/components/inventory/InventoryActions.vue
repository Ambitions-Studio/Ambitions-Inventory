<script setup lang="ts">
import IconButton from '@/components/common/IconButton.vue'

defineEmits<{
  openSettings: []
  openWardrobe: []
}>()
</script>

<template>
  <div class="flex gap-3 justify-end px-5">
    <IconButton icon="👕" label="Wardrobe" @click="$emit('openWardrobe')" />
    <IconButton icon="⚙️" label="Settings" @click="$emit('openSettings')" />
  </div>
</template>
