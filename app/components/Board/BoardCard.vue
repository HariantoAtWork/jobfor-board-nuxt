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
    </div>

    <div class="card-meta">
      <div v-if="card.company" class="flex items-center text-xs gap-1">
        <Icon name="mdi-light:factory" />{{ card.company }}
      </div>
      <div v-if="card.jobTitle" class="flex items-center text-xs gap-1">
        <Icon name="mdi-light:briefcase" />{{ card.jobTitle }}
      </div>
      <div v-if="card.location" class="flex items-center text-xs gap-1">
        <Icon name="mdi-light:map-marker" />{{ card.location }}
      </div>

      <div v-if="card.contact" class="flex items-center text-xs gap-1">
        <Icon name="mdi-light:account" />{{ card.contact }}
      </div>

      <div v-if="card.link" class="flex items-center text-xs gap-1">
        <Icon name="mdi-light:link" />
        <a
          :href="formattedLink"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 visited:text-purple-600 cursor-alias break-all"
          @click.stop
        >
          View job
        </a>
      </div>
    </div>

    <div v-if="card.via" class="card-meta">
      <div class="flex items-center text-xs gap-1">
        <Icon name="mdi-light:share-variant" />{{ card.via }}
      </div>
    </div>
    <div
      v-if="Array.isArray(card.notes) && card.notes.length"
      class="card-meta"
    >
      <div class="flex items-center text-xs gap-1">
        <Icon name="mdi-light:note" />{{ card.notes.length }} Note{{
          card.notes.length === 1 ? '' : 's'
        }}
      </div>
    </div>

    <div class="card-footer flex items-center text-xs gap-1">
      <Icon name="mdi-light:clock" class="inline-block" />
      {{ formatTimeAgo(card.lastMoved) }} in this stage
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
