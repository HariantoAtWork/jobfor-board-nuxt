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
          @click.stop="showColumnMenu = !showColumnMenu"
          class="text-gray-400 hover:text-gray-600 relative"
        >
          <Icon name="mdi:dots-vertical" />

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
              <hr class="my-1" />
              <button
                @click="showBulkLinksModal = true"
                class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
              >
                Add Bulk Links
              </button>
              <button
                @click="openCopyUrlsModal"
                class="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
              >
                Copy URLs
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
        :columns="columns"
        :is-dragging="isCardDragging(card.id)"
        @dragstart="handleCardDragStart"
        @dragend="handleCardDragEnd"
        @click="handleCardClick"
        @movecard="handleMoveCard"
      />
    </div>

    <div class="column-footer">
      <button
        @click="showAddCardForm = true"
        class="add-card-button flex items-center justify-center"
      >
        <Icon name="mdi:plus" />&nbsp;Add card
      </button>
    </div>

    <!-- Add Card Modal -->
    <UIModal
      :is-open="showAddCardForm"
      title="Add New Job Application"
      size="lg"
      @close="showAddCardForm = false"
      @confirm="addCard"
      :show-confirm-button="true"
      confirm-text="Add Card"
    >
      <form @submit.prevent="addCard">
        <UIFormGroup label="Title" required>
          <UIInput
            v-model="newCard.title"
            type="text"
            placeholder="Job title or application name"
            required
          />
        </UIFormGroup>

        <UIFormGroup label="Company">
          <UIInput
            v-model="newCard.company"
            type="text"
            placeholder="Company name"
          />
        </UIFormGroup>

        <UIFormGroup label="Job Title">
          <UIInput
            v-model="newCard.jobTitle"
            type="text"
            placeholder="Specific job title"
          />
        </UIFormGroup>

        <UIFormGroup label="Location">
          <UIInput
            v-model="newCard.location"
            type="text"
            placeholder="e.g., London, Remote, New York"
          />
        </UIFormGroup>

        <UIFormGroup label="Via">
          <UIInput
            v-model="newCard.via"
            type="text"
            placeholder="e.g., Indeed, LinkedIn, Direct"
          />
        </UIFormGroup>

        <UIFormGroup label="Contact">
          <UIInput
            v-model="newCard.contact"
            type="text"
            placeholder="Contact person or email"
          />
        </UIFormGroup>

        <UIFormGroup label="Job Link">
          <UIInput
            v-model="newCard.link"
            type="url"
            placeholder="https://..."
          />
        </UIFormGroup>

        <UIFormGroup label="Description">
          <UITextarea
            v-model="newCard.description"
            rows="3"
            placeholder="Additional notes or description"
          />
        </UIFormGroup>
      </form>
    </UIModal>

    <!-- Edit Column Modal -->
    <UIModal
      :is-open="showEditColumnForm"
      title="Edit Column"
      @close="showEditColumnForm = false"
      @confirm="saveColumnEdit"
      :show-confirm-button="true"
      confirm-text="Save Changes"
    >
      <UIFormGroup label="Column Title">
        <UIInput
          v-model="editColumnData.title"
          type="text"
          placeholder="Enter column title"
          @keyup.enter="saveColumnEdit"
        />
      </UIFormGroup>
    </UIModal>

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
                class="text-gray-900 grid grid-cols-[1rem_1fr] gap-1 items-center"
                title="Company"
              >
                <Icon name="mdi-light:factory" />{{ selectedCard.company }}
              </p>
              <p
                v-if="selectedCard.jobTitle"
                class="text-gray-900 grid grid-cols-[1rem_1fr] gap-1 items-center"
                title="Job Title"
              >
                <Icon name="mdi-light:briefcase" />{{ selectedCard.jobTitle }}
              </p>
              <!-- Location -->
              <p
                v-if="selectedCard.location"
                class="text-gray-900 grid grid-cols-[1rem_1fr] gap-1 items-center"
                title="Location"
              >
                <Icon name="mdi-light:map-marker" />{{ selectedCard.location }}
              </p>
              <!-- Via and Contact -->
              <p
                v-if="selectedCard.via"
                class="text-gray-900 grid grid-cols-[1rem_1fr] gap-1 items-center"
                title="Via"
              >
                <Icon name="mdi-light:share-variant" />{{ selectedCard.via }}
              </p>

              <template v-if="selectedCard.contact">
                <p
                  v-for="(contact, index) in selectedCard.contact.split(',')"
                  :key="index"
                  class="text-gray-900 grid grid-cols-[1rem_1fr] gap-1 items-center"
                  title="Contact"
                >
                  <Icon name="mdi-light:account" />{{ contact }}
                </p>
              </template>
              <p
                v-if="selectedCard.link"
                class="text-gray-900 grid grid-cols-[1rem_1fr_auto] gap-1 items-center"
                title="Job Link"
              >
                <Icon name="mdi-light:link" class="flex-shrink-0 mt-1" />
                <a
                  :href="formattedCardLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 visited:text-purple-600 cursor-alias break-all"
                  @click.stop
                >
                  {{ formattedCardLink }}
                </a>
                <UIUrlStatus
                  v-if="selectedCard.link"
                  :url="selectedCard.link"
                  size="md"
                />
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
                  class="make-html text-gray-700 overflow-y-auto max-h-8"
                  style="max-height: 8em"
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
                <p class="text-gray-600 card-label">
                  <Icon name="mdi:clock-outline" />{{
                    formatTimeAgo(selectedCard.createdAt)
                  }}
                </p>
              </div>
              <div>
                <label class="form-label">Last Moved</label>
                <p class="text-gray-600 card-label">
                  <Icon name="mdi:clock-outline" />{{
                    formatTimeAgo(selectedCard.lastMoved)
                  }}
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

            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Created</label>
                <input
                  v-model="editCardData.createdAt"
                  type="datetime-local"
                  class="form-input"
                  readonly
                />
              </div>
              <div class="form-group">
                <label class="form-label">Last Moved</label>
                <input
                  v-model="editCardData.lastMoved"
                  type="datetime-local"
                  class="form-input"
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
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Links Modal -->
    <div
      v-if="showBulkLinksModal"
      class="modal-overlay"
      @click="showBulkLinksModal = false"
    >
      <div class="modal-content max-w-2xl" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-medium">Add Bulk Links</h3>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Paste Text with Job Links</label>
            <textarea
              v-model="bulkLinksData.links"
              class="form-textarea"
              rows="8"
              placeholder="Paste any text containing job links (from emails, job boards, documents, etc.)&#10;&#10;Example:&#10;Check out these great opportunities:&#10;https://company.com/job1&#10;https://linkedin.com/jobs/view/123&#10;Also see: https://indeed.com/viewjob?jk=456"
            ></textarea>
            <p class="text-sm text-gray-500 mt-1">
              Paste any text containing job links. The system will automatically
              extract all URLs and fetch their page titles.
            </p>
          </div>

          <!-- Processing Status -->
          <div v-if="bulkLinksData.isLoading" class="mt-4">
            <div class="flex items-center gap-2 text-blue-600">
              <Icon name="mdi:loading" class="animate-spin" />
              <span>Extracting URLs and fetching page titles...</span>
            </div>
          </div>

          <!-- Processed Links Preview -->
          <div v-if="bulkLinksData.processedLinks.length > 0" class="mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
            <div class="max-h-40 overflow-y-auto space-y-2">
              <div
                v-for="(link, index) in bulkLinksData.processedLinks"
                :key="index"
                class="flex items-center gap-2 p-2 border rounded"
                :class="{
                  'border-green-200 bg-green-50': link.status === 'success',
                  'border-red-200 bg-red-50': link.status === 'error',
                  'border-yellow-200 bg-yellow-50': link.status === 'pending',
                }"
              >
                <Icon
                  :name="
                    link.status === 'success'
                      ? 'mdi:check-circle'
                      : link.status === 'error'
                      ? 'mdi:alert-circle'
                      : 'mdi:loading'
                  "
                  :class="{
                    'text-green-600': link.status === 'success',
                    'text-red-600': link.status === 'error',
                    'text-yellow-600 animate-spin': link.status === 'pending',
                  }"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">
                    {{ link.title || link.url }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">{{ link.url }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showBulkLinksModal = false" class="btn btn-secondary">
            Cancel
          </button>
          <button
            @click="processBulkLinks"
            class="btn btn-primary"
            :disabled="!bulkLinksData.links.trim() || bulkLinksData.isLoading"
          >
            {{ bulkLinksData.isLoading ? 'Processing...' : 'Process Links' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Copy URLs Modal -->
    <div
      v-if="showCopyUrlsModal"
      class="modal-overlay"
      @click="showCopyUrlsModal = false"
    >
      <div class="modal-content max-w-2xl" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-medium">Copy URLs from {{ column.title }}</h3>
        </div>
        <div class="modal-body">
          <div
            v-if="cardsWithUrls.length === 0"
            class="text-center text-gray-500 py-8"
          >
            <Icon
              name="mdi:link-off"
              class="w-12 h-12 mx-auto mb-4 text-gray-300"
            />
            <p>No URLs found in this column</p>
            <p class="text-sm mt-2">Add job links to cards to see them here</p>
          </div>
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm text-gray-600">
                Found {{ cardsWithUrls.length }} URL{{
                  cardsWithUrls.length === 1 ? '' : 's'
                }}
                in this column
              </p>
              <button
                @click="copyAllUrls"
                class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
              >
                <Icon name="mdi:content-copy" class="w-4 h-4" />
                Copy All URLs
              </button>
            </div>

            <div class="max-h-96 overflow-y-auto space-y-3">
              <div
                v-for="card in cardsWithUrls"
                :key="card.id"
                class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 truncate">
                      {{ card.title }}
                    </h4>
                    <p
                      v-if="card.company"
                      class="text-sm text-gray-600 truncate"
                    >
                      {{ card.company }}
                    </p>
                    <div class="mt-2">
                      <a
                        :href="formattedUrl(card.link)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-600 hover:text-blue-800 text-sm break-all"
                        @click.stop
                      >
                        {{ formattedUrl(card.link) }}
                      </a>
                    </div>
                  </div>
                  <button
                    @click="copySingleUrl(card.link)"
                    class="text-gray-400 hover:text-gray-600 flex-shrink-0"
                    title="Copy URL"
                  >
                    <Icon name="mdi:content-copy" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showCopyUrlsModal = false" class="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IColumn, ICard, INote } from '~/types'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { formatTimeAgo } from '~/utils/helpers'
import BoardCard from './BoardCard.vue'
import CardNotes from '../CardNotes.vue'
import makeHtml from '~/utils/makeHtml'
import dayjs from '~/utils/dayjs-extend'

interface Props {
  column: IColumn
  cards: ICard[]
  columns: IColumn[]
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
  (e: 'movecard', cardId: string, columnId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showAddCardForm = ref(false)
const showColumnMenu = ref(false)
const showEditColumnForm = ref(false)
const showCardDetails = ref(false)
const showBulkLinksModal = ref(false)
const showCopyUrlsModal = ref(false)
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
  createdAt: '',
  lastMoved: '',
})

const bulkLinksData = ref({
  links: '',
  isLoading: false,
  processedLinks: [] as Array<{
    url: string
    title: string | null
    status: 'pending' | 'success' | 'error'
  }>,
})

// Computed property to get cards with URLs
const cardsWithUrls = computed(() => {
  return props.cards.filter((card) => card.link && card.link.trim())
})

// Helper function to format URLs
const formattedUrl = (url: string) => {
  if (!url) return ''

  const link = url.trim()

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
}

// Copy single URL to clipboard
const copySingleUrl = async (url: string) => {
  try {
    const formatted = formattedUrl(url)
    await navigator.clipboard.writeText(formatted)
    // You could add a toast notification here
    console.log('URL copied to clipboard:', formatted)
  } catch (error) {
    console.error('Failed to copy URL:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = formattedUrl(url)
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

// Copy all URLs to clipboard
const copyAllUrls = async () => {
  try {
    const urls = cardsWithUrls.value
      .map((card) => formattedUrl(card.link || ''))
      .join('\n')
    await navigator.clipboard.writeText(urls)
    console.log('All URLs copied to clipboard')
  } catch (error) {
    console.error('Failed to copy URLs:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = cardsWithUrls.value
      .map((card) => formattedUrl(card.link || ''))
      .join('\n')
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

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

const handleMoveCard = (cardId: string, columnId: string) => {
  emit('movecard', cardId, columnId)
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
    // Convert ISO dates to datetime-local format
    const createdAtLocal = dayjs(selectedCard.value.createdAt).format(
      'YYYY-MM-DDTHH:mm:ss'
    )
    const lastMovedLocal = dayjs(selectedCard.value.lastMoved).format(
      'YYYY-MM-DDTHH:mm:ss'
    )

    editCardData.value = {
      title: selectedCard.value.title,
      company: selectedCard.value.company || '',
      jobTitle: selectedCard.value.jobTitle || '',
      location: selectedCard.value.location || '',
      via: selectedCard.value.via || '',
      contact: selectedCard.value.contact || '',
      link: selectedCard.value.link || '',
      description: selectedCard.value.description || '',
      createdAt: createdAtLocal,
      lastMoved: lastMovedLocal,
    }
    isEditingCard.value = true
  }
}

const saveCardEdit = () => {
  if (editCardData.value.title.trim() && selectedCard.value) {
    // Convert datetime-local format back to ISO format
    const updatedCardData = {
      ...editCardData.value,
      lastMoved: dayjs(editCardData.value.lastMoved).toISOString(),
    }

    emit('updatecard', selectedCard.value.id, updatedCardData)
    // Update the selectedCard with the new data
    if (selectedCard.value) {
      selectedCard.value = {
        ...selectedCard.value,
        ...updatedCardData,
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

const openCopyUrlsModal = () => {
  showCopyUrlsModal.value = true
  showColumnMenu.value = false
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

// Bulk Links functionality
const processBulkLinks = async () => {
  if (!bulkLinksData.value.links.trim()) return

  bulkLinksData.value.isLoading = true
  bulkLinksData.value.processedLinks = []

  // Extract URLs from the full text
  const links = extractUrlsFromText(bulkLinksData.value.links)

  if (links.length === 0) {
    alert(
      'No valid URLs found in the text. Please paste text containing job links.'
    )
    bulkLinksData.value.isLoading = false
    return
  }

  // Initialize processed links with pending status
  bulkLinksData.value.processedLinks = links.map((url) => ({
    url,
    title: '',
    status: 'pending' as const,
  }))

  // Process each link
  for (let i = 0; i < links.length; i++) {
    const link = links[i]
    if (!link) continue // Skip if link is undefined

    try {
      const title = await fetchPageTitle(link)
      bulkLinksData.value.processedLinks[i] = {
        url: link,
        title: title,
        status: 'success' as const,
      }
    } catch (error) {
      console.error(`Failed to fetch title for ${link}:`, error)
      bulkLinksData.value.processedLinks[i] = {
        url: link,
        title: 'Failed to fetch title',
        status: 'error' as const,
      }
    }
  }

  bulkLinksData.value.isLoading = false

  // Create cards for successful links
  const successfulLinks = bulkLinksData.value.processedLinks.filter(
    (link) => link.status === 'success'
  )

  if (successfulLinks.length > 0) {
    for (const link of successfulLinks) {
      emit(
        'addcard',
        {
          title: link.title || 'Untitled',
          link: link.url,
          company: extractCompanyFromUrl(link.url),
          jobTitle: link.title || 'Untitled',
          description: `Imported from: ${link.url}`,
        },
        props.column.id
      )
    }

    showBulkLinksModal.value = false
    bulkLinksData.value.links = ''
    bulkLinksData.value.processedLinks = []

    alert(`Successfully added ${successfulLinks.length} cards to the column!`)
  } else {
    alert('No links could be processed successfully.')
  }
}

// Helper function to extract URLs from text
const extractUrlsFromText = (text: string): string[] => {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi
  const urls = text.match(urlRegex) || []

  // Remove duplicates and validate URLs
  const uniqueUrls = [...new Set(urls)].filter((url) => isValidUrl(url))

  return uniqueUrls
}

// Helper function to validate URLs
const isValidUrl = (string: string): boolean => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// Helper function to fetch page title
const fetchPageTitle = async (url: string): Promise<string | null> => {
  try {
    // Use a CORS proxy or server-side endpoint to fetch the page
    const response = await fetch(
      `/api/fetch-title?url=${encodeURIComponent(url)}`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.title || null
  } catch (error) {
    console.error('Error fetching page title:', error)
    throw error
  }
}

// Helper function to extract company name from URL
const extractCompanyFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname

    // Remove common prefixes and suffixes
    let company = hostname
      .replace(/^www\./, '')
      .replace(/\.(com|co\.uk|org|net|io|dev)$/, '')
      .split('.')[0]

    // Capitalize first letter
    return company
      ? company.charAt(0).toUpperCase() + company.slice(1)
      : 'Unknown Company'
  } catch (_) {
    return 'Unknown Company'
  }
}

// Click outside functionality for column menu
const closeColumnMenu = () => {
  showColumnMenu.value = false
}

const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.column-menu')) {
    closeColumnMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
