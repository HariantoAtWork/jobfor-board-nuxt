// DELETE /api/data - Delete JSON data file
export default defineEventHandler(async (event) => {
  try {
    const dataPath = '.data/json/data.json'

    // Check if file exists
    const fs = await import('fs/promises')

    try {
      await fs.access(dataPath)
    } catch (accessError) {
      return {
        success: false,
        message: 'Data file does not exist',
        timestamp: new Date().toISOString(),
      }
    }

    // Delete the file
    await fs.unlink(dataPath)

    // Try to remove empty directories
    const path = await import('path')
    const dirPath = path.dirname(dataPath)

    try {
      const dirContents = await fs.readdir(dirPath)
      if (dirContents.length === 0) {
        await fs.rmdir(dirPath)
      }
    } catch (dirError) {
      // Ignore directory removal errors
    }

    return {
      success: true,
      message: 'Data file deleted successfully',
      timestamp: new Date().toISOString(),
      filePath: dataPath,
    }
  } catch (error) {
    console.error('Error deleting data:', error)

    return {
      success: false,
      message: 'Failed to delete data file',
      error: error.message,
      timestamp: new Date().toISOString(),
    }
  }
})
