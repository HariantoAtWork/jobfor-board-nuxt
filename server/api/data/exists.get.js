// GET /api/data/exists - Check if data file exists
export default defineEventHandler(async (event) => {
  try {
    const dataPath = '.data/json/data.json'

    const fs = await import('fs/promises')

    try {
      await fs.access(dataPath)
      return {
        exists: true,
        message: 'Data file exists',
        timestamp: new Date().toISOString(),
        filePath: dataPath,
      }
    } catch (accessError) {
      return {
        exists: false,
        message: 'Data file does not exist',
        timestamp: new Date().toISOString(),
        filePath: dataPath,
      }
    }
  } catch (error) {
    console.error('Error checking file existence:', error)

    return {
      exists: false,
      message: 'Error checking file existence',
      error: error.message,
      timestamp: new Date().toISOString(),
    }
  }
})
