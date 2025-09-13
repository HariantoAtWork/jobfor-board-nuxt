import type { IBoardData, ICard, IColumn, INote } from '~/types'
import { BaseCommand } from '~/types/commands'
import { generateId } from './helpers'

// ✅ Reusable deep clone utility function
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

// ✅ Reusable function to ensure array property is initialized
function ensureArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : []
}

// Add Card Command
export class AddCardCommand extends BaseCommand {
  private card: ICard
  private cardIndex: number = -1

  constructor(
    board: IBoardData,
    cardData: Partial<ICard>,
    private columnId: string
  ) {
    super(board)
    const cardDataId = cardData.id || generateId()
    delete cardData.id
    const now = new Date().toISOString()

    this.card = {
      id: cardDataId,
      columnId,
      ...deepClone({
        ...cardData,
        createdAt: now,
        lastMoved: now,
        history: ensureArray(cardData.history),
        notes: ensureArray(cardData.notes),
      }),
    } as ICard
  }

  async execute(): Promise<void> {
    this.board.cards.push(this.card)
    this.cardIndex = this.board.cards.length - 1
  }

  async undo(): Promise<void> {
    if (this.cardIndex !== -1) {
      this.board.cards.splice(this.cardIndex, 1)
      this.cardIndex = -1
    }
  }

  getDescription(): string {
    return `Add card: "${this.card.title}" to ${this.getColumnTitle()}`
  }

  private getColumnTitle(): string {
    const column = this.board.columns.find((col) => col.id === this.columnId)
    return column?.title || 'Unknown Column'
  }
}

// Update Card Command
export class UpdateCardCommand extends BaseCommand {
  private originalCard: ICard
  private updatedCard: ICard

  constructor(
    board: IBoardData,
    private cardId: string,
    updates: Partial<ICard>
  ) {
    super(board)
    const cardIndex = board.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) {
      throw new Error(`Card with id ${cardId} not found`)
    }

    // ✅ Deep clone using reusable function
    this.originalCard = deepClone(board.cards[cardIndex]!)
    this.updatedCard = deepClone({ ...this.originalCard, ...updates })
  }

  async execute(): Promise<void> {
    const cardIndex = this.board.cards.findIndex((c) => c.id === this.cardId)
    if (cardIndex !== -1) {
      this.board.cards[cardIndex] = this.updatedCard
    }
  }

  async undo(): Promise<void> {
    const cardIndex = this.board.cards.findIndex((c) => c.id === this.cardId)
    if (cardIndex !== -1) {
      this.board.cards[cardIndex] = this.originalCard
    }
  }

  getDescription(): string {
    const changes: string[] = []
    if (this.originalCard.title !== this.updatedCard.title) {
      changes.push(
        `title: "${this.originalCard.title}" → "${this.updatedCard.title}"`
      )
    }
    if (this.originalCard.company !== this.updatedCard.company) {
      changes.push(
        `company: "${this.originalCard.company}" → "${this.updatedCard.company}"`
      )
    }
    if (this.originalCard.jobTitle !== this.updatedCard.jobTitle) {
      changes.push(
        `job title: "${this.originalCard.jobTitle}" → "${this.updatedCard.jobTitle}"`
      )
    }

    return `Update card: ${changes.join(', ')}`
  }
}

// Move Card Command
export class MoveCardCommand extends BaseCommand {
  private originalCard: ICard
  private newColumnId: string

  constructor(board: IBoardData, private cardId: string, newColumnId: string) {
    super(board)
    const cardIndex = board.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) {
      throw new Error(`Card with id ${cardId} not found`)
    }

