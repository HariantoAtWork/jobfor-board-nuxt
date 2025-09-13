import { ref, computed } from 'vue'
import type { IBoardData, ICard, IColumn, INote, DragState } from '~/types'
import type { Command } from '~/types/commands'
import { getDefaultBoardData, generateId, moveCard } from '~/utils/helpers'
import {
  saveBoardToStorage,
  loadBoardFromStorage,
  resetToDefault,
  clearCorruptedData,
} from '~/utils/storage'
import { CommandHistoryManagerImpl } from '~/utils/commandHistoryManager'
import {
  AddCardCommand,
  UpdateCardCommand,
  MoveCardCommand,
  DeleteCardCommand,
  AddColumnCommand,
  UpdateColumnCommand,
  DeleteColumnCommand,
  AddNoteCommand,
  DeleteNoteCommand,
} from '~/utils/commands'

export function useBoardWithCommands() {
  const board = ref<IBoardData>(getDefaultBoardData())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Command history manager
  const historyManager = new CommandHistoryManagerImpl(50)

  const dragState = ref<DragState>({
    isDragging: false,
    draggedCard: null,
    sourceColumnId: null,
  })

  const columnDragState = ref({
    isDragging: false,
    draggedColumn: null as IColumn | null,
    sourceIndex: -1,
  })

  // Computed properties
  const columns = computed(() =>
    board.value.columns.sort((a, b) => a.order - b.order)
  )
  const cards = computed(() => board.value.cards)

  // Command pattern reactive state
  const canUndo = computed(() => historyManager.canUndo())
  const canRedo = computed(() => historyManager.canRedo())
  const undoDescription = computed(() => historyManager.getUndoDescription())
  const redoDescription = computed(() => historyManager.getRedoDescription())

  // Load board from storage on mount
  const loadBoard = () => {
    isLoading.value = true
    error.value = null

    try {
      const stored = loadBoardFromStorage()
      if (stored) {
        board.value = stored
        console.log('Successfully loaded board data from storage')
      } else {
        // No stored data or data was invalid, use default
        board.value = getDefaultBoardData()
        console.log('Using default board data')
      }
    } catch (err) {
      console.error('Critical error loading board data:', err)
      error.value = 'Failed to load board data - using default'

      // Try to reset to default as a last resort
      try {
        board.value = resetToDefault()
        console.log('Reset to default board data due to critical error')
      } catch (resetError) {
        console.error('Failed to reset to default:', resetError)
        board.value = getDefaultBoardData()
      }
    } finally {
      isLoading.value = false
    }
  }

  // Save board to storage
  const saveBoard = () => {
    try {
      saveBoardToStorage(board.value)
    } catch (err) {
      error.value = 'Failed to save board data'
      console.error(err)
    }
  }

  // Replace entire board (for imports)
  const replaceBoard = (newBoard: IBoardData) => {
    try {
      board.value = newBoard
      saveBoard()
      error.value = null
    } catch (err) {
      error.value = 'Failed to replace board data'
      console.error(err)
    }
  }

  // Handle data corruption recovery
  const recoverFromCorruption = () => {
    try {
      console.log('Attempting to recover from data corruption...')
      clearCorruptedData()
      board.value = resetToDefault()
      error.value = null
      console.log('Successfully recovered from data corruption')
    } catch (err) {
      console.error('Failed to recover from corruption:', err)
      error.value = 'Failed to recover from data corruption'
      board.value = getDefaultBoardData()
    }
  }

  // Clear board - remove all cards and columns
  const clearBoard = () => {
    try {
      board.value.cards = []
      board.value.columns = []
      saveBoard()
      error.value = null
      console.log('Board cleared - all cards and columns removed')
    } catch (err) {
      error.value = 'Failed to clear board'
      console.error(err)
    }
  }

  // Reset to default board
  const defaultBoard = () => {
    try {
      board.value = getDefaultBoardData()
      saveBoard()
      error.value = null
      console.log('Board reset to default')
    } catch (err) {
      error.value = 'Failed to reset to default board'
      console.error(err)
    }
  }

  // Command-based operations
  const executeCommand = async (command: Command) => {
    const success = await historyManager.executeCommand(command)
    if (success) {
      saveBoard()
    }
    return success
  }

  // Undo/Redo operations
  const undo = async (): Promise<boolean> => {
    const success = await historyManager.undo()
    if (success) {
      saveBoard()
    }
    return success
  }

  const redo = async (): Promise<boolean> => {
    const success = await historyManager.redo()
    if (success) {
      saveBoard()
    }
    return success
  }

  // Add new card using command pattern
  const addCard = async (cardData: Partial<ICard>, columnId: string) => {
    const command = new AddCardCommand(board.value, cardData, columnId)
    const success = await executeCommand(command)
    return success
  }

  // Update card using command pattern
  const updateCard = async (cardId: string, updates: Partial<ICard>) => {
    const command = new UpdateCardCommand(board.value, cardId, updates)
    const success = await executeCommand(command)
    return success
  }

  // Delete card using command pattern
  const deleteCard = async (cardId: string) => {
    const command = new DeleteCardCommand(board.value, cardId)
    const success = await executeCommand(command)
    return success
  }

  // Move card between columns using command pattern
  const moveCardToColumn = async (cardId: string, newColumnId: string) => {
    const command = new MoveCardCommand(board.value, cardId, newColumnId)
    const success = await executeCommand(command)
    return success
  }

  // Add new column using command pattern
  const addColumn = async (title: string) => {
    const command = new AddColumnCommand(board.value, { title })
    const success = await executeCommand(command)
    return success
  }

  // Update column using command pattern
  const updateColumn = async (columnId: string, updates: Partial<IColumn>) => {
    const command = new UpdateColumnCommand(board.value, columnId, updates)
    const success = await executeCommand(command)
    return success
  }

  // Delete column using command pattern
  const deleteColumn = async (columnId: string) => {
    const command = new DeleteColumnCommand(board.value, columnId)
    const success = await executeCommand(command)
    return success
  }

  // Drag and drop handlers
  const startDrag = (card: ICard, columnId: string) => {
    dragState.value = {
      isDragging: true,
      draggedCard: card,
      sourceColumnId: columnId,
    }
  }

  const endDrag = () => {
    dragState.value = {
      isDragging: false,
      draggedCard: null,
      sourceColumnId: null,
    }
  }

  const dropCard = async (targetColumnId: string) => {
    if (
      dragState.value.draggedCard &&
      dragState.value.sourceColumnId !== targetColumnId
    ) {
      await moveCardToColumn(dragState.value.draggedCard.id, targetColumnId)
    }
    endDrag()
  }

  // Column drag and drop handlers
  const startColumnDrag = (column: IColumn) => {
    const sourceIndex = board.value.columns.findIndex(
      (col) => col.id === column.id
    )
    columnDragState.value = {
      isDragging: true,
      draggedColumn: column,
      sourceIndex,
    }
  }

  const endColumnDrag = () => {
    columnDragState.value = {
      isDragging: false,
      draggedColumn: null,
      sourceIndex: -1,
    }
  }

  const reorderColumns = (targetIndex: number) => {
    if (
      columnDragState.value.draggedColumn &&
      columnDragState.value.sourceIndex !== targetIndex
    ) {
      const newColumns = [...board.value.columns]
      const draggedColumn = newColumns.splice(
        columnDragState.value.sourceIndex,
        1
      )[0]
      if (draggedColumn) {
        newColumns.splice(targetIndex, 0, draggedColumn)
      }

      // Update order values
      newColumns.forEach((column, index) => {
        column.order = index + 1
      })

      board.value.columns = newColumns
      saveBoard()
    }
    endColumnDrag()
  }

  // Note management functions using command pattern
  const addNoteToCard = async (
    cardId: string,
    noteData: { title: string; body: string }
  ) => {
    const command = new AddNoteCommand(board.value, cardId, noteData)
    const success = await executeCommand(command)
    return success
  }

  const updateNoteInCard = (
    cardId: string,
    noteId: string,
    noteData: Partial<INote>
  ) => {
    const cardIndex = board.value.cards.findIndex((card) => card.id === cardId)
    if (cardIndex !== -1) {
      const card = board.value.cards[cardIndex]
      if (card) {
        const noteIndex = card.notes.findIndex((note) => note.id === noteId)
        if (noteIndex !== -1) {
          const existingNote = card.notes[noteIndex]
          if (existingNote) {
            card.notes[noteIndex] = {
              ...existingNote,
              ...noteData,
              id: existingNote.id,
              createdAt: existingNote.createdAt,
              title: noteData.title ?? existingNote.title,
            }
            saveBoard()
          }
        }
      }
    }
  }

  const deleteNoteFromCard = async (cardId: string, noteId: string) => {
    const command = new DeleteNoteCommand(board.value, cardId, noteId)
    const success = await executeCommand(command)
    return success
  }

  // Command history utilities
  const clearHistory = () => {
    historyManager.clear()
  }

  const getHistory = () => {
    return historyManager.getDetailedHistory()
  }

  return {
    // State
    board,
    columns,
    cards,
    isLoading,
    error,
    dragState,
    columnDragState,

    // Command pattern state
    canUndo,
    canRedo,
    undoDescription,
    redoDescription,

    // Actions
    loadBoard,
    saveBoard,
    replaceBoard,
    recoverFromCorruption,

    // Command-based operations
    addCard,
    updateCard,
    deleteCard,
    moveCardToColumn,
    addColumn,
    updateColumn,
    deleteColumn,

    // Undo/Redo
    undo,
    redo,
    executeCommand,

    // Drag and drop
    startDrag,
    endDrag,
    dropCard,
    startColumnDrag,
    endColumnDrag,
    reorderColumns,

    // Note management
    addNoteToCard,
    updateNoteInCard,
    deleteNoteFromCard,

    // Board management
    clearBoard,
    defaultBoard,

    // Command history utilities
    clearHistory,
    getHistory,
  }
}
