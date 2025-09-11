<template>
  <div class="text-center text-gray-500 py-8">
    <Icon :name="icon" :class="['mx-auto mb-4 text-gray-300', iconSizeClass]" />
    <p class="text-lg font-medium">{{ title }}</p>
    <p v-if="description" class="text-sm mt-2">{{ description }}</p>
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  description?: string
  iconSize?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'mdi:inbox',
  iconSize: 'lg',
})

const iconSizeClass = computed(() => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }
  return sizes[props.iconSize]
})
</script>
