<template>
  <div
    :class="['card', { dragging: isDragging }]"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @click="openCardDetails"
  >
    <div class="card-header flex items-center justify-between">
      <div class="card-title">{{ card.title }}</div>
      <div class="card-menu relative">
        <button
          @click.stop="toggleMoveMenu"
          class="text-gray-400 hover:text-gray-600 p-1 rounded"
        >
          <Icon name="mdi:dots-vertical" />
        </button>

        <!-- Move to Column Context Menu -->
        <div
          v-if="showMoveMenu"
          class="contextmenu absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48"
        >
          <div
            class="contextmenu-header p-2 border-b border-gray-100 rounded-t-lg bg-purple-800 text-white"
          >
            <h4 class="text-sm font-medium">Move to Column</h4>
          </div>
          <div class="contextmenu-body max-h-60 overflow-y-auto">
            <button
              v-for="column in availableColumns"
              :key="column.id"
              @click="moveToColumn(column.id)"
              class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
              :class="{
                'bg-blue-50 text-blue-700': column.id === card.columnId,
              }"
            >
              <span>{{ column.title }}</span>
              <Icon
                v-if="column.id === card.columnId"
                name="mdi:check"
                class="text-blue-600"
              />
            </button>
          </div>
        </div>
      </div>
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

      <template v-if="card.contact">
        <div
          v-for="(contact, index) in card.contact.split(',')"
          :key="index"
          class="flex items-center text-xs gap-1"
        >
          <Icon name="mdi-light:account" />{{ contact }}
        </div>
      </template>

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

    <div
      class="card-footer flex items-center text-xs gap-1"
      :class="{
        'text-purple-600': ageInThisStage.includes('in'),
      }"
    >
      <Icon name="mdi-light:clock" class="inline-block" />
      {{ ageInThisStage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICard, IColumn } from '~/types'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import nowStore from '~/store/now'
import { formatTime } from '~/utils/dayjs-extend'

interface Props {
  card: ICard
  isDragging?: boolean
  columns: IColumn[]
}

interface Emits {
  (e: 'dragstart', card: ICard): void
  (e: 'dragend'): void
  (e: 'click', card: ICard): void
  (e: 'movecard', cardId: string, columnId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  isDragging: false,
})

const emit = defineEmits<Emits>()

const ageInThisStage = computed(() => {
  return formatTime(props.card.lastMoved, nowStore.now)
})

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

// Move menu functionality
const showMoveMenu = ref(false)

const availableColumns = computed(() => {
  return props.columns.filter((column) => column.id !== props.card.columnId)
})

const toggleMoveMenu = () => {
  showMoveMenu.value = !showMoveMenu.value
}

const moveToColumn = (columnId: string) => {
  emit('movecard', props.card.id, columnId)
  showMoveMenu.value = false
}

// Close menu when clicking outside
const closeMenu = () => {
  showMoveMenu.value = false
}

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>
