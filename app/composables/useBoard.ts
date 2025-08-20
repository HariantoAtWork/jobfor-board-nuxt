import { ref, computed } from 'vue'
import type { IBoardData, ICard, IColumn, INote, DragState } from '~/types'
import { getDefaultBoardData, generateId, moveCard } from '~/utils/helpers'
import { saveBoardToStorage, loadBoardFromStorage } from '~/utils/storage'

export function useBoard() {
  const board = ref<IBoardData>(getDefaultBoardData())
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const dragState = ref<DragState>({
    isDragging: false,
    draggedCard: null,
    sourceColumnId: null
  })

  const columnDragState = ref({
    isDragging: false,
    draggedColumn: null as IColumn | null,
    sourceIndex: -1
  })

  // Computed properties
  const columns = computed(() => board.value.columns.sort((a, b) => a.order - b.order))
  const cards = computed(() => board.value.cards)

  // Load board from storage on mount
  const loadBoard = () => {
    isLoading.value = true
    try {
      const stored = loadBoardFromStorage()
      if (stored) {
        board.value = stored
      }
    } catch (err) {
      error.value = 'Failed to load board data'
      console.error(err)
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

  // Add new card
  const addCard = (cardData: Partial<ICard>, columnId: string) => {
    const newCard: ICard = {
      id: generateId(),
      title: cardData.title || 'New Job Application',
      company: cardData.company || '',
      jobTitle: cardData.jobTitle || '',
      via: cardData.via || '',
      link: cardData.link || '',
      contact: cardData.contact || '',
      description: cardData.description || '',
      columnId,
      createdAt: new Date().toISOString(),
      lastMoved: new Date().toISOString(),
      history: [],
      notes: []
    }

    board.value.cards.push(newCard)
    saveBoard()
    return newCard
  }

  // Update card
  const updateCard = (cardId: string, updates: Partial<ICard>) => {
    const cardIndex = board.value.cards.findIndex(card => card.id === cardId)
    if (cardIndex !== -1) {
      board.value.cards[cardIndex] = { ...board.value.cards[cardIndex], ...updates }
      saveBoard()
    }
  }

  // Delete card
  const deleteCard = (cardId: string) => {
    board.value.cards = board.value.cards.filter(card => card.id !== cardId)
    saveBoard()
  }

  // Move card between columns
  const moveCardToColumn = (cardId: string, newColumnId: string) => {
    const card = board.value.cards.find(c => c.id === cardId)
    const targetColumn = board.value.columns.find(col => col.id === newColumnId)
    
    if (card && targetColumn) {
      const updatedCard = moveCard(card, newColumnId, targetColumn.title)
      const cardIndex = board.value.cards.findIndex(c => c.id === cardId)
      board.value.cards[cardIndex] = updatedCard
      saveBoard()
    }
  }

  // Add new column
  const addColumn = (title: string) => {
    const newColumn: IColumn = {
      id: generateId(),
      title,
      order: board.value.columns.length + 1
    }
    board.value.columns.push(newColumn)
    saveBoard()
    return newColumn
  }

  // Update column
  const updateColumn = (columnId: string, updates: Partial<IColumn>) => {
    const columnIndex = board.value.columns.findIndex(col => col.id === columnId)
    if (columnIndex !== -1) {
      board.value.columns[columnIndex] = { ...board.value.columns[columnIndex], ...updates }
      saveBoard()
    }
  }

  // Delete column
  const deleteColumn = (columnId: string) => {
    // Move all cards from this column to the first available column
    const remainingColumns = board.value.columns.filter(col => col.id !== columnId)
    if (remainingColumns.length > 0) {
      const targetColumn = remainingColumns[0]
      board.value.cards.forEach(card => {
        if (card.columnId === columnId) {
          card.columnId = targetColumn.id
          card.history.push({
            id: generateId(),
            columnId: targetColumn.id,
            columnTitle: targetColumn.title,
            timestamp: new Date().toISOString()
          })
        }
      })
    }
    
    board.value.columns = remainingColumns
    saveBoard()
  }

  // Drag and drop handlers
  const startDrag = (card: ICard, columnId: string) => {
    dragState.value = {
      isDragging: true,
      draggedCard: card,
      sourceColumnId: columnId
    }
  }

  const endDrag = () => {
    dragState.value = {
      isDragging: false,
      draggedCard: null,
      sourceColumnId: null
    }
  }

  const dropCard = (targetColumnId: string) => {
    if (dragState.value.draggedCard && dragState.value.sourceColumnId !== targetColumnId) {
      moveCardToColumn(dragState.value.draggedCard.id, targetColumnId)
    }
    endDrag()
  }

  // Column drag and drop handlers
  const startColumnDrag = (column: IColumn) => {
    const sourceIndex = board.value.columns.findIndex(col => col.id === column.id)
    columnDragState.value = {
      isDragging: true,
      draggedColumn: column,
      sourceIndex
    }
  }

  const endColumnDrag = () => {
    columnDragState.value = {
      isDragging: false,
      draggedColumn: null,
      sourceIndex: -1
    }
  }

  const reorderColumns = (targetIndex: number) => {
    if (columnDragState.value.draggedColumn && columnDragState.value.sourceIndex !== targetIndex) {
      const newColumns = [...board.value.columns]
      const draggedColumn = newColumns.splice(columnDragState.value.sourceIndex, 1)[0]
      newColumns.splice(targetIndex, 0, draggedColumn)
      
      // Update order values
      newColumns.forEach((column, index) => {
        column.order = index + 1
      })
      
      board.value.columns = newColumns
      saveBoard()
    }
    endColumnDrag()
  }

  // Note management functions
  const addNoteToCard = (cardId: string, noteData: { title: string; body: string }) => {
    const cardIndex = board.value.cards.findIndex(card => card.id === cardId)
    if (cardIndex !== -1) {
      const newNote: INote = {
        id: generateId(),
        title: noteData.title,
        body: noteData.body,
        createdAt: new Date().toISOString()
      }
      board.value.cards[cardIndex].notes.push(newNote)
      saveBoard()
    }
  }

  const updateNoteInCard = (cardId: string, noteId: string, noteData: Partial<INote>) => {
    const cardIndex = board.value.cards.findIndex(card => card.id === cardId)
    if (cardIndex !== -1) {
      const noteIndex = board.value.cards[cardIndex].notes.findIndex(note => note.id === noteId)
      if (noteIndex !== -1) {
        board.value.cards[cardIndex].notes[noteIndex] = {
          ...board.value.cards[cardIndex].notes[noteIndex],
          ...noteData
        }
        saveBoard()
      }
    }
  }

  const deleteNoteFromCard = (cardId: string, noteId: string) => {
    const cardIndex = board.value.cards.findIndex(card => card.id === cardId)
    if (cardIndex !== -1) {
      board.value.cards[cardIndex].notes = board.value.cards[cardIndex].notes.filter(
        note => note.id !== noteId
      )
      saveBoard()
    }
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
    
    // Actions
    loadBoard,
    saveBoard,
    addCard,
    updateCard,
    deleteCard,
    moveCardToColumn,
    addColumn,
    updateColumn,
    deleteColumn,
    startDrag,
    endDrag,
    dropCard,
    startColumnDrag,
    endColumnDrag,
    reorderColumns,
    
    // Note management
    addNoteToCard,
    updateNoteInCard,
    deleteNoteFromCard
  }
}
