import type { Command, CommandHistoryManager } from '~/types/commands'

export class CommandHistoryManagerImpl implements CommandHistoryManager {
  private undoStack: Command[] = []
  private redoStack: Command[] = []
  private maxHistorySize: number = 50

  constructor(maxHistorySize: number = 50) {
    this.maxHistorySize = maxHistorySize
  }

  async executeCommand(command: Command): Promise<boolean> {
    try {
      await command.execute()
      this.undoStack.push(command)

      // Clear redo stack when new command is executed
      this.redoStack = []

      // Limit history size
      if (this.undoStack.length > this.maxHistorySize) {
        this.undoStack.shift()
      }

      return true
    } catch (error) {
      console.error('Failed to execute command:', error)
      return false
    }
  }

  async undo(): Promise<boolean> {
    const command = this.undoStack.pop()
    if (!command) {
      return false
    }

    try {
      await command.undo()
      this.redoStack.push(command)
      return true
    } catch (error) {
      console.error('Failed to undo command:', error)
      // Put command back on undo stack
      this.undoStack.push(command)
      return false
    }
  }

  async redo(): Promise<boolean> {
    const command = this.redoStack.pop()
    if (!command) {
      return false
    }

    try {
      await command.execute()
      this.undoStack.push(command)
      return true
    } catch (error) {
      console.error('Failed to redo command:', error)
      // Put command back on redo stack
      this.redoStack.push(command)
      return false
    }
  }

  canUndo(): boolean {
    return this.undoStack.length > 0
  }

  canRedo(): boolean {
    return this.redoStack.length > 0
  }

  getUndoDescription(): string | null {
    return this.undoStack[this.undoStack.length - 1]?.getDescription() ?? null
  }

  getRedoDescription(): string | null {
    return this.redoStack[this.redoStack.length - 1]?.getDescription() ?? null
  }

  getHistory(): Command[] {
    return [...this.undoStack]
  }

  clear(): void {
    this.undoStack = []
    this.redoStack = []
  }

  // Additional utility methods
  getHistorySize(): number {
    return this.undoStack.length
  }

  getRedoSize(): number {
    return this.redoStack.length
  }

  // Get detailed history for debugging
  getDetailedHistory(): Array<{
    command: Command
    description: string
    type: string
    timestamp: Date
  }> {
    return this.undoStack.map((command) => ({
      command,
      description: command.getDescription(),
      type: command.getType(),
      timestamp: command.getTimestamp(),
    }))
  }
}
