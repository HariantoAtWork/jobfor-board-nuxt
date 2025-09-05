import type { IBoardData } from '~/types'
import dayjs from '~/utils/dayjs-extend'
import { validateAndSanitizeBoardData, isValidJSON } from '~/utils/dataValidator'
import { getDefaultBoardData } from '~/utils/helpers'
import { migrateDataIfNeeded, initializeDataVersion } from '~/utils/dataMigration'

const STORAGE_KEY = 'job-application-board'
const BACKUP_KEY = 'job-application-board-backup'

export function saveBoardToStorage(board: IBoardData): void {
  if (typeof window !== 'undefined') {
    try {
      // Create a backup of current data before saving
      const currentData = localStorage.getItem(STORAGE_KEY)
      if (currentData) {
        localStorage.setItem(BACKUP_KEY, currentData)
      }
      
      // Save the new data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
    } catch (error) {
      console.error('Failed to save board to storage:', error)
      // If saving fails, try to restore from backup
      try {
        const backup = localStorage.getItem(BACKUP_KEY)
        if (backup) {
          localStorage.setItem(STORAGE_KEY, backup)
        }
      } catch (backupError) {
        console.error('Failed to restore from backup:', backupError)
      }
    }
  }
}

export function loadBoardFromStorage(): IBoardData | null {
  if (typeof window !== 'undefined') {
    try {
      // Initialize data version for new installations
      initializeDataVersion()
      
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        // Check if the stored data is valid JSON
        if (!isValidJSON(stored)) {
          console.error('Invalid JSON in localStorage, attempting to restore from backup')
          return loadFromBackup()
        }
        
        // Parse the JSON
        const parsed = JSON.parse(stored)
        
        // Check if data needs migration
        const migratedData = migrateDataIfNeeded(parsed)
        if (migratedData) {
          // Validate and sanitize the migrated data
          const validated = validateAndSanitizeBoardData(migratedData)
          
          if (validated) {
            // Save the migrated data back to storage
            saveBoardToStorage(validated)
            return validated
          }
        }
        
        // If migration failed, try validation on original data
        const validated = validateAndSanitizeBoardData(parsed)
        
        if (validated) {
          return validated
        } else {
          console.warn('Board data validation failed, attempting to restore from backup')
          return loadFromBackup()
        }
      }
    } catch (error) {
      console.error('Failed to load board from storage:', error)
      return loadFromBackup()
    }
  }
  return null
}

function loadFromBackup(): IBoardData | null {
  try {
    const backup = localStorage.getItem(BACKUP_KEY)
    if (backup && isValidJSON(backup)) {
      const parsed = JSON.parse(backup)
      const validated = validateAndSanitizeBoardData(parsed)
      if (validated) {
        console.log('Successfully restored board data from backup')
        return validated
      }
    }
  } catch (error) {
    console.error('Failed to load from backup:', error)
  }
  
  // If backup also fails, return null to use default data
  console.warn('Both main data and backup are invalid, will use default board data')
  return null
}

export function clearCorruptedData(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(BACKUP_KEY)
      console.log('Cleared corrupted localStorage data')
    } catch (error) {
      console.error('Failed to clear corrupted data:', error)
    }
  }
}

export function resetToDefault(): IBoardData {
  if (typeof window !== 'undefined') {
    try {
      const defaultData = getDefaultBoardData()
      saveBoardToStorage(defaultData)
      console.log('Reset board data to default')
      return defaultData
    } catch (error) {
      console.error('Failed to reset to default:', error)
      return getDefaultBoardData()
    }
  }
  return getDefaultBoardData()
}

export function exportBoardData(board: IBoardData): void {
  if (typeof window !== 'undefined') {
    try {
      const dataStr = JSON.stringify(board, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `job-board-${dayjs().format('YYYYMMDD-HHmmss-SSS')}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export board data:', error)
    }
  }
}

export function importBoardData(file: File): Promise<IBoardData> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          
          // Check if content is valid JSON
          if (!isValidJSON(content)) {
            reject(new Error('Invalid JSON format in file'))
            return
          }
          
          const parsed = JSON.parse(content)
          
          // Validate and sanitize the imported data
          const validated = validateAndSanitizeBoardData(parsed)
          
          if (validated) {
            resolve(validated)
          } else {
            reject(new Error('Invalid board data structure - data could not be sanitized'))
          }
        } catch (error) {
          reject(new Error('Invalid file format'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    } else {
      reject(new Error('Import not available on server'))
    }
  })
}
