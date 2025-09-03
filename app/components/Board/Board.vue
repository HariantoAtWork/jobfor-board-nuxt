<template>
  <div class="board-container">
    <!-- Header -->
    <header class="board-header">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <UI.Logo />
          <h1 class="text-xl font-semibold">Job Application Tracker</h1>
        </div>
      </div>
    </header>

    <!-- Board Content -->
    <main
      class="board-content"
      @dragover="handleBoardDragOver"
      @drop="handleBoardDrop"
    >
      <div class="board-columns">
        <BoardColumn
          v-for="column in columns"
          :key="column.id"
          :column="column"
          :cards="getCardsForColumn(cards, column.id)"
          :columns="columns"
          :drag-state="dragState"
          :column-drag-state="columnDragState"
          @dragstart="handleCardDragStart"
          @dragend="handleCardDragEnd"
          @drop="handleCardDrop"
          @addcard="handleAddCard"
          @editcolumn="handleEditColumn"
          @deletecolumn="handleDeleteColumn"
          @cardclick="handleCardClick"
          @editcard="handleEditCard"
          @deletecard="handleDeleteCard"
          @updatecard="handleUpdateCard"
          @addnote="handleAddNote"
          @updatenote="handleUpdateNote"
          @deletenote="handleDeleteNote"
          @columndragstart="handleColumnDragStart"
          @columndragend="handleColumnDragEnd"
          @columndrop="handleColumnDrop"
          @movecard="handleMoveCard"
        />

        <!-- Add Column Button -->
        <button @click="showAddColumnForm = true" class="add-column-button">
          <Icon name="mdi:plus" />&nbsp;Add column
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="board-footer">
      <div class="flex justify-between items-center">
        <div class="footer-actions">
          <button @click="showHistory = true" class="action-button history">
            <Icon name="mdi:history" />
            History
          </button>
          <button @click="exportBoard" class="action-button export">
            <Icon name="mdi:file-export" />
            Export
          </button>
          <button @click="triggerFileImport" class="action-button import">
            <Icon name="mdi:file-import" />
            Import File
          </button>
          <button
            @click="showImportUrlForm = true"
            class="action-button import-url"
          >
            <Icon name="mdi:link" />
            Import from URL
          </button>
          <button @click="onLoadBoard" class="action-button load">
            <Icon name="mdi:download" />
            Load Board
          </button>
          <button @click="onSaveBoard" class="action-button backup">
            <Icon name="mdi:backup" />
            Save Board
          </button>
        </div>
      </div>
    </footer>

    <!-- Hidden file input for import -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="hidden"
      @change="handleFileImport"
    />

    <!-- Add Column Modal -->
    <div
      v-if="showAddColumnForm"
      class="modal-overlay"
      @click="showAddColumnForm = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-medium">Add New Column</h3>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Column Title</label>
            <input
              v-model="newColumnTitle"
              type="text"
              class="form-input"
              placeholder="e.g., Phone Interview"
              @keyup.enter="addColumn"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showAddColumnForm = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="addColumn" class="btn btn-primary">Add Column</button>
        </div>
      </div>
    </div>

    <!-- Import URL Modal -->
    <div
      v-if="showImportUrlForm"
      class="modal-overlay"
      @click="showImportUrlForm = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-medium">Import from URL</h3>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">URL</label>
            <input
              v-model="importUrl"
              type="url"
              class="form-input"
              placeholder="https://..."
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showImportUrlForm = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="importFromUrl" class="btn btn-primary">Import</button>
        </div>
      </div>
    </div>

    <!-- Activity History Modal -->
    <div v-if="showHistory" class="modal-overlay" @click="showHistory = false">
      <div class="modal-content max-w-2xl" @click.stop>
        <div class="modal-header flex item-center justify-between">
          <h3 class="text-lg font-medium">Activity History</h3>
          <button
            @click="showHistory = false"
            class="text-gray-500 hover:text-gray-700 flex items-center justify-center"
          >
            <Icon name="mdi:close" />
          </button>
        </div>
        <div class="modal-body pt-0">
          <div
            v-if="activityHistory.length === 0"
            class="text-center text-gray-500 py-8"
          >
            <svg
              class="w-12 h-12 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>No activity history yet</p>
          </div>
          <div v-else class="space-y-6">
            <div
              v-for="(group, monthYear) in groupedActivityHistory"
              :key="monthYear"
              class="activity-group"
            >
              <div class="activity-group-header">
                <h4 class="text-sm font-semibold text-gray-700">
                  {{ monthYear }}
                </h4>
              </div>
              <div class="activity-group-content">
                <div class="space-y-3">
                  <div
                    v-for="activity in group"
                    :key="activity.id"
                    class="activity-item"
                  >
                    <div class="flex items-start gap-3">
                      <div class="activity-icon">
                        <Icon name="mdi:arrow-down-left" class="-rotate-90" />
                      </div>
                      <div class="activity-content">
                        <div
                          class="text-gray-900 text-sm"
                          v-html="makeHtml(activity.description)"
                        />
                        <p class="text-gray-500 text-xs">
                          {{ formatActivityTime(activity.timestamp) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICard, IColumn, INote, ICardHistory } from '~/types'
import { ref, onMounted, computed } from 'vue'
import { useBoard } from '~/composables/useBoard'
import { exportBoardData, importBoardData } from '~/utils/storage'
import { getCardsForColumn, formatTimeAgo } from '~/utils/helpers'
import makeHtml from '~/utils/makeHtml'
import dayjs from '~/utils/dayjs-extend'

// Board state
const {
  board,
  columns,
  cards,
  dragState,
  columnDragState,
  loadBoard,
  saveBoard,
  replaceBoard,
  addCard,
  deleteCard,
  updateCard,
  moveCardToColumn,
  addColumn: addColumnToBoard,
  updateColumn,
  deleteColumn: deleteColumnFromBoard,
  startDrag,
  endDrag,
  dropCard,
  startColumnDrag,
  endColumnDrag,
  reorderColumns,
  addNoteToCard,
  updateNoteInCard,
  deleteNoteFromCard,
} = useBoard()

// UI state
const showAddColumnForm = ref(false)
const showImportUrlForm = ref(false)
const showHistory = ref(false)
const newColumnTitle = ref('')
const importUrl = ref('')
const fileInput = ref<HTMLInputElement>()

// Load board on mount
onMounted(() => {
  loadBoard()
})

// Card management
const handleAddCard = (cardData: Partial<ICard>, columnId: string) => {
  addCard(cardData, columnId)
}

const handleCardClick = (card: ICard) => {
  // This is now handled in the BoardColumn component
  console.log('Card clicked:', card)
}

const handleEditCard = (card: ICard) => {
  // TODO: Implement card editing modal
  console.log('Edit card:', card)
}

const handleDeleteCard = (cardId: string) => {
  if (confirm('Are you sure you want to delete this card?')) {
    deleteCard(cardId)
  }
}

const handleUpdateCard = (cardId: string, cardData: Partial<ICard>) => {
  updateCard(cardId, cardData)
}

// Note management
const handleAddNote = (
  cardId: string,
  noteData: { title: string; body: string }
) => {
  addNoteToCard(cardId, noteData)
}

const handleUpdateNote = (
  cardId: string,
  noteId: string,
  noteData: Partial<INote>
) => {
  updateNoteInCard(cardId, noteId, noteData)
}

const handleDeleteNote = (cardId: string, noteId: string) => {
  deleteNoteFromCard(cardId, noteId)
}

// Column management
const addColumn = () => {
  if (newColumnTitle.value.trim()) {
    addColumnToBoard(newColumnTitle.value.trim())
    newColumnTitle.value = ''
    showAddColumnForm.value = false
  }
}

const handleEditColumn = (columnId: string, title: string) => {
  updateColumn(columnId, { title })
}

const handleDeleteColumn = (columnId: string) => {
  if (
    confirm(
      'Are you sure you want to delete this column? All cards will be moved to the first column.'
    )
  ) {
    deleteColumnFromBoard(columnId)
  }
}

// Drag and drop
const handleCardDragStart = (card: ICard, columnId: string) => {
  startDrag(card, columnId)
}

const handleCardDragEnd = () => {
  endDrag()
}

const handleCardDrop = (columnId: string) => {
  dropCard(columnId)
}

// Column drag and drop
const handleColumnDragStart = (column: IColumn) => {
  startColumnDrag(column)
}

const handleColumnDragEnd = () => {
  endColumnDrag()
}

const handleColumnDrop = (targetIndex: number) => {
  reorderColumns(targetIndex)
}

// Drop zone for background
const handleBoardDragOver = (event: DragEvent) => {
  event.preventDefault()
  // Add a class to indicate a drop zone
  const mainContent = document.querySelector('.board-content')
  if (mainContent) {
    mainContent.classList.add('drop-over')
  }
}

const handleBoardDrop = (event: DragEvent) => {
  event.preventDefault()
  // Remove the class
  const mainContent = document.querySelector('.board-content')
  if (mainContent) {
    mainContent.classList.remove('drop-over')
  }

  // If we have a dragged card, find the closest column based on mouse position
  if (dragState.value.draggedCard && dragState.value.sourceColumnId) {
    const mouseX = event.clientX
    const columns = document.querySelectorAll('.column')
    let closestColumn: Element | null = null
    let closestDistance = Infinity

    columns.forEach((column) => {
      const rect = column.getBoundingClientRect()
      const columnCenterX = rect.left + rect.width / 2
      const distance = Math.abs(mouseX - columnCenterX)

      if (distance < closestDistance) {
        closestDistance = distance
        closestColumn = column
      }
    })

    if (closestColumn) {
      const columnId = (closestColumn as HTMLElement).getAttribute(
        'data-column-id'
      )
      if (columnId && columnId !== dragState.value.sourceColumnId) {
        dropCard(columnId)
      }
    }
  }
}

// Import/Export
const exportBoard = () => {
  exportBoardData(board.value)
}

const triggerFileImport = () => {
  fileInput.value?.click()
}

const handleFileImport = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    try {
      const importedBoard = await importBoardData(file)
      replaceBoard(importedBoard)
      alert('Board imported successfully!')
    } catch (error) {
      alert('Failed to import file: ' + error)
    }
  }

  // Reset file input
  target.value = ''
}

