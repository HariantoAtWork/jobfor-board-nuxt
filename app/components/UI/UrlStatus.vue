<template>
  <button
    @click.stop="refreshUrlStatus"
    :disabled="urlStatus.isLoading"
    class="ml-1 p-1 rounded hover:bg-gray-100 transition-colors"
    :title="getStatusTooltip()"
  >
    <Icon
      :name="getStatusIcon()"
      :class="[
        iconSizeClass,
        urlStatus.isLoading ? 'animate-spin' : '',
        statusColorClass,
      ]"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUrlStatus } from '~/composables/useUrlStatus'

interface Props {
  url: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const { getUrlStatus, refreshUrlStatus: checkUrlStatus } = useUrlStatus()

const urlStatus = computed(() => {
  return props.url
    ? getUrlStatus(props.url)
    : {
        isAlive: null,
        hasContent: null,
        title: null,
        lastChecked: null,
        isLoading: false,
      }
})

const iconSizeClass = computed(() => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }
  return sizes[props.size]
})

const statusColorClass = computed(() => {
  if (urlStatus.value.isAlive === true && urlStatus.value.hasContent === true) {
    return 'text-green-600'
  }
  if (
    urlStatus.value.isAlive === true &&
    urlStatus.value.hasContent === false
  ) {
    return 'text-yellow-600'
  }
  if (urlStatus.value.isAlive === false) {
    return 'text-red-600'
  }
  return 'text-gray-400'
})

const getStatusIcon = () => {
  if (urlStatus.value.isLoading) return 'mdi:loading'
  if (urlStatus.value.isAlive === true && urlStatus.value.hasContent === true) {
    return 'mdi:check-circle'
  }
  if (
    urlStatus.value.isAlive === true &&
    urlStatus.value.hasContent === false
  ) {
    return 'mdi:alert-circle'
  }
  if (urlStatus.value.isAlive === false) return 'mdi:close-circle'
  return 'mdi:help-circle'
}

const getStatusTooltip = () => {
  if (urlStatus.value.isLoading) return 'Checking URL status...'
  if (urlStatus.value.isAlive === true && urlStatus.value.hasContent === true) {
    return `URL is accessible with content${
      urlStatus.value.title ? `: ${urlStatus.value.title}` : ''
    }`
  }
  if (
    urlStatus.value.isAlive === true &&
    urlStatus.value.hasContent === false
  ) {
    return 'URL is accessible but has no content'
  }
  if (urlStatus.value.isAlive === false) return 'URL is not accessible'
  return 'Click to check URL status'
}

const refreshUrlStatus = async () => {
  if (props.url) {
    await checkUrlStatus(props.url)
  }
}

onMounted(() => {
  if (props.url) {
    checkUrlStatus(props.url)
  }
})
</script>
