# Boards Module for Nuxt 4

A module for managing board data storage and retrieval. This module provides database functionality for storing and managing user boards.

## Features

- ✅ **Database Support** - SQLite, PostgreSQL, and MySQL support
- ✅ **CRUD Operations** - Create, read, update, and delete boards
- ✅ **User Isolation** - Boards are isolated per user
- ✅ **Search Functionality** - Search boards by title
- ✅ **Data Validation** - Validates board data structure

## Database Support

The module supports multiple database types based on the `DB_TYPE` environment variable:

- `sqlite` - SQLite database (default)
- `postgres` - PostgreSQL database
- `mysql` - MySQL database (requires mysql2 package)

## Environment Variables

```env
# Database Configuration
DB_TYPE=sqlite
SQLITE_PATH=.data/auth/jobfor-board.sqlite

# For PostgreSQL
# DB_TYPE=postgres
# PGHOST=localhost
# PGPORT=5432
# PGUSER=postgres
# PGPASSWORD=password
# PGDATABASE=job_board

# For MySQL
# DB_TYPE=mysql
# MYSQL_HOST=localhost
# MYSQL_PORT=3306
# MYSQL_USER=root
# MYSQL_PASSWORD=password
# MYSQL_DATABASE=job_board
```

## Usage

### Server-Side Usage

```javascript
import { boardDb } from '@modules/0001-boards/lib/boards.server.js'

// Create a new board
const board = await boardDb.createBoard(userId, title, boardData)

// Get user's boards
const boards = await boardDb.getUserBoards(userId)

// Get a specific board
const board = await boardDb.getBoardById(boardId, userId)

// Update a board
const updated = await boardDb.updateBoard(boardId, userId, { title: 'New Title' })

// Delete a board
const deleted = await boardDb.deleteBoard(boardId, userId)

// Search boards
const results = await boardDb.searchBoards(userId, 'search term')
```

## API Routes

The module works with the following API routes in `server/api/boards/`:

- `GET /api/boards` - List user's boards
- `POST /api/boards` - Create a new board
- `GET /api/boards/[id]` - Get a specific board
- `PUT /api/boards/[id]` - Update a board
- `DELETE /api/boards/[id]` - Delete a board

## Database Schema

The `boards` table has the following structure:

```sql
CREATE TABLE boards (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    data TEXT NOT NULL, -- JSON string of board data
    created_at TEXT NOT NULL, -- ISO string
    updated_at TEXT NOT NULL, -- ISO string
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
```

## File Structure

```
modules/0001-boards/
├── index.js              # Module entry point
├── lib/
│   └── boards.server.js  # Board database functionality
└── README.md             # This file
```

## Dependencies

- `better-sqlite3` - For SQLite support
- `pg` - For PostgreSQL support
- `mysql2` - For MySQL support (optional)

## License

This module is part of the JobFor Board Nuxt project.
