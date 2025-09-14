import type { IBoardData } from '~/types'
import dayjs from '~/utils/dayjs-extend'
import {
  validateAndSanitizeBoardData,
  isValidJSON,
} from '~/utils/dataValidator'
import { getDefaultBoardData } from '~/utils/helpers'

const STORAGE_KEY = 'job-application-board'
const BACKUP_KEY = 'job-application-board-backup'
const MANUAL_BACKUP_PREFIX = 'job-application-board-manual-backup-'
const RECOVERY_KEY = 'job-application-board-recovery'

export interface StorageBackup {
  id: string
  timestamp: string
  data: IBoardData
  size: number
  description?: string
}

export interface StorageInfo {
  hasData: boolean
  hasBackup: boolean
  dataSize: number
  backupSize: number
  lastModified: string | null
  isCorrupted: boolean
  errorMessage?: string
}

/**
 * Get comprehensive storage information
 */
export function getStorageInfo(): StorageInfo {
  if (typeof window === 'undefined') {
    return {
      hasData: false,
      hasBackup: false,
      dataSize: 0,
      backupSize: 0,
      lastModified: null,
      isCorrupted: false,
    }
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const backup = localStorage.getItem(BACKUP_KEY)

    let isCorrupted = false
    let errorMessage: string | undefined

    // Check if main data is corrupted
    if (data) {
      try {
        if (!isValidJSON(data)) {
          isCorrupted = true
          errorMessage = 'Main data contains invalid JSON'
        } else {
          const parsed = JSON.parse(data)
          const validated = validateAndSanitizeBoardData(parsed)
          if (!validated) {
            isCorrupted = true
            errorMessage = 'Main data failed validation'
          }
        }
      } catch (error) {
        isCorrupted = true
        errorMessage = `Main data parsing error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      }
    }

    return {
      hasData: !!data,
      hasBackup: !!backup,
      dataSize: data ? data.length : 0,
      backupSize: backup ? backup.length : 0,
      lastModified: data ? new Date().toISOString() : null,
      isCorrupted,
      errorMessage,
    }
  } catch (error) {
    return {
      hasData: false,
      hasBackup: false,
      dataSize: 0,
      backupSize: 0,
      lastModified: null,
      isCorrupted: true,
      errorMessage: `Storage access error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    }
  }
}

/**
 * Create a manual backup of current storage
 */
export function createManualBackup(description?: string): StorageBackup | null {
  if (typeof window === 'undefined') return null

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      throw new Error('No data to backup')
    }

    // Validate data before creating backup
    if (!isValidJSON(data)) {
      throw new Error('Cannot backup corrupted data')
    }

    const parsed = JSON.parse(data)
    const validated = validateAndSanitizeBoardData(parsed)
    if (!validated) {
      throw new Error('Cannot backup invalid data')
    }

    const backup: StorageBackup = {
      id: `backup-${Date.now()}`,
      timestamp: new Date().toISOString(),
      data: validated,
      size: data.length,
      description:
        description ||
        `Manual backup - ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
    }

    // Store backup in localStorage with unique key
    const backupKey = `${MANUAL_BACKUP_PREFIX}${backup.id}`
    localStorage.setItem(backupKey, JSON.stringify(backup))

    // Also update the main backup
    localStorage.setItem(BACKUP_KEY, data)

    console.log('Manual backup created:', backup.id)
    return backup
  } catch (error) {
    console.error('Failed to create manual backup:', error)
    return null
  }
}

/**
 * Get all manual backups
 */
export function getAllManualBackups(): StorageBackup[] {
  if (typeof window === 'undefined') return []

  const backups: StorageBackup[] = []

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(MANUAL_BACKUP_PREFIX)) {
        try {
          const backupData = localStorage.getItem(key)
          if (backupData && isValidJSON(backupData)) {
            const backup = JSON.parse(backupData) as StorageBackup
            if (backup.id && backup.timestamp && backup.data) {
              backups.push(backup)
            }
          }
        } catch (error) {
          console.warn(`Failed to parse backup ${key}:`, error)
        }
      }
    }

    // Sort by timestamp (newest first)
    return backups.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  } catch (error) {
    console.error('Failed to get manual backups:', error)
    return []
  }
}

/**
 * Restore from a manual backup
 */
export function restoreFromBackup(backupId: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    const backupKey = `${MANUAL_BACKUP_PREFIX}${backupId}`
    const backupData = localStorage.getItem(backupKey)

    if (!backupData || !isValidJSON(backupData)) {
      throw new Error('Backup not found or corrupted')
    }

    const backup = JSON.parse(backupData) as StorageBackup
    if (!backup.data) {
      throw new Error('Backup data is missing')
    }

    // Validate backup data
    const validated = validateAndSanitizeBoardData(backup.data)
    if (!validated) {
      throw new Error('Backup data failed validation')
    }

    // Create a backup of current data before restoring
    const currentData = localStorage.getItem(STORAGE_KEY)
    if (currentData) {
      localStorage.setItem(BACKUP_KEY, currentData)
    }

    // Restore the backup
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated))

    console.log('Successfully restored from backup:', backupId)
    return true
  } catch (error) {
    console.error('Failed to restore from backup:', error)
    return false
  }
}

/**
 * Delete a manual backup
 */
export function deleteManualBackup(backupId: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    const backupKey = `${MANUAL_BACKUP_PREFIX}${backupId}`
    localStorage.removeItem(backupKey)
    console.log('Deleted manual backup:', backupId)
    return true
  } catch (error) {
    console.error('Failed to delete manual backup:', error)
    return false
  }
}

/**
 * Export current storage data to file
 */
export function exportStorageToFile(): void {
  if (typeof window === 'undefined') return

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      throw new Error('No data to export')
    }

    // Validate data before export
    if (!isValidJSON(data)) {
      throw new Error('Cannot export corrupted data')
    }

    const parsed = JSON.parse(data)
    const validated = validateAndSanitizeBoardData(parsed)
    if (!validated) {
      throw new Error('Cannot export invalid data')
    }

    const exportData = {
      type: 'job-application-board-backup',
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: validated,
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `job-board-backup-${dayjs().format('YYYYMMDD-HHmmss')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log('Storage data exported to file')
  } catch (error) {
    console.error('Failed to export storage data:', error)
    throw error
  }
}

/**
 * Import storage data from file
 */
export function importStorageFromFile(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Import not available on server'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string

        if (!isValidJSON(content)) {
          reject(new Error('Invalid JSON format in file'))
          return
        }

        const parsed = JSON.parse(content)

        // Handle both old format (direct data) and new format (with metadata)
        let data: IBoardData
        if (parsed.type === 'job-application-board-backup' && parsed.data) {
          data = parsed.data
        } else {
          data = parsed
        }

        // Validate and sanitize the imported data
        const validated = validateAndSanitizeBoardData(data)

        if (!validated) {
          reject(new Error('Invalid board data structure'))
          return
        }

        // Create backup of current data
        const currentData = localStorage.getItem(STORAGE_KEY)
        if (currentData) {
          localStorage.setItem(BACKUP_KEY, currentData)
        }

        // Import the new data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validated))

        console.log('Storage data imported from file')
        resolve(true)
      } catch (error) {
        reject(
          new Error(
            `Import failed: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          )
        )
      }
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Clear all storage data (for recovery)
 */
export function clearAllStorage(): void {
  if (typeof window === 'undefined') return

  try {
    // Store current data in recovery key before clearing
    const currentData = localStorage.getItem(STORAGE_KEY)
    if (currentData) {
      localStorage.setItem(RECOVERY_KEY, currentData)
    }

    // Clear main storage
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(BACKUP_KEY)

    console.log('All storage data cleared')
  } catch (error) {
    console.error('Failed to clear storage:', error)
  }
}

/**
 * Get recovery data (if available)
 */
export function getRecoveryData(): string | null {
  if (typeof window === 'undefined') return null

  try {
    return localStorage.getItem(RECOVERY_KEY)
  } catch (error) {
    console.error('Failed to get recovery data:', error)
    return null
  }
}

/**
 * Clear recovery data
 */
export function clearRecoveryData(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(RECOVERY_KEY)
    console.log('Recovery data cleared')
  } catch (error) {
    console.error('Failed to clear recovery data:', error)
  }
}

/**
 * Reset to default data
 */
export function resetToDefaultData(): IBoardData {
  if (typeof window === 'undefined') {
    return getDefaultBoardData()
  }

  try {
    const defaultData = getDefaultBoardData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
    console.log('Reset to default data')
    return defaultData
  } catch (error) {
    console.error('Failed to reset to default:', error)
    return getDefaultBoardData()
  }
}
