# Boards API Documentation

This API provides RESTful endpoints for managing user boards with database persistence. All endpoints require authentication via better-auth.

## Base URL
```
/api/boards
```

## Authentication
All endpoints require a valid user session. Include session cookies in your requests.

## Endpoints

### GET /api/boards
Get all boards for the authenticated user.

**Query Parameters:**
- `search` (optional): Search term to filter boards by title

**Response:**
```json
{
  "success": true,
  "message": "Boards retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "title": "Board Title",
      "data": {
        "id": "board-uuid",
        "columns": [...],
        "cards": [...]
      },
      "created_at": "2025-09-05T20:18:53.000Z",
      "updated_at": "2025-09-05T20:18:53.000Z"
    }
  ],
  "count": 1,
  "timestamp": "2025-09-05T20:18:53.000Z"
}
```

### POST /api/boards
Create a new board.

**Request Body:**
```json
{
  "title": "My New Board",
  "data": {
    "id": "board-uuid",
    "columns": [
      {
        "id": "column-uuid",
        "title": "To Do",
        "order": 0
      }
    ],
    "cards": []
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Board created successfully",
  "data": {
    "id": "uuid",
    "user_id": "user-uuid",
    "title": "My New Board",
    "data": {...},
    "created_at": "2025-09-05T20:18:53.000Z",
    "updated_at": "2025-09-05T20:18:53.000Z"
  },
  "timestamp": "2025-09-05T20:18:53.000Z"
}
```

### GET /api/boards/[id]
Get a specific board by ID.

**Response:**
```json
{
  "success": true,
  "message": "Board retrieved successfully",
  "data": {
    "id": "uuid",
    "user_id": "user-uuid",
    "title": "Board Title",
    "data": {...},
    "created_at": "2025-09-05T20:18:53.000Z",
    "updated_at": "2025-09-05T20:18:53.000Z"
  },
  "timestamp": "2025-09-05T20:18:53.000Z"
}
```

### PUT /api/boards/[id]
Update a board's title and/or data.

**Request Body:**
```json
{
  "title": "Updated Board Title",
  "data": {
    "id": "board-uuid",
    "columns": [...],
    "cards": [...]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Board updated successfully",
  "data": {
    "id": "uuid",
    "user_id": "user-uuid",
    "title": "Updated Board Title",
    "data": {...},
    "created_at": "2025-09-05T20:18:53.000Z",
    "updated_at": "2025-09-05T20:20:00.000Z"
  },
  "timestamp": "2025-09-05T20:20:00.000Z"
}
```

### DELETE /api/boards/[id]
Delete a board.

**Response:**
```json
{
  "success": true,
  "message": "Board deleted successfully",
  "data": {
    "id": "uuid"
  },
  "timestamp": "2025-09-05T20:20:00.000Z"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "timestamp": "2025-09-05T20:20:00.000Z"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (not signed in)
- `404` - Not Found (board doesn't exist or doesn't belong to user)
- `500` - Internal Server Error

## Database Support

The API supports multiple database types based on the `DB_TYPE` environment variable:
- `sqlite` (default)
- `postgres`
- `mysql`

## Usage Examples

### Create a new board
```javascript
const response = await fetch('/api/boards', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: new Date().toISOString(),
    data: {
      id: crypto.randomUUID(),
      columns: [
        { id: crypto.randomUUID(), title: 'To Do', order: 0 },
        { id: crypto.randomUUID(), title: 'In Progress', order: 1 },
        { id: crypto.randomUUID(), title: 'Done', order: 2 }
      ],
      cards: []
    }
  })
})
```

### Search boards
```javascript
const response = await fetch('/api/boards?search=job')
const { data } = await response.json()
```

### Update board data
```javascript
const response = await fetch(`/api/boards/${boardId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    data: updatedBoardData
  })
})
```
