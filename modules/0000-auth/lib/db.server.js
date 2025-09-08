import process from 'node:process'
// import './env.server'
import { mkdirSync, chmodSync } from 'node:fs'
import { join, dirname } from 'node:path'
import Database from 'better-sqlite3'
import { Pool } from 'pg'
import { config } from 'dotenv'

config()

console.log(
  '# DB.server.js --------------------------------',
  process.env.SQLITE_PATH
)

export const db = {
  sqlite() {
    const SQLITE_PATH =
      process.env.SQLITE_PATH || './data/auth/local-development-nigga.sqlite'

    console.log('WHAT IS THIS? --------------------------------', SQLITE_PATH)
    const dbPath = join(process.cwd(), SQLITE_PATH)

    try {
      mkdirSync(dirname(dbPath), { recursive: true }) // Can fail if no write permissions
      const database = new Database(dbPath) // Can fail if file is locked
      chmodSync(dbPath, 0o666) // Can fail if file doesn't exist
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
