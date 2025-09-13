import type { IBoardData } from './index'

// Base command interface
export interface Command {
  execute(): Promise<void>
  undo(): Promise<void>
  getDescription(): string
  getType(): string
  getTimestamp(): Date
}

// Abstract base command
export abstract class BaseCommand implements Command {
  protected board: IBoardData
  protected timestamp: Date

  constructor(board: IBoardData) {
    this.board = board
    this.timestamp = new Date()
  }

  abstract execute(): Promise<void>
  abstract undo(): Promise<void>
  abstract getDescription(): string

  getType(): string {
    return this.constructor.name
  }

  getTimestamp(): Date {
    return this.timestamp
  }
}

// Command history manager interface
export interface CommandHistoryManager {
  executeCommand(command: Command): Promise<boolean>
  undo(): Promise<boolean>
  redo(): Promise<boolean>
  canUndo(): boolean
  canRedo(): boolean
  getUndoDescription(): string | null
  getRedoDescription(): string | null
  getHistory(): Command[]
  clear(): void
}
