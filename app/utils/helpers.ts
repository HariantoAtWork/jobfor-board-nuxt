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

export function getCardsForColumn(
  cards: ICard[] | undefined,
  columnId: string
): ICard[] {
  if (!Array.isArray(cards)) {
    return []
  }
  return cards.filter((card) => card.columnId === columnId)
}

export function addCardToHistory(
  card: ICard,
  columnId: string,
  columnTitle: string
): ICardHistory {
  return {
    id: generateId(),
    columnId,
    columnTitle,
    timestamp: new Date().toISOString(),
  }
}

export function moveCard(
  card: ICard,
  newColumnId: string,
  newColumnTitle: string
): ICard {
  const historyEntry = addCardToHistory(card, newColumnId, newColumnTitle)

  return {
    ...card,
    columnId: newColumnId,
    lastMoved: new Date().toISOString(),
    history: [...card.history, historyEntry],
  }
}

export function getDefaultColumns(): IColumn[] {
  return [
    {
      id: generateId(),
      title: 'Job Posting',
      description:
        'Job opportunities found or shared that you want to consider applying for',
      order: 1,
    },
    {
      id: generateId(),
      title: 'Cover Letter',
      description:
        'Jobs you are actively writing or have written cover letters for',
      order: 2,
    },
    {
      id: generateId(),
      title: 'Applied',
      description: 'Applications submitted and waiting for initial response',
      order: 3,
    },
    {
      id: generateId(),
      title: 'First Meeting',
      description:
        'Initial interviews, phone screens, or first contact scheduled',
      order: 4,
    },
    {
      id: generateId(),
      title: 'Under Review',
      description:
        'Applications being reviewed by the company after initial contact',
      order: 5,
    },
    {
      id: generateId(),
      title: 'Follow Up',
      description: 'Waiting for response or need to follow up with the company',
      order: 6,
    },
    {
      id: generateId(),
      title: 'Offer',
      description: 'Job offers received and under consideration',
      order: 7,
    },
    {
      id: generateId(),
      title: 'Trashed',
      description:
        'Rejected applications, expired postings, or opportunities no longer relevant',
      order: 8,
    },
    {
      id: generateId(),
      title: 'Recruit Companies',
      description:
        'Companies you want to proactively reach out to for opportunities',
      order: 9,
    },
    {
      id: generateId(),
      title: 'Missed Calls',
      description:
        'Missed phone calls or interviews that need to be rescheduled',
      order: 10,
    },
  ]
}

export function getDefaultBoardData(): IBoardData {
  return {
    id: generateId(),
    columns: getDefaultColumns(),
    cards: [],
  }
}
