import { formatDistanceToNow } from 'date-fns'
import type { ICard, IColumn, ICardHistory } from '~/types'

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
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
    { id: 'job-posting', title: 'Job Posting', order: 1 },
    { id: 'cover-letter', title: 'Cover Letter', order: 2 },
    { id: 'applied', title: 'Applied', order: 3 },
    { id: 'first-meeting', title: 'First Meeting', order: 4 },
    { id: 'under-review', title: 'Under Review', order: 5 },
    { id: 'follow-up', title: 'Follow Up', order: 6 },
    { id: 'offer', title: 'Offer', order: 7 },
    { id: 'rejected-expired', title: 'Rejected / Expired', order: 8 },
    { id: 'recruit-companies', title: 'Recruit Companies', order: 9 },
    { id: 'missed-calls', title: 'Missed Calls', order: 10 }
  ]
}

export function getDefaultBoardData(): IBoardData {
  return {
    id: generateId(),
    columns: getDefaultColumns(),
    cards: []
  }
}
