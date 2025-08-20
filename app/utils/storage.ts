import type { IBoardData } from '~/types'
import dayjs from '~/utils/dayjs-extend'

const STORAGE_KEY = 'job-application-board'

export function saveBoardToStorage(board: IBoardData): void {
  if (process.client) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
    } catch (error) {
      console.error('Failed to save board to storage:', error)
    }
  }
}

export function loadBoardFromStorage(): IBoardData | null {
  if (process.client) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load board from storage:', error)
    }
  }
  return null
}

export function exportBoardData(board: IBoardData): void {
  if (process.client) {
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
    if (process.client) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const board = JSON.parse(content)
          resolve(board)
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