const importFromUrl = async () => {
  if (!importUrl.value.trim()) return

  try {
    const response = await fetch(importUrl.value)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const { data } = await response.json()

    // Validate the imported data structure (same as importBoardData)
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid board data structure')
    }

    if (!Array.isArray(data.columns) || !Array.isArray(data.cards)) {
      throw new Error('Board must contain columns and cards arrays')
    }

    if (!data.id || typeof data.id !== 'string') {
      throw new Error('Board must have a valid ID')
    }

    // Process the data consistently with file import
    replaceBoard(data)

    alert('Board imported successfully from URL!')
    showImportUrlForm.value = false
    importUrl.value = ''
  } catch (error) {
    console.error('Failed to import from URL:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    alert('Failed to import from URL: ' + errorMessage)
  }
}

const handleMoveCard = (cardId: string, columnId: string) => {
  moveCardToColumn(cardId, columnId)
}

// Activity History
const activityHistory = computed(() => {
  const history: Array<{
    id: string
    description: string
    timestamp: string
  }> = []

  // Collect all card movements from history
  cards.value.forEach((card) => {
    if (card.history && card.history.length > 0) {
      card.history.forEach((entry) => {
        history.push({
          id: entry.id,
          description: `**${card.title}** moved to **${entry.columnTitle}**`,
          timestamp: entry.timestamp,
        })
      })
    }

    // Collect all notes from cards
    if (card.notes && card.notes.length > 0) {
      card.notes.forEach((note) => {
        history.push({
          id: note.id,
          description: `**${card.title}** - 🗒️ Note: **${note.title}**`,
          timestamp: note.createdAt,
        })
      })
    }
  })

  // Sort by timestamp (newest first)
  return history.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
})

