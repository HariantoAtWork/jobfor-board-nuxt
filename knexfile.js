import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdirSync } from 'node:fs'
import { config } from 'dotenv'

// Load environment variables from .env file
config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DEFAULT_SQLITE_PATH = join(
  __dirname,
  './data/auth/local-development.sqlite'
)

// Create folders for SQLite path and return the same path
function createFolders(sqlitePath) {
  if (sqlitePath) {
    const dbDir = sqlitePath
    try {
      mkdirSync(dirname(dbDir), { recursive: true })
    } catch (error) {
      console.warn(
        `Warning: Could not create directory ${dbDir}:`,
        error.message
      )
    }
  }
  return sqlitePath
}

// Debug environment variables
console.log('🔧 Knex Environment Configuration:')
console.log('  DB_TYPE:', process.env.DB_TYPE || 'sqlite3 (default)')
console.log('  SQLITE_PATH:', process.env.SQLITE_PATH || 'default path')
console.log('  PGHOST:', process.env.PGHOST || 'localhost (default)')
console.log('  MYSQL_HOST:', process.env.MYSQL_HOST || 'localhost (default)')

export default {
  development: {
    client: process.env.DB_TYPE || 'sqlite3',
    connection:
      process.env.DB_TYPE === 'postgres'
        ? {
            host: process.env.PGHOST || 'localhost',
            port: parseInt(process.env.PGPORT) || 5432,
            user: process.env.PGUSER || 'postgres',
            password: process.env.PGPASSWORD || '',
            database: process.env.PGDATABASE || 'job_board',
          }
        : process.env.DB_TYPE === 'mysql'
        ? {
            host: process.env.MYSQL_HOST || 'localhost',
            port: parseInt(process.env.MYSQL_PORT) || 3306,
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'job_board',
          }
        : {
            filename: createFolders(
              process.env.SQLITE_PATH || DEFAULT_SQLITE_PATH
            ),
          },
    migrations: {
      directory: join(__dirname, 'database/migrations'),
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: join(__dirname, 'database/seeds'),
    },
    useNullAsDefault: true,
  },

  production: {
    client: process.env.DB_TYPE || 'sqlite3',
    connection:
      process.env.DB_TYPE === 'postgres'
        ? {
            host: process.env.PGHOST || 'localhost',
            port: parseInt(process.env.PGPORT) || 5432,
            user: process.env.PGUSER || 'postgres',
            password: process.env.PGPASSWORD || '',
            database: process.env.PGDATABASE || 'job_board',
          }
        : process.env.DB_TYPE === 'mysql'
        ? {
            host: process.env.MYSQL_HOST || 'localhost',
            port: parseInt(process.env.MYSQL_PORT) || 3306,
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'job_board',
          }
        : {
            filename: createFolders(
              process.env.SQLITE_PATH || DEFAULT_SQLITE_PATH
            ),
          },
    migrations: {
      directory: join(__dirname, 'database/migrations'),
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: join(__dirname, 'database/seeds'),
    },
    useNullAsDefault: true,
  },
}
