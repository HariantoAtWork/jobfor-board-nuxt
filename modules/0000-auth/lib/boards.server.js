import process from 'node:process'
import { db } from './db.server.js'

const DB_TYPE = process.env.DB_TYPE || 'sqlite'

export class BoardDatabase {
  constructor() {
    this.database = db[DB_TYPE]()
    this.dbType = DB_TYPE
  }

  // Create a new board
  async createBoard(userId, title, boardData) {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    const board = {
      id,
      user_id: userId,
      title,
      data: JSON.stringify(boardData),
      created_at: now,
      updated_at: now,
    }

    if (this.dbType === 'sqlite') {
      const stmt = this.database.prepare(`
        INSERT INTO boards (id, user_id, title, data, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      stmt.run(
        board.id,
        board.user_id,
        board.title,
        board.data,
        board.created_at,
        board.updated_at
      )
    } else if (this.dbType === 'postgres') {
      const query = `
        INSERT INTO boards (id, user_id, title, data, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `
      await this.database.query(query, [
        board.id,
        board.user_id,
        board.title,
        board.data,
        board.created_at,
        board.updated_at,
      ])
    }

    return { ...board, data: JSON.parse(board.data) }
  }

  // Get all boards for a user
  async getUserBoards(userId) {
    let rows

    if (this.dbType === 'sqlite') {
      const stmt = this.database.prepare(`
        SELECT id, user_id, title, data, created_at, updated_at
        FROM boards
        WHERE user_id = ?
        ORDER BY created_at DESC
      `)
      rows = stmt.all(userId)
    } else if (this.dbType === 'postgres') {
      const query = `
        SELECT id, user_id, title, data, created_at, updated_at
        FROM boards
        WHERE user_id = $1
        ORDER BY created_at DESC
      `
      const result = await this.database.query(query, [userId])
      rows = result.rows
    }

    return rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      data: JSON.parse(row.data),
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }

  // Get a specific board by ID
  async getBoardById(boardId, userId) {
    let row

    if (this.dbType === 'sqlite') {
      const stmt = this.database.prepare(`
        SELECT id, user_id, title, data, created_at, updated_at
        FROM boards
        WHERE id = ? AND user_id = ?
      `)
      row = stmt.get(boardId, userId)
    } else if (this.dbType === 'postgres') {
      const query = `
        SELECT id, user_id, title, data, created_at, updated_at
        FROM boards
        WHERE id = $1 AND user_id = $2
      `
      const result = await this.database.query(query, [boardId, userId])
      row = result.rows[0]
    }

    if (!row) return null

    return {
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      data: JSON.parse(row.data),
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  }

  // Update a board
  async updateBoard(boardId, userId, updates) {
    const now = new Date().toISOString()
    const updateFields = []
    const values = []

    if (updates.title !== undefined) {
      updateFields.push('title = ?')
      values.push(updates.title)
    }

    if (updates.data !== undefined) {
      updateFields.push('data = ?')
      values.push(JSON.stringify(updates.data))
    }

    updateFields.push('updated_at = ?')
    values.push(now)

    if (updateFields.length === 1) {
      // Only updated_at
      return false
    }

    values.push(boardId, userId)

    if (this.dbType === 'sqlite') {
      const stmt = this.database.prepare(`
        UPDATE boards
        SET ${updateFields.join(', ')}
        WHERE id = ? AND user_id = ?
      `)
      const result = stmt.run(...values)
      return result.changes > 0
    } else if (this.dbType === 'postgres') {
      const query = `
        UPDATE boards
        SET ${updateFields
          .map((field, index) => field.replace('?', `$${index + 1}`))
          .join(', ')}
        WHERE id = $${values.length - 1} AND user_id = $${values.length}
      `
      const result = await this.database.query(query, values)
      return result.rowCount > 0
    }

    return false
  }

  // Delete a board
  async deleteBoard(boardId, userId) {
    if (this.dbType === 'sqlite') {
      const stmt = this.database.prepare(`
        DELETE FROM boards
        WHERE id = ? AND user_id = ?
      `)
      const result = stmt.run(boardId, userId)
      return result.changes > 0
    } else if (this.dbType === 'postgres') {
      const query = `
        DELETE FROM boards
        WHERE id = $1 AND user_id = $2
      `
      const result = await this.database.query(query, [boardId, userId])
      return result.rowCount > 0
    }

    return false
  }

  // Search boards by title
  async searchBoards(userId, searchTerm) {
    let rows

    if (this.dbType === 'sqlite') {
      const stmt = this.database.prepare(`
        SELECT id, user_id, title, data, created_at, updated_at
        FROM boards
        WHERE user_id = ? AND title LIKE ?
        ORDER BY created_at DESC
      `)
      rows = stmt.all(userId, `%${searchTerm}%`)
    } else if (this.dbType === 'postgres') {
      const query = `
        SELECT id, user_id, title, data, created_at, updated_at
        FROM boards
        WHERE user_id = $1 AND title ILIKE $2
        ORDER BY created_at DESC
      `
      const result = await this.database.query(query, [
        userId,
        `%${searchTerm}%`,
      ])
      rows = result.rows
    }

    return rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      data: JSON.parse(row.data),
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }
}

// Export singleton instance
export const boardDb = new BoardDatabase()