const onSaveBoard = async () => {
  try {
    // Prepare board data for saving
    const boardData = board.value

    // Save to API
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boardData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      // alert('Board saved successfully!')
      console.log('Board saved:', result)
    } else {
      throw new Error(result.message || 'Failed to save board')
    }
  } catch (error) {
    console.error('Error saving board:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    alert('Failed to save board: ' + errorMessage)
  }
}

const onLoadBoard = async () => {
  try {
    // Load board data from API
    const response = await fetch('/api/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      // Validate the loaded data structure
      if (!result.data || typeof result.data !== 'object') {
        throw new Error('Invalid board data structure')
      }

      if (
        !Array.isArray(result.data.columns) ||
        !Array.isArray(result.data.cards)
      ) {
        throw new Error('Board must contain columns and cards arrays')
      }

      if (!result.data.id || typeof result.data.id !== 'string') {
        throw new Error('Board must have a valid ID')
      }

      // Replace the current board with loaded data
      replaceBoard(result.data)
      alert('Board loaded successfully!')
      console.log('Board loaded:', result.data)
    } else {
      throw new Error(result.message || 'Failed to load board')
    }
  } catch (error) {
    console.error('Error loading board:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    alert('Failed to load board: ' + errorMessage)
  }
}

const groupedActivityHistory = computed(() => {
  const groups: Record<
    string,
    Array<{
      id: string
      description: string
      timestamp: string
    }>
  > = {}

  activityHistory.value.forEach((activity) => {
    const date = dayjs(activity.timestamp)
    const monthYear = date.format('MMMM YYYY')

    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    groups[monthYear].push(activity)
  })

  return groups
})

const formatActivityTime = (timestamp: string) => {
  const date = dayjs(timestamp)
  return date.format('MMM D, h:mm A')
}
</script>
