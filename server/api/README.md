# RESTful API for JSON Data Management

This API provides comprehensive endpoints for managing JSON data stored in `.data/json/data.json`.

## Base URL
```
/api/data
```

## Endpoints

### 1. **GET** `/api/data`
Retrieve the complete JSON data from the file.

**Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": { /* your JSON data */ },
  "timestamp": "2025-09-03T12:32:42+0200"
}
```

### 2. **POST** `/api/data`
Create new JSON data or overwrite existing data.

**Request Body:** JSON object
```json
{
  "key1": "value1",
  "key2": "value2"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data created successfully",
  "data": { /* saved data */ },
  "timestamp": "2025-09-03T12:32:42+0200",
  "filePath": ".data/json/data.json"
}
```

### 3. **PUT** `/api/data`
Update existing JSON data by merging with new data.

**Request Body:** JSON object
```json
{
  "newKey": "newValue",
  "existingKey": "updatedValue"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data updated successfully",
  "data": { /* merged data */ },
  "timestamp": "2025-09-03T12:32:42+0200",
  "filePath": ".data/json/data.json",
  "merged": true
}
```

### 4. **DELETE** `/api/data`
Delete the data.json file.

**Response:**
```json
{
  "success": true,
  "message": "Data file deleted successfully",
  "timestamp": "2025-09-03T12:32:42+0200",
  "filePath": ".data/json/data.json"
}
```

### 5. **GET** `/api/data/exists`
Check if the data.json file exists.

**Response:**
```json
{
  "exists": true,
  "message": "Data file exists",
  "timestamp": "2025-09-03T12:32:42+0200",
  "filePath": ".data/json/data.json"
}
```

### 6. **GET** `/api/data/info`
Get comprehensive file metadata and data statistics.

**Response:**
```json
{
  "success": true,
  "message": "File information retrieved successfully",
  "timestamp": "2025-09-03T12:32:42+0200",
  "filePath": ".data/json/data.json",
  "fileInfo": {
    "exists": true,
    "size": 1024,
    "sizeFormatted": "1 KB",
    "created": "2025-09-03T10:00:00.000Z",
    "modified": "2025-09-03T12:32:42.000Z",
    "accessed": "2025-09-03T12:32:42.000Z",
    "isFile": true,
    "isDirectory": false
  },
  "dataInfo": {
    "type": "object",
    "isArray": false,
    "keys": ["key1", "key2"],
    "keyCount": 2,
    "depth": 2
  }
}
```

### 7. **POST** `/api/data/backup`
Create a timestamped backup of the current data file.

**Response:**
```json
{
  "success": true,
  "message": "Backup created successfully",
  "timestamp": "2025-09-03T12:32:42+0200",
  "sourceFile": ".data/json/data.json",
  "backupFile": ".data/backups/data-backup-2025-09-03T12-32-42+0200.json",
  "backupFilename": "data-backup-2025-09-03T12-32-42+0200.json",
  "backupInfo": {
    "size": 1024,
    "sizeFormatted": "1 KB",
    "created": "2025-09-03T12:32:42.000Z"
  }
}
```

### 8. **GET** `/api/data/search`
Search within the JSON data.

**Query Parameters:**
- `q` (required): Search query string
- `path` (optional): Specific path to search within (e.g., "users.name")
- `limit` (optional): Maximum number of results (default: 50)

**Example:** `/api/data/search?q=john&path=users&limit=10`

**Response:**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "query": "john",
  "path": "users",
  "results": [
    {
      "path": "users.0.name",
      "value": "John Doe",
      "type": "string"
    }
  ],
  "count": 1,
  "totalResults": 1,
  "timestamp": "2025-09-03T12:32:42+0200"
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "timestamp": "2025-09-03T12:32:42+0200"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found (file doesn't exist)
- `500` - Internal Server Error

## Usage Examples

### cURL Examples

**Create/Update Data:**
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "age": 30}'
```

**Get Data:**
```bash
curl http://localhost:3000/api/data
```

**Update Data:**
```bash
curl -X PUT http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"age": 31}'
```

**Search Data:**
```bash
curl "http://localhost:3000/api/data/search?q=john&limit=10"
```

**Create Backup:**
```bash
curl -X POST http://localhost:3000/api/data/backup
```

### JavaScript/Fetch Examples

**Create Data:**
```javascript
const response = await fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', age: 30 })
})
const result = await response.json()
```

**Get Data:**
```javascript
const response = await fetch('/api/data')
const result = await response.json()
```

**Search Data:**
```javascript
const response = await fetch('/api/data/search?q=john&limit=10')
const result = await response.json()
```

## File Structure

The API automatically manages the following directory structure:

```
.data/
├── json/
│   └── data.json          # Main data file
└── backups/               # Backup directory
    ├── data-backup-2025-09-03T10-00-00+0200.json
    └── data-backup-2025-09-03T12-32-42+0200.json
```

## Features

- ✅ **Full CRUD operations** (Create, Read, Update, Delete)
- ✅ **Automatic directory creation** if it doesn't exist
- ✅ **Data validation** and error handling
- ✅ **File metadata** and statistics
- ✅ **Automatic backups** with timestamps
- ✅ **Advanced search** within JSON data
- ✅ **Path-based searching** for specific data sections
- ✅ **Consistent response format** across all endpoints
- ✅ **Proper HTTP status codes** for different scenarios
- ✅ **Timestamp tracking** for all operations

## Security Notes

- This API is designed for development and internal use
- Consider adding authentication/authorization for production use
- File paths are restricted to the `.data` directory
- Input validation prevents malicious file operations
