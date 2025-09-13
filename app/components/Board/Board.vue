<template>
  <div class="board-container">
    <!-- Menu Bar -->
    <UIMenuBar />

    <!-- Header -->
    <header class="board-header">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <UILogo />
          <h1 class="text-xl font-semibold">Job Application Tracker</h1>
        </div>

        <!-- Undo/Redo Buttons -->
        <UIUndoRedoButtons
          :can-undo="canUndo"
          :can-redo="canRedo"
          :undo-description="undoDescription"
          :redo-description="redoDescription"
          :history="getHistory()"
          @undo="handleUndo"
          @redo="handleRedo"
          @clear-history="clearHistory"
        />
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
          @emptycolumn="handleEmptyColumn"
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
          <div class="relative file-menu-container">
            <button @click="toggleFileMenu" class="action-button file-menu">
              <Icon name="mdi:file-multiple" />
              File
              <Icon name="mdi:chevron-down" class="w-4 h-4" />
            </button>

            <!-- File Context Menu -->
            <div
              v-if="showFileMenu"
              :class="[
                'file-context-menu',
                fileMenuPosition === 'top'
                  ? 'file-context-menu-top'
                  : 'file-context-menu-bottom',
              ]"
            >
              <button @click="triggerFileImport" class="context-menu-item">
                <Icon name="mdi:file-import" class="w-4 h-4" />
                Import File
              </button>
              <button @click="exportBoard" class="context-menu-item">
                <Icon name="mdi:file-export" class="w-4 h-4" />
                Export File
              </button>
              <button
                @click="showImportUrlForm = true"
                class="context-menu-item"
              >
                <Icon name="mdi:link" class="w-4 h-4" />
                Import from URL
              </button>
              <div class="border-t border-gray-200 my-1"></div>
              <button
                @click="handleClearBoard"
                class="context-menu-item text-red-600 hover:bg-red-50"
              >
                <Icon name="mdi:delete-sweep" class="w-4 h-4" />
                Clear Board
              </button>
              <button
                @click="handleDefaultBoard"
                class="context-menu-item text-blue-600 hover:bg-blue-50"
              >
                <Icon name="mdi:refresh" class="w-4 h-4" />
                Default Board
              </button>
            </div>
          </div>

          <div v-if="user" class="relative database-menu-container">
            <button
              @click="toggleDatabaseMenu"
              class="action-button database-menu"
            >
              <Icon name="mdi:database" />
              Database
              <Icon name="mdi:chevron-down" class="w-4 h-4" />
            </button>

            <!-- Database Context Menu -->
            <div
              v-if="showDatabaseMenu"
              :class="[
                'database-context-menu',
                databaseMenuPosition === 'top'
                  ? 'database-context-menu-top'
                  : 'database-context-menu-bottom',
              ]"
            >
              <button @click="onLoadBoard" class="context-menu-item">
                <Icon name="mdi:database-import" class="w-4 h-4" />
                Load Board
              </button>
              <button @click="onSaveBoard" class="context-menu-item">
                <Icon name="mdi:database-export" class="w-4 h-4" />
                Save Board
              </button>
              <div class="border-t border-gray-200 my-1"></div>
              <button @click="onManageBoards" class="context-menu-item">
                <Icon name="mdi:database-cog" class="w-4 h-4" />
                Manage Boards
              </button>
            </div>
          </div>
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
    <UIModal
      :is-open="showAddColumnForm"
      title="Add New Column"
      @close="showAddColumnForm = false"
      @confirm="addColumn"
      :show-confirm-button="true"
      confirm-text="Add Column"
    >
      <UIFormGroup label="Column Title">
        <UIInput
          v-model="newColumnTitle"
          type="text"
          placeholder="e.g., Phone Interview"
          @keyup.enter="addColumn"
        />
      </UIFormGroup>
    </UIModal>

    <!-- Import URL Modal -->
    <UIModal
      :is-open="showImportUrlForm"
      title="Import from URL"
      @close="showImportUrlForm = false"
      @confirm="importFromUrl"
      :show-confirm-button="true"
      confirm-text="Import"
    >
      <UIFormGroup label="URL">
        <UIInput v-model="importUrl" type="url" placeholder="https://..." />
      </UIFormGroup>
    </UIModal>

    <!-- Activity History Modal -->
    <UIModal
      :is-open="showHistory"
      title="Activity History"
      size="2xl"
      @close="showHistory = false"
      :show-footer="false"
    >
      <div v-if="activityHistory.length === 0">
        <UIEmptyState
          icon="mdi:clock-outline"
          title="No activity history yet"
          description="Your board activity will appear here as you move cards and add notes."
        />
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
                    <Icon
                      :name="
                            (activity as any).type === 'note'
                              ? 'mdi:note-text'
                              : 'mdi:arrow-right'
                          "
                      class="w-4 h-4 text-gray-400"
                    />
                  </div>
                  <div class="activity-content">
                    <div
                      class="text-gray-900 text-sm"
                      v-html="makeHtml(activity.description)"
                    />
                    <p
                      class="text-gray-500 text-xs"
                      :class="{
                        'text-purple-600': cardFormatTime(
                          activity.timestamp,
                          nowStore.now
                        ).includes('in'),
                      }"
                    >
                      {{ formatActivityTime(activity.timestamp, nowStore.now) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UIModal>

    <!-- Board Selection Modal -->
    <UIModal
      :is-open="showBoardSelectionModal"
      title="Load Board from Database"
      size="2xl"
      @close="showBoardSelectionModal = false"
      :show-footer="false"
    >
      <div v-if="userBoards.length === 0">
        <UIEmptyState
          icon="mdi:database-off"
          title="No boards found in database"
          description="Create a board by saving your current board first."
        />
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="board in userBoards"
          :key="board.id"
          class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          @click="loadSelectedBoard(board.id)"
        >
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-gray-900">{{ board.title }}</h4>
              <p class="text-sm text-gray-500">
                Created:
                {{ new Date(board.created_at).toLocaleDateString() }}
              </p>
              <p class="text-sm text-gray-500">
                Cards: {{ board.data.cards?.length || 0 }} | Columns:
                {{ board.data.columns?.length || 0 }}
              </p>
            </div>
            <Icon name="mdi:chevron-right" class="text-gray-400" />
          </div>
        </div>
      </div>
    </UIModal>

    <!-- Board Management Modal -->
    <div
      v-if="showBoardManagementModal"
      class="modal-overlay"
      @click="showBoardManagementModal = false"
    >
      <div class="modal-content max-w-4xl" @click.stop>
        <div class="modal-header flex items-center justify-between">
          <h3 class="text-lg font-medium">Manage Database Boards</h3>
          <button
            @click="showBoardManagementModal = false"
            class="text-gray-500 hover:text-gray-700 flex items-center justify-center"
          >
            <Icon name="mdi:close" />
          </button>
        </div>
        <div class="modal-body pt-0">
          <div
            v-if="userBoards.length === 0"
            class="text-center text-gray-500 py-8"
          >
            <Icon
              name="mdi:database-off"
              class="w-12 h-12 mx-auto mb-4 text-gray-300"
            />
            <p>No boards found in database</p>
            <p class="text-sm mt-2">
              Create a board by saving your current board first.
            </p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="board in userBoards"
              :key="board.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <h4 class="font-medium text-gray-900">{{ board.title }}</h4>
                    <div class="flex items-center gap-1">
                      <Icon
                        v-if="board.is_public"
                        name="mdi:eye"
                        class="w-4 h-4 text-green-600"
                        title="Publicly shared"
                      />
                      <Icon
                        v-else
                        name="mdi:eye-off"
                        class="w-4 h-4 text-gray-400"
                        title="Private"
                      />
                    </div>
                  </div>
                  <p class="text-sm text-gray-500">
                    Created:
                    {{ new Date(board.created_at).toLocaleDateString() }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Last updated:
                    {{ new Date(board.updated_at).toLocaleDateString() }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Cards: {{ board.data.cards?.length || 0 }} | Columns:
                    {{ board.data.columns?.length || 0 }}
                  </p>

                  <!-- Sharing Controls -->
                  <div class="mt-3 space-y-2">
                    <!-- Allow View Share Toggle -->
                    <div class="flex items-center gap-2">
                      <label class="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          :checked="board.is_public"
                          @change="
                            toggleBoardPublicAccess(
                              board.id,
                              ($event.target as HTMLInputElement)?.checked ||
                                false
                            )
                          "
                          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="text-gray-700">Allow View Share</span>
                      </label>
                    </div>

                    <!-- Share Button -->
                    <div class="flex items-center gap-2">
                      <button
                        @click="shareBoard(board)"
                        class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                      >
                        <Icon name="mdi:share" class="w-4 h-4" />
                        Share
                      </button>
                      <button
                        v-if="board.is_public && board.share_token"
                        @click="revokeShareToken(board.id)"
                        class="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors flex items-center gap-1"
                      >
                        <Icon name="mdi:link-off" class="w-4 h-4" />
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2 ml-4">
                  <button
                    @click="loadSelectedBoard(board.id)"
                    class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Load
                  </button>
                  <button
                    @click="deleteBoard(board.id)"
                    class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Board Modal -->
    <UIModal
      :is-open="showSaveBoardModal"
      title="Save Board to Database"
      size="lg"
      @close="showSaveBoardModal = false"
      @confirm="saveBoardToDatabase"
      :show-confirm-button="true"
      :confirm-disabled="
        saveType === 'overwrite' &&
        (!selectedBoardId || userBoards.length === 0)
      "
      :confirm-text="saveType === 'new' ? 'Create Board' : 'Overwrite Board'"
    >
      <!-- Save Type Selection -->
      <UIFormGroup label="Save Type">
        <div class="space-y-2">
          <label class="flex items-center">
            <input v-model="saveType" type="radio" value="new" class="mr-2" />
            <span>Create New Board</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="saveType"
              type="radio"
              value="overwrite"
              class="mr-2"
            />
            <span>Overwrite Existing Board</span>
          </label>
        </div>
      </UIFormGroup>

      <!-- New Board Title (only show when creating new) -->
      <UIFormGroup
        v-if="saveType === 'new'"
        label="Board Title"
        help-text="Leave empty to use creation date as title"
      >
        <UIInput
          v-model="newBoardTitle"
          type="text"
          :placeholder="new Date().toISOString()"
        />
      </UIFormGroup>

      <!-- Existing Board Selection (only show when overwriting) -->
      <UIFormGroup
        v-if="saveType === 'overwrite'"
        label="Select Board to Overwrite"
      >
        <div v-if="userBoards.length === 0">
          <UIEmptyState
            icon="mdi:database-off"
            title="No existing boards found"
            description="Create a new board instead"
            icon-size="md"
          />
        </div>
        <UISelect
          v-else
          v-model="selectedBoardId"
          :options="
            userBoards.map((board) => ({
              value: board.id,
              label: `${board.title} (${new Date(
                board.created_at
              ).toLocaleDateString()})`,
            }))
          "
          placeholder="Select a board to overwrite..."
          required
        />
      </UIFormGroup>
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import type { ICard, IColumn, INote, ICardHistory } from '~/types'
import { useBoardWithCommands } from '~/composables/useBoardWithCommands'
import { onMounted, onUnmounted } from 'vue'
import { exportBoardData, importBoardData } from '~/utils/storage'
import { getCardsForColumn, formatTimeAgo } from '~/utils/helpers'
import { validateAndSanitizeBoardData } from '~/utils/dataValidator'
import makeHtml from '~/utils/makeHtml'
import dayjs from '~/utils/dayjs-extend'
import user from '~/utils/user'
import nowStore from '~/store/now'
import {
  formatTime as cardFormatTime,
  formatActivityTime,
} from '~/utils/dayjs-extend'

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
  clearBoard,
  defaultBoard,
  // Command pattern properties
  canUndo,
  canRedo,
  undoDescription,
  redoDescription,
  undo,
  redo,
  clearHistory,
  getHistory,
} = useBoardWithCommands()

// UI state
const showAddColumnForm = ref(false)
const showImportUrlForm = ref(false)
const showHistory = ref(false)
const showFileMenu = ref(false)
const showDatabaseMenu = ref(false)
const showBoardSelectionModal = ref(false)
const showBoardManagementModal = ref(false)
const showSaveBoardModal = ref(false)
const newColumnTitle = ref('')
const importUrl = ref('')
const fileInput = ref<HTMLInputElement>()
const menuPosition = ref<'top' | 'bottom'>('bottom')
const fileMenuPosition = ref<'top' | 'bottom'>('bottom')
const databaseMenuPosition = ref<'top' | 'bottom'>('bottom')
const userBoards = ref<any[]>([])
const selectedBoardId = ref('')
const newBoardTitle = ref('')
const saveType = ref<'new' | 'overwrite'>('new')

// Load board on mount
onMounted(() => {
  loadBoard()

  // Add click-outside handler for menus
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.file-menu-container')) {
      showFileMenu.value = false
    }
    if (!target.closest('.database-menu-container')) {
      showDatabaseMenu.value = false
    }
  })
})

