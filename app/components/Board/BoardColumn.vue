<template>
  <div
    :class="[
      'column',
      {
        'drag-over': isDragOver || isColumnDragOver,
        dragging:
          columnDragState.isDragging &&
          columnDragState.draggedColumn?.id === column.id,
      },
    ]"
    :data-column-id="column.id"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div
      class="column-header cursor-move"
      draggable="true"
      @dragstart="handleColumnDragStart"
      @dragend="handleColumnDragEnd"
    >
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

    <div class="column-footer">
      <button @click="showAddCardForm = true" class="add-card-button">
        + Add card
      </button>
    </div>

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
              <label class="form-label">Location</label>
              <input
                v-model="newCard.location"
                type="text"
                class="form-input"
                placeholder="e.g., London, Remote, New York"
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

    <!-- Edit Column Modal -->
    <div
      v-if="showEditColumnForm"
      class="modal-overlay"
      @click="showEditColumnForm = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-medium">Edit Column</h3>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Column Title</label>
            <input
              v-model="editColumnData.title"
              type="text"
              class="form-input"
              placeholder="Enter column title"
              @keyup.enter="saveColumnEdit"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showEditColumnForm = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="saveColumnEdit" class="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Card Details Modal -->
    <div
      v-if="showCardDetails && selectedCard"
      class="modal-overlay"
      @click="showCardDetails = false"
    >
      <div class="modal-content max-w-2xl" @click.stop>
        <div class="modal-header">
          <div class="flex items-center justify-between w-full">
            <h3 class="text-lg font-medium">{{ selectedCard.title }}</h3>
            <div class="flex items-center gap-2">
              <button
                v-if="!isEditingCard"
                @click="startEditCard"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                v-if="isEditingCard"
                @click="saveCardEdit"
                class="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Save
              </button>
              <button
                v-if="isEditingCard"
                @click="cancelCardEdit"
                class="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                @click="emit('deletecard', selectedCard.id)"
                class="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
              <button
                @click="showCardDetails = false"
                class="text-gray-500 hover:text-gray-700 flex items-center justify-center"
              >
                <Icon name="mdi:close" />
              </button>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <!-- View Mode -->
          <div v-if="!isEditingCard" class="space-y-4">
            <!-- Company and Job Title -->
            <div class="grid grid-cols-2 gap-1">
              <p
                v-if="selectedCard.company"
                class="text-gray-900 flex items-center gap-1"
                title="Company"
              >
                <Icon name="mdi-light:factory" />{{ selectedCard.company }}
              </p>
              <p
                v-if="selectedCard.jobTitle"
                class="text-gray-900 flex items-center gap-1"
                title="Job Title"
              >
                <Icon name="mdi-light:briefcase" />{{ selectedCard.jobTitle }}
              </p>
              <!-- Location -->
              <p
                v-if="selectedCard.location"
                class="text-gray-900 flex items-center gap-1"
                title="Location"
              >
                <Icon name="mdi-light:map-marker" />{{ selectedCard.location }}
              </p>
              <!-- Via and Contact -->
              <p
                v-if="selectedCard.via"
                class="text-gray-900 flex items-center gap-1"
                title="Via"
              >
                <Icon name="mdi-light:share-variant" />{{ selectedCard.via }}
              </p>
              <p
                v-if="selectedCard.contact"
                class="text-gray-900 flex items-center gap-1"
                title="Contact"
              >
                <Icon name="mdi-light:account" />{{ selectedCard.contact }}
              </p>
              <p
                v-if="selectedCard.link"
                class="text-gray-900 flex items-center gap-1"
                title="Job Link"
              >
                <Icon name="mdi-light:link" />
                <a
                  :href="formattedCardLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 visited:text-purple-600 cursor-alias"
                  @click.stop
                >
                  {{ formattedCardLink }}
                </a>
              </p>
            </div>
            <div
              v-if="selectedCard.description"
              class="text-gray-900 flex flex-col gap-1"
              title="Description"
            >
              <Icon name="mdi-light:comment-text" />
              <div class="p-2 bg-amber-50">
                <div
                  class="text-gray-700 overflow-y-auto"
                  style="min-height: 200px; max-height: calc(50vh - 20rem)"
                  v-html="makeHtml(selectedCard.description)"
                />
              </div>
            </div>

            <CardNotes
              :is-editing="isEditingCard"
              :notes="selectedCard.notes"
              @addnote="handleAddNote"
              @updatenote="handleUpdateNote"
              @deletenote="handleDeleteNote"
            />
            <!-- ######################################################### -->

            <!-- Timestamps -->
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label class="form-label">Created</label>
                <p class="text-gray-600 text-sm">
                  {{ formatTimeAgo(selectedCard.createdAt) }}
                </p>
              </div>
              <div>
                <label class="form-label">Last Moved</label>
                <p class="text-gray-600 text-sm">
                  {{ formatTimeAgo(selectedCard.lastMoved) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="space-y-4">
            <div class="form-group">
              <label class="form-label">Title *</label>
              <input
                v-model="editCardData.title"
                type="text"
                class="form-input"
                placeholder="Job title or application name"
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Company</label>
                <input
                  v-model="editCardData.company"
                  type="text"
                  class="form-input"
                  placeholder="Company name"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Job Title</label>
                <input
                  v-model="editCardData.jobTitle"
                  type="text"
                  class="form-input"
                  placeholder="Specific job title"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Location</label>
              <input
                v-model="editCardData.location"
                type="text"
                class="form-input"
                placeholder="e.g., London, Remote, New York"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Via</label>
                <input
                  v-model="editCardData.via"
                  type="text"
                  class="form-input"
                  placeholder="e.g., Indeed, LinkedIn, Direct"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Contact</label>
                <input
                  v-model="editCardData.contact"
                  type="text"
                  class="form-input"
                  placeholder="Contact person or email"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Job Link</label>
              <input
                v-model="editCardData.link"
                type="url"
                class="form-input"
                placeholder="https://..."
              />
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea
                v-model="editCardData.description"
                class="form-textarea"
                rows="4"
                placeholder="Additional notes or description"
              ></textarea>
            </div>

            <CardNotes
              :is-editing="isEditingCard"
              :notes="selectedCard.notes"
              @addnote="handleAddNote"
              @updatenote="handleUpdateNote"
              @deletenote="handleDeleteNote"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IColumn, ICard, INote } from '~/types'
import { ref, computed } from 'vue'
import { formatTimeAgo } from '~/utils/helpers'
import BoardCard from './BoardCard.vue'
import CardNotes from '../CardNotes.vue'
import makeHtml from '~/utils/makeHtml'

interface Props {
  column: IColumn
  cards: ICard[]
  dragState: {
    isDragging: boolean
    draggedCard: ICard | null
    sourceColumnId: string | null
  }
  columnDragState: {
    isDragging: boolean
    draggedColumn: IColumn | null
    sourceIndex: number
  }
}

interface Emits {
  (e: 'dragstart', card: ICard, columnId: string): void
  (e: 'dragend'): void
  (e: 'drop', columnId: string): void
  (e: 'addcard', cardData: Partial<ICard>, columnId: string): void
  (e: 'editcolumn', columnId: string, title: string): void
  (e: 'deletecolumn', columnId: string): void
  (e: 'cardclick', card: ICard): void
  (e: 'editcard', card: ICard): void
  (e: 'deletecard', cardId: string): void
  (e: 'updatecard', cardId: string, cardData: Partial<ICard>): void
  (
    e: 'addnote',
    cardId: string,
    noteData: { title: string; body: string }
  ): void
  (
    e: 'updatenote',
    cardId: string,
    noteId: string,
    noteData: Partial<INote>
  ): void
  (e: 'deletenote', cardId: string, noteId: string): void
  (e: 'columndragstart', column: IColumn): void
  (e: 'columndragend'): void
  (e: 'columndrop', targetIndex: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showAddCardForm = ref(false)
const showColumnMenu = ref(false)
const showEditColumnForm = ref(false)
const showCardDetails = ref(false)
const isEditingCard = ref(false)
const selectedCard = ref<ICard | null>(null)
const isDragOver = ref(false)
const isColumnDragOver = ref(false)

const newCard = ref({
  title: '',
  company: '',
  jobTitle: '',
  location: '',
  via: '',
  contact: '',
  link: '',
  description: '',
})

const editColumnData = ref({
  title: '',
})

const editCardData = ref({
  title: '',
  company: '',
  jobTitle: '',
  location: '',
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
  if (props.columnDragState.isDragging) {
    isColumnDragOver.value = true
  } else {
    isDragOver.value = true
  }
}

const handleDragLeave = () => {
  isDragOver.value = false
  isColumnDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  isColumnDragOver.value = false

  if (props.columnDragState.isDragging) {
    // Handle column drop - emit the target index
    const columnIndex = Array.from(
      document.querySelectorAll('.column')
    ).indexOf(event.currentTarget as Element)
    emit('columndrop', columnIndex)
  } else {
    // Handle card drop
    emit('drop', props.column.id)
  }
}

const handleCardDragStart = (card: ICard) => {
  emit('dragstart', card, props.column.id)
}

const handleCardDragEnd = () => {
  emit('dragend')
}

const handleColumnDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', props.column.id)
  }
  emit('columndragstart', props.column)
}

const handleColumnDragEnd = () => {
  emit('columndragend')
}

const handleCardClick = (card: ICard) => {
  selectedCard.value = card
  showCardDetails.value = true
  isEditingCard.value = false
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
      location: '',
      via: '',
      contact: '',
      link: '',
      description: '',
    }
  }
}

