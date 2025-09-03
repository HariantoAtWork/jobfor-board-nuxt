// GET /api/data/search - Search within JSON data
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { q: searchQuery, path: searchPath, limit = 50 } = query

    if (!searchQuery) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Search query parameter "q" is required',
      })
    }

    const dataPath = '.data/json/data.json'

    // Check if file exists
    const fs = await import('fs/promises')

    try {
      await fs.access(dataPath)
    } catch (accessError) {
      return {
        success: false,
        message: 'Data file does not exist',
        results: [],
        count: 0,
        timestamp: new Date().toISOString(),
      }
    }

    // Read and parse the JSON file
    const data = await fs.readFile(dataPath, 'utf-8')
    const jsonData = JSON.parse(data)

    // Perform search
    const results = searchInObject(
      jsonData,
      searchQuery,
      searchPath,
      parseInt(limit)
    )

    return {
      success: true,
      message: 'Search completed successfully',
      query: searchQuery,
      path: searchPath || 'all',
      results: results,
      count: results.length,
      totalResults: results.length,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error searching data:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search data',
      data: {
        error: error.message,
      },
    })
  }
})

// Helper function to search within an object
function searchInObject(obj, query, path = null, limit = 50) {
  const results = []
  const searchRegex = new RegExp(query, 'i')

  function searchRecursive(currentObj, currentPath = '') {
    if (results.length >= limit) return

    if (typeof currentObj === 'string') {
      if (searchRegex.test(currentObj)) {
        results.push({
          path: currentPath,
          value: currentObj,
          type: 'string',
        })
      }
    } else if (typeof currentObj === 'number') {
      if (searchRegex.test(currentObj.toString())) {
        results.push({
          path: currentPath,
          value: currentObj,
          type: 'number',
        })
      }
    } else if (Array.isArray(currentObj)) {
      currentObj.forEach((item, index) => {
        const newPath = currentPath ? `${currentPath}[${index}]` : `[${index}]`
        searchRecursive(item, newPath)
      })
    } else if (currentObj && typeof currentObj === 'object') {
      Object.keys(currentObj).forEach((key) => {
        const newPath = currentPath ? `${currentPath}.${key}` : key
        searchRecursive(currentObj[key], newPath)
      })
    }
  }

  // If a specific path is provided, search only in that path
  if (path) {
    const pathParts = path.split('.')
    let targetObj = obj

    for (const part of pathParts) {
      if (targetObj && typeof targetObj === 'object' && part in targetObj) {
        targetObj = targetObj[part]
      } else {
        return results // Path not found
      }
    }

    searchRecursive(targetObj, path)
  } else {
    searchRecursive(obj)
  }

  return results
}