// Card management
const handleAddCard = (cardData: Partial<ICard>, columnId: string) => {
  addCard(cardData, columnId)
}

const handleCardClick = (card: ICard) => {
  // This is now handled in the BoardColumn component
  console.log('Card clicked:', card)
}

// Undo/Redo handlers
const handleUndo = async () => {
  await undo()
}

const handleRedo = async () => {
  await redo()
}

// Keyboard shortcuts
const handleKeydown = async (event: KeyboardEvent) => {
  // Check if we're in an input field (don't trigger shortcuts)
  const target = event.target as HTMLElement
  if (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.contentEditable === 'true'
  ) {
    return
  }

  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'z':
        event.preventDefault()
        if (event.shiftKey) {
          // Ctrl+Shift+Z or Cmd+Shift+Z for redo
          await handleRedo()
        } else {
          // Ctrl+Z or Cmd+Z for undo
          await handleUndo()
        }
        break
      case 'y':
        event.preventDefault()
        // Ctrl+Y or Cmd+Y for redo
        await handleRedo()
        break
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

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

const handleEmptyColumn = (columnId: string) => {
  // Get all cards in this column
  const cardsInColumn = cards.value.filter((card) => card.columnId === columnId)

  // Delete each card in the column
  cardsInColumn.forEach((card) => {
    deleteCard(card.id)
  })
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

    const responseData = await response.json()

    // Handle different response formats
    let data = responseData
    if (responseData.data) {
      data = responseData.data
    }

    // Use the same validation as file import
    const validated = validateAndSanitizeBoardData(data)

    if (validated) {
      replaceBoard(validated)
      alert('Board imported successfully from URL!')
      showImportUrlForm.value = false
      importUrl.value = ''
    } else {
      throw new Error(
        'Invalid board data structure - data could not be sanitized'
      )
    }
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

const toggleFileMenu = () => {
  if (showFileMenu.value) {
    showFileMenu.value = false
  } else {
    // Calculate if menu should appear above or below
    const button = document.querySelector('.file-menu-container button')
    if (button) {
      const rect = button.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const menuHeight = 100 // Approximate height of the context menu

      // If there's not enough space below, show above
      if (rect.bottom + menuHeight > viewportHeight) {
        fileMenuPosition.value = 'top'
      } else {
        fileMenuPosition.value = 'bottom'
      }
    }
    showFileMenu.value = true
  }
}

const toggleDatabaseMenu = () => {
  if (showDatabaseMenu.value) {
    showDatabaseMenu.value = false
  } else {
    // Calculate if menu should appear above or below
    const button = document.querySelector('.database-menu-container button')
    if (button) {
      const rect = button.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const menuHeight = 120 // Approximate height of the context menu

      // If there's not enough space below, show above
      if (rect.bottom + menuHeight > viewportHeight) {
        databaseMenuPosition.value = 'top'
      } else {
        databaseMenuPosition.value = 'bottom'
      }
    }
    showDatabaseMenu.value = true
  }
}

// File menu actions
const handleClearBoard = () => {
  if (
    confirm(
      'Are you sure you want to clear the entire board? This will remove all cards and columns. This action cannot be undone.'
    )
  ) {
    clearBoard()
    showFileMenu.value = false
    alert('Board cleared successfully!')
  }
}

const handleDefaultBoard = () => {
  if (
    confirm(
      'Are you sure you want to reset the board to default? This will remove all your current data and cannot be undone.'
    )
  ) {
    defaultBoard()
    showFileMenu.value = false
    alert('Board reset to default successfully!')
  }
}

// Activity History
const activityHistory = computed(() => {
  const history: Array<{
    id: string
    description: string
    timestamp: string
    type: 'movement' | 'note'
  }> = []

  // Collect all card movements from history
  cards.value.forEach((card: any) => {
    if (card.history && card.history.length > 0) {
      card.history.forEach((entry: any) => {
        history.push({
          id: entry.id,
          description: `**${card.title}** moved to **${entry.columnTitle}**`,
          timestamp: entry.timestamp,
          type: 'movement',
        })
      })
    }

    // Collect all notes from cards
    if (card.notes && card.notes.length > 0) {
      card.notes.forEach((note: any) => {
        history.push({
          id: note.id,
          description: `**${card.title}** - 🗒️ Note: **${note.title}**`,
          timestamp: note.createdAt,
          type: 'note',
        })
      })
    }
  })

  // Sort by timestamp (newest first)
  return history.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
})

// Database menu actions
const onLoadBoard = async () => {
  try {
    // Fetch user's boards
    const response = await fetch('/api/boards', {
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
      userBoards.value = result.data
      showBoardSelectionModal.value = true
      showDatabaseMenu.value = false
    } else {
      throw new Error(result.message || 'Failed to load boards')
    }
  } catch (error) {
    console.error('Error loading boards:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    alert('Failed to load boards: ' + errorMessage)
  }
}

const onSaveBoard = async () => {
  try {
    // Load existing boards for overwrite option
    const response = await fetch('/api/boards', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data) {
        userBoards.value = result.data
      }
    }

    // Auto-select overwrite mode and board if only one exists
    if (userBoards.value.length === 1) {
      saveType.value = 'overwrite'
      selectedBoardId.value = userBoards.value[0].id
      newBoardTitle.value = ''
    } else {
      // Reset form state for multiple boards or no boards
      saveType.value = 'new'
      newBoardTitle.value = ''
      selectedBoardId.value = ''
    }

    showSaveBoardModal.value = true
    showDatabaseMenu.value = false
  } catch (error) {
    console.error('Error loading boards for save:', error)
    // Still show modal even if loading boards fails
    showSaveBoardModal.value = true
    showDatabaseMenu.value = false
  }
}

const saveBoardToDatabase = async () => {
  try {
    // Prepare board data for saving
    const boardData = board.value
    let response: Response
    let result: any

    if (saveType.value === 'new') {
      // Create new board
      const boardTitle = newBoardTitle.value || new Date().toISOString()

      response = await fetch('/api/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: boardTitle,
          data: boardData,
        }),
      })

      result = await response.json()

      if (result.success) {
        alert('New board created successfully!')
        console.log('Board created:', result)
      } else {
        throw new Error(result.message || 'Failed to create board')
      }
    } else {
      // Overwrite existing board
      if (!selectedBoardId.value) {
        throw new Error('Please select a board to overwrite')
      }

      // Get the selected board to preserve its title
      const selectedBoard = userBoards.value.find(
        (b) => b.id === selectedBoardId.value
      )
      const boardTitle = selectedBoard?.title || new Date().toISOString()

      response = await fetch(`/api/boards/${selectedBoardId.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: boardTitle,
          data: boardData,
        }),
      })

      result = await response.json()

      if (result.success) {
        alert('Board overwritten successfully!')
        console.log('Board overwritten:', result)
      } else {
        throw new Error(result.message || 'Failed to overwrite board')
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Close modal and reset form
    showSaveBoardModal.value = false
    newBoardTitle.value = ''
    selectedBoardId.value = ''
    saveType.value = 'new'
  } catch (error) {
    console.error('Error saving board:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    alert('Failed to save board: ' + errorMessage)
  }
}

const onManageBoards = async () => {
  try {
    // Fetch user's boards
    const response = await fetch('/api/boards', {
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
      userBoards.value = result.data
      showBoardManagementModal.value = true
      showDatabaseMenu.value = false
    } else {
      throw new Error(result.message || 'Failed to load boards')
    }
  } catch (error) {
    console.error('Error loading boards:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    alert('Failed to load boards: ' + errorMessage)
  }
}

const loadSelectedBoard = async (boardId: string) => {
  try {
    const response = await fetch(`/api/boards/${boardId}`, {
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
      // Use the same validation as file and URL import
      const validated = validateAndSanitizeBoardData(result.data.data)

      if (validated) {
        replaceBoard(validated)
        alert('Board loaded successfully!')
        console.log('Board loaded:', validated)
        showBoardSelectionModal.value = false
      } else {
        throw new Error(
          'Invalid board data structure - data could not be sanitized'
        )
      }
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

const deleteBoard = async (boardId: string) => {
  if (
    !confirm(
      'Are you sure you want to delete this board? This action cannot be undone.'
    )
  ) {
    return
  }

  try {
    const response = await fetch(`/api/boards/${boardId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      alert('Board deleted successfully!')
      // Refresh the boards list
      await onManageBoards()
    } else {
      throw new Error(result.message || 'Failed to delete board')
    }
  } catch (error) {
    console.error('Error deleting board:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    alert('Failed to delete board: ' + errorMessage)
  }
}

// Sharing functions
const shareBoard = async (board: any) => {
  try {
    // If board is not public, make it public first
    if (!board.is_public) {
      await toggleBoardPublicAccess(board.id, true)
    }

    // Generate share token
    const response = await fetch(`/api/boards/${board.id}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      // Copy share URL to clipboard
      await navigator.clipboard.writeText(result.data.share_url)
      alert(`Share link copied to clipboard!\n\n${result.data.share_url}`)

      // Refresh the boards list to show updated sharing status
      await onManageBoards()
    } else {
      throw new Error(result.message || 'Failed to generate share link')
    }
  } catch (error) {
    console.error('Error sharing board:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    alert('Failed to share board: ' + errorMessage)
  }
}

const toggleBoardPublicAccess = async (boardId: string, isPublic: boolean) => {
  try {
    const response = await fetch(`/api/boards/${boardId}/public`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_public: isPublic,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      // Update the board in the local list
      const boardIndex = userBoards.value.findIndex((b) => b.id === boardId)
      if (boardIndex !== -1) {
        userBoards.value[boardIndex].is_public = isPublic
      }

      if (isPublic) {
        alert('Board is now publicly accessible!')
      } else {
        alert('Board is now private!')
      }
    } else {
      throw new Error(result.message || 'Failed to update board access')
    }
  } catch (error) {
    console.error('Error toggling board public access:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    alert('Failed to update board access: ' + errorMessage)
  }
}

const revokeShareToken = async (boardId: string) => {
  if (
    !confirm(
      'Are you sure you want to revoke the share link? This will make the board private and invalidate the current share link.'
    )
  ) {
    return
  }

  try {
    const response = await fetch(`/api/boards/${boardId}/share`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      alert('Share link revoked successfully!')
      // Refresh the boards list
      await onManageBoards()
    } else {
      throw new Error(result.message || 'Failed to revoke share link')
    }
  } catch (error) {
    console.error('Error revoking share token:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    alert('Failed to revoke share link: ' + errorMessage)
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

  activityHistory.value.forEach((activity: any) => {
    const date = dayjs(activity.timestamp)
    const monthYear = date.format('MMMM YYYY')

    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    groups[monthYear].push(activity)
  })

  return groups
})
</script>
