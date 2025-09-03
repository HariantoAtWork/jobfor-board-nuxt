// GET /api/data/info - Get file metadata and statistics
export default defineEventHandler(async (event) => {
  try {
    const dataPath = '.data/json/data.json'

    const fs = await import('fs/promises')
    const path = await import('path')

    try {
      const stats = await fs.stat(dataPath)
      const data = await fs.readFile(dataPath, 'utf-8')
      const jsonData = JSON.parse(data)

      return {
        success: true,
        message: 'File information retrieved successfully',
        timestamp: new Date().toISOString(),
        filePath: dataPath,
        fileInfo: {
          exists: true,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
          created: stats.birthtime,
          modified: stats.mtime,
          accessed: stats.atime,
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory(),
        },
        dataInfo: {
          type: typeof jsonData,
          isArray: Array.isArray(jsonData),
          keys: Object.keys(jsonData),
          keyCount: Object.keys(jsonData).length,
          depth: getObjectDepth(jsonData),
        },
      }
    } catch (accessError) {
      return {
        success: false,
        message: 'Data file does not exist',
        timestamp: new Date().toISOString(),
        filePath: dataPath,
        fileInfo: {
          exists: false,
          size: 0,
          sizeFormatted: '0 B',
          created: null,
          modified: null,
          accessed: null,
          isFile: false,
          isDirectory: false,
        },
        dataInfo: {
          type: null,
          isArray: false,
          keys: [],
          keyCount: 0,
          depth: 0,
        },
      }
    }
  } catch (error) {
    console.error('Error getting file info:', error)

    return {
      success: false,
      message: 'Failed to get file information',
      error: error.message,
      timestamp: new Date().toISOString(),
    }
  }
})

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper function to get object depth
function getObjectDepth(obj, depth = 0) {
  if (obj === null || typeof obj !== 'object') return depth

  let maxDepth = depth
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      maxDepth = Math.max(maxDepth, getObjectDepth(obj[key], depth + 1))
    }
  }
  return maxDepth
}