    // ✅ Store complete original card state with deep clone
    this.originalCard = deepClone(board.cards[cardIndex]!)
    this.newColumnId = newColumnId
  }

  async execute(): Promise<void> {
    const card = this.board.cards.find((c) => c.id === this.cardId)
    if (card) {
      card.columnId = this.newColumnId
      card.lastMoved = new Date().toISOString()

      // Add to history
      const newColumn = this.board.columns.find(
        (col) => col.id === this.newColumnId
      )
      if (newColumn) {
        card.history.push({
          id: generateId(),
          columnId: this.newColumnId,
          columnTitle: newColumn.title,
          timestamp: new Date().toISOString(),
        })
      }
    }
  }

  async undo(): Promise<void> {
    const cardIndex = this.board.cards.findIndex((c) => c.id === this.cardId)
    if (cardIndex !== -1) {
      // ✅ Replace card with complete original state (including original lastMoved)
      this.board.cards[cardIndex] = deepClone(this.originalCard)
    }
  }

  getDescription(): string {
    const originalColumn = this.board.columns.find(
      (col) => col.id === this.originalCard.columnId
    )
    const newColumn = this.board.columns.find(
      (col) => col.id === this.newColumnId
    )

    return `Move card: "${this.originalCard.title}" from "${originalColumn?.title}" to "${newColumn?.title}"`
  }
}

// Delete Card Command
export class DeleteCardCommand extends BaseCommand {
  private originalCard: ICard
  private cardIndex: number = -1

  constructor(board: IBoardData, private cardId: string) {
    super(board)
    const cardIndex = board.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) {
      throw new Error(`Card with id ${cardId} not found`)
    }

    // ✅ Deep clone using reusable function
    this.originalCard = deepClone(board.cards[cardIndex]!)
    this.cardIndex = cardIndex
  }

  async execute(): Promise<void> {
    if (this.cardIndex !== -1) {
      this.board.cards.splice(this.cardIndex, 1)
    }
  }

  async undo(): Promise<void> {
    if (this.cardIndex !== -1) {
      this.board.cards.splice(this.cardIndex, 0, this.originalCard)
    }
  }

  getDescription(): string {
    const column = this.board.columns.find(
      (col) => col.id === this.originalCard.columnId
    )
    return `Delete card: "${this.originalCard.title}" from "${column?.title}"`
  }
}

// Add Column Command
export class AddColumnCommand extends BaseCommand {
  private column: IColumn

  constructor(board: IBoardData, columnData: Partial<IColumn>) {
    super(board)
    const maxOrder = Math.max(...board.columns.map((col) => col.order), 0)
    this.column = {
      id: generateId(),
      title: columnData.title || 'New Column',
      description: columnData.description || '',
      order: columnData.order ?? maxOrder + 1,
    } as IColumn
  }

  async execute(): Promise<void> {
    this.board.columns.push(this.column)
  }

  async undo(): Promise<void> {
    const columnIndex = this.board.columns.findIndex(
      (col) => col.id === this.column.id
    )
    if (columnIndex !== -1) {
      this.board.columns.splice(columnIndex, 1)
    }
  }

  getDescription(): string {
    return `Add column: "${this.column.title}"`
  }
}

// Update Column Command
export class UpdateColumnCommand extends BaseCommand {
  private originalColumn: IColumn
  private updatedColumn: IColumn

  constructor(
    board: IBoardData,
    private columnId: string,
    updates: Partial<IColumn>
  ) {
    super(board)
    const columnIndex = board.columns.findIndex((col) => col.id === columnId)
    if (columnIndex === -1) {
      throw new Error(`Column with id ${columnId} not found`)
    }

    // ✅ Deep clone using reusable function
    this.originalColumn = deepClone(board.columns[columnIndex]!)
    this.updatedColumn = deepClone({ ...this.originalColumn, ...updates })
  }

  async execute(): Promise<void> {
    const columnIndex = this.board.columns.findIndex(
      (col) => col.id === this.columnId
    )
    if (columnIndex !== -1) {
      this.board.columns[columnIndex] = this.updatedColumn
    }
  }

  async undo(): Promise<void> {
    const columnIndex = this.board.columns.findIndex(
      (col) => col.id === this.columnId
    )
    if (columnIndex !== -1) {
      this.board.columns[columnIndex] = this.originalColumn
    }
  }

  getDescription(): string {
    return `Update column: "${this.originalColumn.title}" → "${this.updatedColumn.title}"`
  }
}

// Delete Column Command
export class DeleteColumnCommand extends BaseCommand {
  private originalColumn: IColumn
  private columnIndex: number = -1
  private moveCommands: MoveCardCommand[] = []

