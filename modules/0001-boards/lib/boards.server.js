import process from 'node:process'
import { db } from '@modules/0000-auth/lib/db.server.js'

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
      share_token: null,
      is_public: 0, // SQLite uses 0/1 for boolean
      created_at: now,
      updated_at: now,
    }

    if (this.dbType === 'sqlite') {
      const stmt = this.database.prepare(`
        INSERT INTO boards (id, user_id, title, data, share_token, is_public, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      stmt.run(
        board.id,
        board.user_id,
        board.title,
        board.data,
        board.share_token,
        board.is_public,
        board.created_at,
        board.updated_at
      )
    } else if (this.dbType === 'postgres') {
      const query = `
        INSERT INTO boards (id, user_id, title, data, share_token, is_public, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `
      await this.database.query(query, [
        board.id,
        board.user_id,
        board.title,
        board.data,
        board.share_token,
        board.is_public,
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
        SELECT id, user_id, title, data, share_token, is_public, created_at, updated_at
        FROM boards
        WHERE user_id = ?
        ORDER BY created_at DESC
      `)
      rows = stmt.all(userId)
    } else if (this.dbType === 'postgres') {
      const query = `
        SELECT id, user_id, title, data, share_token, is_public, created_at, updated_at
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
      share_token: row.share_token,
      is_public: Boolean(row.is_public), // Convert 0/1 to true/false
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }

  // Get a specific board by ID
  async getBoardById(boardId, userId) {
    let row

    if (this.dbType === 'sqlite') {
      const stmt = this.database.prepare(`
        SELECT id, user_id, title, data, share_token, is_public, created_at, updated_at
        FROM boards
        WHERE id = ? AND user_id = ?
      `)
      row = stmt.get(boardId, userId)
    } else if (this.dbType === 'postgres') {
      const query = `
        SELECT id, user_id, title, data, share_token, is_public, created_at, updated_at
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
      share_token: row.share_token,
      is_public: Boolean(row.is_public), // Convert 0/1 to true/false
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  }

  // Get a board by share token (for public access)
  async getBoardByShareToken(shareToken) {
    let row

    if (this.dbType === 'sqlite') {
      const stmt = this.database.prepare(`
        SELECT id, user_id, title, data, share_token, is_public, created_at, updated_at
        FROM boards
        WHERE share_token = ? AND is_public = 1
      `)
      row = stmt.get(shareToken)
    } else if (this.dbType === 'postgres') {
      const query = `
        SELECT id, user_id, title, data, share_token, is_public, created_at, updated_at
        FROM boards
        WHERE share_token = $1 AND is_public = true
      `
      const result = await this.database.query(query, [shareToken])
      row = result.rows[0]
    }

    if (!row) return null

    return {
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      data: JSON.parse(row.data),
      share_token: row.share_token,
      is_public: Boolean(row.is_public), // Convert 0/1 to true/false
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

    if (updates.is_public !== undefined) {
      updateFields.push('is_public = ?')
      values.push(updates.is_public ? 1 : 0)
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

  // Generate share token for a board
  async generateShareToken(boardId, userId) {
    const shareToken = crypto.randomUUID()
    const now = new Date().toISOString()

    if (this.dbType === 'sqlite') {
      const stmt = this.database.prepare(`
        UPDATE boards
        SET share_token = ?, updated_at = ?
        WHERE id = ? AND user_id = ?
      `)
      const result = stmt.run(shareToken, now, boardId, userId)
      return result.changes > 0 ? shareToken : null
    } else if (this.dbType === 'postgres') {
      const query = `
        UPDATE boards
        SET share_token = $1, updated_at = $2
        WHERE id = $3 AND user_id = $4
      `
      const result = await this.database.query(query, [
        shareToken,
        now,
        boardId,
        userId,
      ])
      return result.rowCount > 0 ? shareToken : null
    }

    return null
  }

  // Revoke share token for a board
  async revokeShareToken(boardId, userId) {
    const now = new Date().toISOString()

    if (this.dbType === 'sqlite') {
      const stmt = this.database.prepare(`
        UPDATE boards
        SET share_token = NULL, is_public = 0, updated_at = ?
        WHERE id = ? AND user_id = ?
      `)
      const result = stmt.run(now, boardId, userId)
      return result.changes > 0
    } else if (this.dbType === 'postgres') {
      const query = `
        UPDATE boards
        SET share_token = NULL, is_public = false, updated_at = $1
        WHERE id = $2 AND user_id = $3
      `
      const result = await this.database.query(query, [now, boardId, userId])
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
        SELECT id, user_id, title, data, share_token, is_public, created_at, updated_at
        FROM boards
        WHERE user_id = ? AND title LIKE ?
        ORDER BY created_at DESC
      `)
      rows = stmt.all(userId, `%${searchTerm}%`)
    } else if (this.dbType === 'postgres') {
      const query = `
        SELECT id, user_id, title, data, share_token, is_public, created_at, updated_at
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
      share_token: row.share_token,
      is_public: Boolean(row.is_public), // Convert 0/1 to true/false
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }
}

// Export singleton instance
export const boardDb = new BoardDatabase()
