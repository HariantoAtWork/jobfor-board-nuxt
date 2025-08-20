import { formatDistanceToNow } from 'date-fns'
import type { ICard, IColumn, ICardHistory, IBoardData } from '~/types'
import { v7 as uuidv7 } from 'uuid'

export function generateId(): string {
  return uuidv7()
}

export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'Unknown time'
  }
}

export function getCardsForColumn(cards: ICard[] | undefined, columnId: string): ICard[] {
  if (!Array.isArray(cards)) {
    return []
  }
  return cards.filter(card => card.columnId === columnId)
}

export function addCardToHistory(card: ICard, columnId: string, columnTitle: string): ICardHistory {
  return {
    id: generateId(),
    columnId,
    columnTitle,
    timestamp: new Date().toISOString()
  }
}

export function moveCard(card: ICard, newColumnId: string, newColumnTitle: string): ICard {
  const historyEntry = addCardToHistory(card, newColumnId, newColumnTitle)
  
  return {
    ...card,
    columnId: newColumnId,
    lastMoved: new Date().toISOString(),
    history: [...card.history, historyEntry]
  }
}

export function getDefaultColumns(): IColumn[] {
  return [
    { id: generateId(), title: 'Job Posting', order: 1 },
    { id: generateId(), title: 'Cover Letter', order: 2 },
    { id: generateId(), title: 'Applied', order: 3 },
    { id: generateId(), title: 'First Meeting', order: 4 },
    { id: generateId(), title: 'Under Review', order: 5 },
    { id: generateId(), title: 'Follow Up', order: 6 },
    { id: generateId(), title: 'Offer', order: 7 },
    { id: generateId(), title: 'Rejected / Expired', order: 8 },
    { id: generateId(), title: 'Recruit Companies', order: 9 },
    { id: generateId(), title: 'Missed Calls', order: 10 }
  ]
}

export function getDefaultBoardData(): IBoardData {
  return {
    id: generateId(),
    columns: getDefaultColumns(),
    cards: []
  }
}