  constructor(board: IBoardData, private columnId: string) {
    super(board)
    const columnIndex = board.columns.findIndex((col) => col.id === columnId)
    if (columnIndex === -1) {
      throw new Error(`Column with id ${columnId} not found`)
    }

    this.originalColumn = deepClone(board.columns[columnIndex]!) as IColumn
    this.columnIndex = columnIndex
  }

  async execute(): Promise<void> {
    // Move all cards to the first available column
    const cardsInColumn = this.board.cards.filter(
      (card) => card.columnId === this.columnId
    )
    const otherColumns = this.board.columns.filter(
      (col) => col.id !== this.columnId
    )

    if (otherColumns.length > 0 && cardsInColumn.length > 0) {
      const targetColumn = otherColumns[0]
      if (targetColumn) {
        const targetColumnId = targetColumn.id

        for (const card of cardsInColumn) {
          const moveCommand = new MoveCardCommand(
            this.board,
            card.id,
            targetColumnId
          )
          await moveCommand.execute()
          this.moveCommands.push(moveCommand)
        }
      }
    }

    // Delete the column
    if (this.columnIndex !== -1) {
      this.board.columns.splice(this.columnIndex, 1)
    }
  }

  async undo(): Promise<void> {
    // Restore the column
    if (this.columnIndex !== -1) {
      this.board.columns.splice(this.columnIndex, 0, this.originalColumn)
    }

    // Undo all move commands in reverse order
    for (let i = this.moveCommands.length - 1; i >= 0; i--) {
      const command = this.moveCommands[i]
      if (command) {
        await command.undo()
      }
    }
    this.moveCommands = []
  }

  getDescription(): string {
    const cardCount = this.board.cards.filter(
      (card) => card.columnId === this.columnId
    ).length
    return `Delete column: "${this.originalColumn.title}" (${cardCount} cards moved)`
  }
}

// Add Note Command
export class AddNoteCommand extends BaseCommand {
  private note: INote
  private noteIndex: number = -1

  constructor(
    board: IBoardData,
    private cardId: string,
    noteData: Partial<INote>
  ) {
    super(board)
    this.note = {
      id: generateId(),
      title: noteData.title || 'New Note',
      body: noteData.body || '',
      createdAt: new Date().toISOString(),
    } as INote
  }

  async execute(): Promise<void> {
    const card = this.board.cards.find((c) => c.id === this.cardId)
    if (card) {
      card.notes.push(this.note)
      this.noteIndex = card.notes.length - 1
    }
  }

  async undo(): Promise<void> {
    const card = this.board.cards.find((c) => c.id === this.cardId)
    if (card && this.noteIndex !== -1) {
      card.notes.splice(this.noteIndex, 1)
      this.noteIndex = -1
    }
  }

  getDescription(): string {
    const card = this.board.cards.find((c) => c.id === this.cardId)
    return `Add note: "${this.note.title}" to card "${card?.title}"`
  }
}

// Delete Note Command
export class DeleteNoteCommand extends BaseCommand {
  private originalNote: INote
  private noteIndex: number = -1

  constructor(
    board: IBoardData,
    private cardId: string,
    private noteId: string
  ) {
    super(board)
    const card = board.cards.find((c) => c.id === cardId)
    if (!card) {
      throw new Error(`Card with id ${cardId} not found`)
    }

    const noteIndex = card.notes.findIndex((n) => n.id === noteId)
    if (noteIndex === -1) {
      throw new Error(`Note with id ${noteId} not found`)
    }

    this.originalNote = deepClone(card.notes[noteIndex]) as INote
    this.noteIndex = noteIndex
  }

  async execute(): Promise<void> {
    const card = this.board.cards.find((c) => c.id === this.cardId)
    if (card && this.noteIndex !== -1) {
      card.notes.splice(this.noteIndex, 1)
    }
  }

  async undo(): Promise<void> {
    const card = this.board.cards.find((c) => c.id === this.cardId)
    if (card && this.noteIndex !== -1) {
      card.notes.splice(this.noteIndex, 0, this.originalNote)
    }
  }

  getDescription(): string {
    const card = this.board.cards.find((c) => c.id === this.cardId)
    return `Delete note: "${this.originalNote.title}" from card "${card?.title}"`
  }
}