const editColumn = () => {
  showColumnMenu.value = false
  editColumnData.value.title = props.column.title
  showEditColumnForm.value = true
}

const saveColumnEdit = () => {
  if (editColumnData.value.title.trim()) {
    emit('editcolumn', props.column.id, editColumnData.value.title)
    showEditColumnForm.value = false
    editColumnData.value.title = ''
  }
}

const startEditCard = () => {
  if (selectedCard.value) {
    editCardData.value = {
      title: selectedCard.value.title,
      company: selectedCard.value.company || '',
      jobTitle: selectedCard.value.jobTitle || '',
      location: selectedCard.value.location || '',
      via: selectedCard.value.via || '',
      contact: selectedCard.value.contact || '',
      link: selectedCard.value.link || '',
      description: selectedCard.value.description || '',
    }
    isEditingCard.value = true
  }
}

const saveCardEdit = () => {
  if (editCardData.value.title.trim() && selectedCard.value) {
    emit('updatecard', selectedCard.value.id, editCardData.value)
    // Update the selectedCard with the new data
    if (selectedCard.value) {
      selectedCard.value = {
        ...selectedCard.value,
        ...editCardData.value,
      }
    }
    isEditingCard.value = false
  }
}

const cancelCardEdit = () => {
  isEditingCard.value = false
}

// Computed property to format the link with protocol
const formattedCardLink = computed(() => {
  if (!selectedCard.value?.link) return ''

  const link = selectedCard.value.link.trim()

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

const deleteColumn = () => {
  showColumnMenu.value = false
  emit('deletecolumn', props.column.id)
}

const handleAddNote = (noteData: { title: string; body: string }) => {
  if (selectedCard.value) {
    emit('addnote', selectedCard.value.id, noteData)
  }
}

const handleUpdateNote = (noteId: string, noteData: Partial<INote>) => {
  if (selectedCard.value) {
    emit('updatenote', selectedCard.value.id, noteId, noteData)
  }
}

const handleDeleteNote = (noteId: string) => {
  if (selectedCard.value) {
    emit('deletenote', selectedCard.value.id, noteId)
  }
}
</script>
