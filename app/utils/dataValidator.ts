import type { IBoardData, ICard, IColumn, INote, ICardHistory } from '~/types'
import { generateId } from '~/utils/helpers'

/**
 * Validates if an object has the required properties for a column
 */
function isValidColumn(obj: any): obj is IColumn {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.order === 'number' &&
    !isNaN(obj.order)
  )
}

/**
 * Validates if an object has the required properties for a note
 */
function isValidNote(obj: any): obj is INote {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.title === 'string' &&
    (obj.body === undefined || typeof obj.body === 'string')
  )
}

/**
 * Validates if an object has the required properties for card history
 */
function isValidCardHistory(obj: any): obj is ICardHistory {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.columnId === 'string' &&
    typeof obj.columnTitle === 'string' &&
    typeof obj.timestamp === 'string'
  )
}

/**
 * Validates if an object has the required properties for a card
 */
function isValidCard(obj: any): obj is ICard {
  if (!obj || typeof obj !== 'object') return false

  // Check required fields
  if (typeof obj.id !== 'string') return false
  if (typeof obj.title !== 'string') return false
  if (typeof obj.columnId !== 'string') return false
  if (typeof obj.createdAt !== 'string') return false
  if (typeof obj.lastMoved !== 'string') return false

  // Check optional fields
  if (obj.via !== undefined && typeof obj.via !== 'string') return false
  if (obj.company !== undefined && typeof obj.company !== 'string') return false
  if (obj.jobTitle !== undefined && typeof obj.jobTitle !== 'string')
    return false
  if (obj.location !== undefined && typeof obj.location !== 'string')
    return false
  if (obj.link !== undefined && typeof obj.link !== 'string') return false
  if (obj.contact !== undefined && typeof obj.contact !== 'string') return false
  if (obj.description !== undefined && typeof obj.description !== 'string')
    return false

  // Check arrays
  if (!Array.isArray(obj.history)) return false
  if (!Array.isArray(obj.notes)) return false

  // Validate history entries
  for (const historyItem of obj.history) {
    if (!isValidCardHistory(historyItem)) return false
  }

  // Validate notes
  for (const note of obj.notes) {
    if (!isValidNote(note)) return false
  }

  return true
}

/**
 * Validates if an object has the required properties for board data
 */
function isValidBoardData(obj: any): obj is IBoardData {
  if (!obj || typeof obj !== 'object') return false

  // Check required fields
  if (typeof obj.id !== 'string') return false
  if (!Array.isArray(obj.columns)) return false
  if (!Array.isArray(obj.cards)) return false

  // Validate columns
  for (const column of obj.columns) {
    if (!isValidColumn(column)) return false
  }

  // Validate cards
  for (const card of obj.cards) {
    if (!isValidCard(card)) return false
  }

  return true
}

/**
 * Sanitizes and fixes a column object
 */
function sanitizeColumn(obj: any): IColumn {
  return {
    id: typeof obj.id === 'string' ? obj.id : generateId(),
    title: typeof obj.title === 'string' ? obj.title : 'Untitled Column',
    description: typeof obj.description === 'string' ? obj.description : '',
    order: typeof obj.order === 'number' && !isNaN(obj.order) ? obj.order : 0,
  }
}

/**
 * Sanitizes and fixes a note object
 */
function sanitizeNote(obj: any): INote {
  return {
    id: typeof obj.id === 'string' ? obj.id : generateId(),
    createdAt:
      typeof obj.createdAt === 'string'
        ? obj.createdAt
        : new Date().toISOString(),
    title: typeof obj.title === 'string' ? obj.title : 'Untitled Note',
    body: typeof obj.body === 'string' ? obj.body : undefined,
  }
}

/**
 * Sanitizes and fixes a card history object
 */
function sanitizeCardHistory(obj: any): ICardHistory {
  return {
    id: typeof obj.id === 'string' ? obj.id : generateId(),
    columnId: typeof obj.columnId === 'string' ? obj.columnId : '',
    columnTitle:
      typeof obj.columnTitle === 'string' ? obj.columnTitle : 'Unknown Column',
    timestamp:
      typeof obj.timestamp === 'string'
        ? obj.timestamp
        : new Date().toISOString(),
  }
}

/**
 * Sanitizes and fixes a card object
 */
function sanitizeCard(obj: any): ICard {
  const now = new Date().toISOString()

  return {
    id: typeof obj.id === 'string' ? obj.id : generateId(),
    title: typeof obj.title === 'string' ? obj.title : 'Untitled Card',
    via: typeof obj.via === 'string' ? obj.via : undefined,
    company: typeof obj.company === 'string' ? obj.company : undefined,
    jobTitle: typeof obj.jobTitle === 'string' ? obj.jobTitle : undefined,
    location: typeof obj.location === 'string' ? obj.location : undefined,
    link: typeof obj.link === 'string' ? obj.link : undefined,
    contact: typeof obj.contact === 'string' ? obj.contact : undefined,
    description:
      typeof obj.description === 'string' ? obj.description : undefined,
    columnId: typeof obj.columnId === 'string' ? obj.columnId : '',
    createdAt: typeof obj.createdAt === 'string' ? obj.createdAt : now,
    lastMoved: typeof obj.lastMoved === 'string' ? obj.lastMoved : now,
    history: Array.isArray(obj.history)
      ? obj.history.map(sanitizeCardHistory)
      : [],
    notes: Array.isArray(obj.notes) ? obj.notes.map(sanitizeNote) : [],
  }
}

/**
 * Sanitizes and fixes board data object
 */
function sanitizeBoardData(obj: any): IBoardData {
  return {
    id: typeof obj.id === 'string' ? obj.id : generateId(),
    columns: Array.isArray(obj.columns) ? obj.columns.map(sanitizeColumn) : [],
    cards: Array.isArray(obj.cards) ? obj.cards.map(sanitizeCard) : [],
  }
}

/**
 * Validates and sanitizes board data from localStorage
 * Returns null if data is completely invalid and should be reset to default
 */
export function validateAndSanitizeBoardData(data: any): IBoardData | null {
  try {
    // If data is null or undefined, return null to use default
    if (data === null || data === undefined) {
      return null
    }

    // If data is already valid, return it as-is
    if (isValidBoardData(data)) {
      return data
    }

    // Try to sanitize the data
    const sanitized = sanitizeBoardData(data)

    // Validate the sanitized data
    if (isValidBoardData(sanitized)) {
      console.warn('Board data was malformed and has been sanitized')
      return sanitized
    }

    // If sanitization failed, return null to use default
    console.error(
      'Board data is completely invalid and will be reset to default'
    )
    return null
  } catch (error) {
    console.error('Error validating board data:', error)
    return null
  }
}

/**
 * Validates if a string is valid JSON
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * Safely parses JSON with error handling
 */
export function safeJSONParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str)
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return fallback
  }
}
