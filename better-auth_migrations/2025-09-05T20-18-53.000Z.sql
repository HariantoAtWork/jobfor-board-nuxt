-- Migration: Add boards table
-- Created: 2025-09-05T20:18:53+0200

-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    data TEXT NOT NULL, -- JSON string of board data
    created_at TEXT NOT NULL, -- ISO string
    updated_at TEXT NOT NULL, -- ISO string
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);

-- Create index for faster title searches
CREATE INDEX IF NOT EXISTS idx_boards_title ON boards(title);

-- Create index for faster date queries
CREATE INDEX IF NOT EXISTS idx_boards_created_at ON boards(created_at);
