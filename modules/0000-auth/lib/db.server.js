import process from 'node:process'
// import './env.server'
import { mkdirSync, chmodSync } from 'node:fs'
import { join, dirname } from 'node:path'
import Database from 'better-sqlite3'
import { Pool } from 'pg'
import { config } from 'dotenv'

config()

export const db = {
  sqlite() {
    const SQLITE_PATH =
      process.env.SQLITE_PATH || './data/auth/local-development.sqlite'

    try {
      mkdirSync(dirname(SQLITE_PATH), { recursive: true }) // Can fail if no write permissions
      const database = new Database(SQLITE_PATH) // Can fail if file is locked
      chmodSync(SQLITE_PATH, 0o666) // Can fail if file doesn't exist
      return database
    } catch (error) {
      // Handle various failure scenarios gracefully
      console.error('Database initialization failed:', error.message)
      throw error // Re-throw or handle as needed
    }
  },

  postgres() {
    // Pool would read environment variables:
    // - https://node-postgres.com/features/connecting
    return new Pool()
  },
}
