import type { IBoardData, ICard, IColumn } from '~/types'
import { generateId } from '~/utils/helpers'

/**
 * Migration version tracking
 */
const CURRENT_DATA_VERSION = 1
const VERSION_KEY = 'job-application-board-version'

/**
 * Get the current data version from localStorage
 */
function getDataVersion(): number {
  if (typeof window !== 'undefined') {
    try {
      const version = localStorage.getItem(VERSION_KEY)
      return version ? parseInt(version, 10) : 0
    } catch {
      return 0
    }
  }
  return 0
}

/**
 * Set the data version in localStorage
 */
function setDataVersion(version: number): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(VERSION_KEY, version.toString())
    } catch (error) {
      console.error('Failed to set data version:', error)
    }
  }
}

/**
 * Migrate old column format to new format
 */
function migrateColumn(column: any): IColumn {
  // Handle old column format without order property
  if (typeof column.order !== 'number') {
    return {
      id: column.id || generateId(),
      title: column.title || 'Untitled Column',
      description: column.description || '',
      order: 0, // Will be set properly by the application
    }
  }

  return {
    id: column.id || generateId(),
    title: column.title || 'Untitled Column',
    description: column.description || '',
    order: column.order,
  }
}

/**
 * Migrate old card format to new format
 */
function migrateCard(card: any): ICard {
  const now = new Date().toISOString()

  return {
    id: card.id || generateId(),
    title: card.title || 'Untitled Card',
    via: card.via || undefined,
    company: card.company || undefined,
    jobTitle: card.jobTitle || card.job_title || undefined, // Handle old field name
    location: card.location || card.place || undefined, // Handle old field name
    link: card.link || undefined,
    contact: card.contact || undefined,
    description: card.description || undefined,
    columnId: card.columnId || card.column_id || '', // Handle old field name
    createdAt: card.createdAt || card.created_at || now, // Handle old field name
    lastMoved: card.lastMoved || card.last_moved || now, // Handle old field name
    history: Array.isArray(card.history)
      ? card.history.map((h: any) => ({
          id: h.id || generateId(),
          columnId: h.columnId || h.column_id || '',
          columnTitle: h.columnTitle || h.column_title || 'Unknown Column',
          timestamp: h.timestamp || now,
        }))
      : [],
    notes: Array.isArray(card.notes)
      ? card.notes.map((n: any) => ({
          id: n.id || generateId(),
          createdAt: n.createdAt || n.created_at || now,
          title: n.title || 'Untitled Note',
          body: n.body || undefined,
        }))
      : [],
  }
}

/**
 * Migrate old board format to new format
 */
function migrateBoardData(data: any): IBoardData {
  return {
    id: data.id || generateId(),
    columns: Array.isArray(data.columns) ? data.columns.map(migrateColumn) : [],
    cards: Array.isArray(data.cards) ? data.cards.map(migrateCard) : [],
  }
}

/**
 * Check if data needs migration and perform it
 */
export function migrateDataIfNeeded(data: any): IBoardData | null {
  try {
    const currentVersion = getDataVersion()

    // If we're already at the current version, no migration needed
    if (currentVersion >= CURRENT_DATA_VERSION) {
      return data
    }

    console.log(
      `Migrating data from version ${currentVersion} to ${CURRENT_DATA_VERSION}`
    )

    // Perform migration
    const migratedData = migrateBoardData(data)

    // Update version
    setDataVersion(CURRENT_DATA_VERSION)

    console.log('Data migration completed successfully')
    return migratedData
  } catch (error) {
    console.error('Data migration failed:', error)
    return null
  }
}

/**
 * Initialize data version for new installations
 */
export function initializeDataVersion(): void {
  if (typeof window !== 'undefined') {
    try {
      const version = localStorage.getItem(VERSION_KEY)
      if (!version) {
        setDataVersion(CURRENT_DATA_VERSION)
        console.log('Initialized data version to', CURRENT_DATA_VERSION)
      }
    } catch (error) {
      console.error('Failed to initialize data version:', error)
    }
  }
}

/**
 * Reset data version (useful for testing or complete reset)
 */
export function resetDataVersion(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(VERSION_KEY)
      console.log('Data version reset')
    } catch (error) {
      console.error('Failed to reset data version:', error)
    }
  }
}
