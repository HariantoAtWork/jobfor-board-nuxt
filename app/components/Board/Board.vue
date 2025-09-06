<template>
  <div class="board-container">
    <!-- Menu Bar -->
    <UIMenuBar />

    <!-- Header -->
    <header class="board-header">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <UILogo />
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

    <!-- Board Selection Modal -->
    <div
      v-if="showBoardSelectionModal"
      class="modal-overlay"
      @click="showBoardSelectionModal = false"
    >
      <div class="modal-content max-w-2xl" @click.stop>
        <div class="modal-header flex items-center justify-between">
          <h3 class="text-lg font-medium">Load Board from Database</h3>
          <button
            @click="showBoardSelectionModal = false"
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
        </div>
      </div>
    </div>

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
    <div
      v-if="showSaveBoardModal"
      class="modal-overlay"
      @click="showSaveBoardModal = false"
    >
      <div class="modal-content max-w-lg" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-medium">Save Board to Database</h3>
        </div>
        <div class="modal-body">
          <!-- Save Type Selection -->
          <div class="form-group">
            <label class="form-label">Save Type</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="saveType"
                  type="radio"
                  value="new"
                  class="mr-2"
                />
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
          </div>

          <!-- New Board Title (only show when creating new) -->
          <div v-if="saveType === 'new'" class="form-group">
            <label class="form-label">Board Title</label>
            <input
              v-model="newBoardTitle"
              type="text"
              class="form-input"
              :placeholder="new Date().toISOString()"
            />
            <p class="text-sm text-gray-500 mt-1">
              Leave empty to use creation date as title
            </p>
          </div>

          <!-- Existing Board Selection (only show when overwriting) -->
          <div v-if="saveType === 'overwrite'" class="form-group">
            <label class="form-label">Select Board to Overwrite</label>
            <div
              v-if="userBoards.length === 0"
              class="text-center text-gray-500 py-4"
            >
              <Icon
                name="mdi:database-off"
                class="w-8 h-8 mx-auto mb-2 text-gray-300"
              />
              <p class="text-sm">No existing boards found</p>
              <p class="text-xs mt-1">Create a new board instead</p>
            </div>
            <select
              v-else
              v-model="selectedBoardId"
              class="form-input"
              required
            >
              <option value="">Select a board to overwrite...</option>
              <option
                v-for="board in userBoards"
                :key="board.id"
                :value="board.id"
              >
                {{ board.title }} ({{
                  new Date(board.created_at).toLocaleDateString()
                }})
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showSaveBoardModal = false" class="btn btn-secondary">
            Cancel
          </button>
          <button
            @click="saveBoardToDatabase"
            class="btn btn-primary"
            :disabled="
              saveType === 'overwrite' &&
              (!selectedBoardId || userBoards.length === 0)
            "
          >
            {{ saveType === 'new' ? 'Create Board' : 'Overwrite Board' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICard, IColumn, INote, ICardHistory } from '~/types'
import { useBoard } from '~/composables/useBoard'
import { exportBoardData, importBoardData } from '~/utils/storage'
import { getCardsForColumn, formatTimeAgo } from '~/utils/helpers'
import { validateAndSanitizeBoardData } from '~/utils/dataValidator'
import makeHtml from '~/utils/makeHtml'
import dayjs from '~/utils/dayjs-extend'
import user from '~/utils/user'

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
} = useBoard()

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
  }> = []

  // Collect all card movements from history
  cards.value.forEach((card: any) => {
    if (card.history && card.history.length > 0) {
      card.history.forEach((entry: any) => {
        history.push({
          id: entry.id,
          description: `**${card.title}** moved to **${entry.columnTitle}**`,
          timestamp: entry.timestamp,
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

    // Reset form state
    saveType.value = 'new'
    newBoardTitle.value = ''
    selectedBoardId.value = ''

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

const formatActivityTime = (timestamp: string) => {
  const date = dayjs(timestamp)
  return date.format('MMM D, h:mm A')
}
</script>
