// POST /api/data/backup - Create a backup of the data file
export default defineEventHandler(async (event) => {
  try {
    const dataPath = '.data/json/data.json'
    const backupDir = '.data/backups'

    const fs = await import('fs/promises')
    const path = await import('path')

    // Check if source file exists
    try {
      await fs.access(dataPath)
    } catch (accessError) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Source data file does not exist',
      })
    }

    // Create backup directory if it doesn't exist
    await fs.mkdir(backupDir, { recursive: true })

    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFilename = `data-backup-${timestamp}.json`
    const backupPath = path.join(backupDir, backupFilename)

    // Read source file and create backup
    const data = await fs.readFile(dataPath, 'utf-8')
    await fs.writeFile(backupPath, data, 'utf-8')

    // Get backup file stats
    const backupStats = await fs.stat(backupPath)

    return {
      success: true,
      message: 'Backup created successfully',
      timestamp: new Date().toISOString(),
      sourceFile: dataPath,
      backupFile: backupPath,
      backupFilename: backupFilename,
      backupInfo: {
        size: backupStats.size,
        sizeFormatted: formatBytes(backupStats.size),
        created: backupStats.birthtime,
      },
    }
  } catch (error) {
    console.error('Error creating backup:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create backup',
      data: {
        error: error.message,
      },
    })
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
