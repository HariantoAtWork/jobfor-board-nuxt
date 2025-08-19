<template>
  <div
    :class="['card', { dragging: isDragging }]"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @click="openCardDetails"
  >
    <div class="card-header">
      <div class="card-title">{{ card.title }}</div>
      <div v-if="card.company" class="card-company">{{ card.company }}</div>
      <div v-if="card.jobTitle" class="card-job-title">{{ card.jobTitle }}</div>
      <div v-if="card.location" class="card-location">{{ card.location }}</div>
    </div>

    <div v-if="card.via || card.contact" class="card-meta">
      <div v-if="card.via" class="text-gray-500 text-xs mb-1">
        Via: {{ card.via }}
      </div>
      <div v-if="card.contact" class="text-gray-500 text-xs">
        Contact: {{ card.contact }}
      </div>
    </div>

    <div class="card-meta">
      <div v-if="card.link" class="mb-2">
        <a
          :href="formattedLink"
          target="_blank"
          rel="noopener noreferrer"
          class="card-link"
          @click.stop
        >
          View job
        </a>
      </div>
      <div class="card-time">
        {{ formatTimeAgo(card.lastMoved) }} in this stage
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICard } from '~/types'
import { formatTimeAgo } from '~/utils/helpers'

interface Props {
  card: ICard
  isDragging?: boolean
}

interface Emits {
  (e: 'dragstart', card: ICard): void
  (e: 'dragend'): void
  (e: 'click', card: ICard): void
}

const props = withDefaults(defineProps<Props>(), {
  isDragging: false,
})

const emit = defineEmits<Emits>()

// Computed property to format the link with protocol
const formattedLink = computed(() => {
  if (!props.card.link) return ''

  const link = props.card.link.trim()

  // If link already has a protocol, return as is
  if (link.match(/^https?:\/\//)) {
    return link
  }

  // If link starts with www., add https://
  if (link.startsWith('www.')) {
    return `https://${link}`
  }

  // For other cases, add https://
  return `https://${link}`
})

const handleDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', props.card.id)
  }
  emit('dragstart', props.card)
}

const handleDragEnd = () => {
  emit('dragend')
}

const openCardDetails = () => {
  emit('click', props.card)
}
</script>
