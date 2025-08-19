<template>
  <div
    :class="['column', { 'drag-over': isDragOver }]"
    :data-column-id="column.id"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="column-header">
      <div class="flex items-center gap-2">
        <h3 class="column-title">{{ column.title }}</h3>
        <span class="column-count">{{ cards.length }}</span>
      </div>
      <div class="column-menu">
        <button
          @click="showColumnMenu = !showColumnMenu"
          class="text-gray-400 hover:text-gray-600 relative"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
            />
          </svg>

          <!-- Column Menu Dropdown -->
          <div
            v-if="showColumnMenu"
            class="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
          >
            <div class="py-1">
              <button
                @click="editColumn"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Column
              </button>
              <button
                @click="deleteColumn"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete Column
              </button>
            </div>
          </div>
        </button>
      </div>
    </div>

    <div class="cards-container">
      <BoardCard
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :is-dragging="isCardDragging(card.id)"
        @dragstart="handleCardDragStart"
        @dragend="handleCardDragEnd"
        @click="handleCardClick"
      />
    </div>

    <button @click="showAddCardForm = true" class="add-card-button">
      + Add card
    </button>

    <!-- Add Card Modal -->
    <div
      v-if="showAddCardForm"
      class="modal-overlay"
      @click="showAddCardForm = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-medium">Add New Job Application</h3>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addCard">
            <div class="form-group">
              <label class="form-label">Title *</label>
              <input
                v-model="newCard.title"
                type="text"
                class="form-input"
                placeholder="Job title or application name"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Company</label>
              <input
                v-model="newCard.company"
                type="text"
                class="form-input"
                placeholder="Company name"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Job Title</label>
              <input
                v-model="newCard.jobTitle"
                type="text"
                class="form-input"
                placeholder="Specific job title"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Via</label>
              <input
                v-model="newCard.via"
                type="text"
                class="form-input"
                placeholder="e.g., Indeed, LinkedIn, Direct"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Contact</label>
              <input
                v-model="newCard.contact"
                type="text"
                class="form-input"
                placeholder="Contact person or email"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Job Link</label>
              <input
                v-model="newCard.link"
                type="url"
                class="form-input"
                placeholder="https://..."
              />
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea
                v-model="newCard.description"
                class="form-textarea"
                rows="3"
                placeholder="Additional notes or description"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="showAddCardForm = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="addCard" class="btn btn-primary">Add Card</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IColumn, ICard } from '~/types'
import { ref, computed } from 'vue'
import BoardCard from './BoardCard.vue'

interface Props {
  column: IColumn
  cards: ICard[]
  dragState: {
    isDragging: boolean
    draggedCard: ICard | null
    sourceColumnId: string | null
  }
}

interface Emits {
  (e: 'dragstart', card: ICard, columnId: string): void
  (e: 'dragend'): void
  (e: 'drop', columnId: string): void
  (e: 'addcard', cardData: Partial<ICard>, columnId: string): void
  (e: 'editcolumn', columnId: string): void
  (e: 'deletecolumn', columnId: string): void
  (e: 'cardclick', card: ICard): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showAddCardForm = ref(false)
const showColumnMenu = ref(false)
const isDragOver = ref(false)

const newCard = ref({
  title: '',
  company: '',
  jobTitle: '',
  via: '',
  contact: '',
  link: '',
  description: '',
})

const isCardDragging = (cardId: string) => {
  return (
    props.dragState.isDragging && props.dragState.draggedCard?.id === cardId
  )
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  emit('drop', props.column.id)
}

const handleCardDragStart = (card: ICard) => {
  emit('dragstart', card, props.column.id)
}

const handleCardDragEnd = () => {
  emit('dragend')
}

const handleCardClick = (card: ICard) => {
  emit('cardclick', card)
}

const addCard = () => {
  if (newCard.value.title.trim()) {
    emit('addcard', { ...newCard.value }, props.column.id)
    showAddCardForm.value = false
    // Reset form
    newCard.value = {
      title: '',
      company: '',
      jobTitle: '',
      via: '',
      contact: '',
      link: '',
      description: '',
    }
  }
}

const editColumn = () => {
  showColumnMenu.value = false
  emit('editcolumn', props.column.id)
}

const deleteColumn = () => {
  showColumnMenu.value = false
  emit('deletecolumn', props.column.id)
}
</script>
