# Storage Recovery System

## Overview

The Storage Recovery System is a comprehensive solution for handling browser localStorage corruption issues that can cause 500 errors in the Job Application Tracker. This system provides multiple recovery options and backup mechanisms to ensure users never lose their data.

## Problem Solved

Some users experience 500 errors when their browser localStorage becomes corrupted due to:
- Browser updates
- Storage quota limits
- Browser crashes
- Malformed data from previous versions
- Cross-origin issues

The Storage Recovery System detects these issues and provides multiple recovery paths.

## Features

### 1. Automatic Corruption Detection
- Real-time monitoring of localStorage health
- Visual error banners when corruption is detected
- Detailed error reporting with specific error messages

### 2. Multiple Recovery Options

#### Automatic Recovery
- Attempts to fix corrupted data using built-in recovery mechanisms
- Uses existing data validation and sanitization systems
- Falls back to backup data if available

#### Backup Restoration
- Restores from automatic backups created before data operations
- Validates backup data before restoration
- Creates new backup of current data before restoring

#### Manual Backup Management
- Create manual backups with custom descriptions
- List and manage all manual backups
- Restore from any manual backup
- Delete old backups to free up space

#### File Import/Export
- Export current data to JSON file for external backup
- Import data from previously exported files
- Validates imported data before restoration

#### Emergency Reset
- Reset to default board when all other options fail
- Confirmation dialog to prevent accidental resets
- Preserves recovery data for potential future restoration

### 3. Storage Information Dashboard
- Shows current storage status (healthy/corrupted)
- Displays data size and backup availability
- Provides detailed error messages when issues occur

## How to Use

### For Users Experiencing Issues

1. **Automatic Detection**: If you see a red error banner at the top of the page, your storage is corrupted
2. **Click "Recover Data"**: This opens the recovery interface
3. **Try Recovery Options in Order**:
   - First: Try "Automatic Recovery"
   - Second: "Restore from Backup" (if available)
   - Third: "Manual Backups" (if you created any)
   - Fourth: "Import from File" (if you have exported data)
   - Last Resort: "Reset to Default"

### For Proactive Backup

1. **Access Storage Recovery**: Go to File menu → Storage Recovery
2. **Create Manual Backup**: Click "Create Manual Backup" with a description
3. **Export to File**: Click "Export to File" to download a backup file
4. **Store Safely**: Keep the exported file in a safe location

### For Developers

#### Integration
```typescript
import { getStorageInfo, createManualBackup } from '~/utils/storageBackup'

// Check storage health
const info = getStorageInfo()
if (info.isCorrupted) {
  // Handle corruption
}

// Create backup before risky operations
const backup = createManualBackup('Before major update')
```

#### API Reference

**Storage Information**
```typescript
interface StorageInfo {
  hasData: boolean
  hasBackup: boolean
  dataSize: number
  backupSize: number
  lastModified: string | null
  isCorrupted: boolean
  errorMessage?: string
}
```

**Backup Management**
```typescript
// Create manual backup
const backup = createManualBackup(description?: string): StorageBackup | null

// Get all manual backups
const backups = getAllManualBackups(): StorageBackup[]

// Restore from backup
const success = restoreFromBackup(backupId: string): boolean

// Delete backup
const success = deleteManualBackup(backupId: string): boolean
```

**File Operations**
```typescript
// Export to file
exportStorageToFile(): void

// Import from file
importStorageFromFile(file: File): Promise<boolean>
```

## Technical Implementation

### Files Created
- `app/utils/storageBackup.ts` - Core backup and recovery logic
- `app/components/UI/StorageRecovery.vue` - User interface component
- Integration in `app/components/Board/Board.vue` - Main board integration

### Key Features
- **Data Validation**: All data is validated before backup/restore operations
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Backup Management**: Automatic and manual backup creation with metadata
- **Recovery Mechanisms**: Multiple fallback options for different scenarios
- **Storage Monitoring**: Real-time health monitoring and corruption detection

### Storage Keys Used
- `job-application-board` - Main application data
- `job-application-board-backup` - Automatic backup
- `job-application-board-manual-backup-*` - Manual backups
- `job-application-board-recovery` - Emergency recovery data
- `job-application-board-version` - Data version tracking

## Best Practices

### For Users
1. **Regular Backups**: Create manual backups before major changes
2. **Export Files**: Periodically export data to files for external storage
3. **Monitor Storage**: Watch for corruption warnings and act quickly
4. **Safe Recovery**: Try recovery options in order, don't jump to reset

### For Developers
1. **Validate Data**: Always validate data before storage operations
2. **Create Backups**: Create backups before risky operations
3. **Handle Errors**: Implement proper error handling for storage operations
4. **Monitor Health**: Check storage health periodically

## Troubleshooting

### Common Issues

**"Storage access error"**
- Browser security restrictions
- Private/incognito mode limitations
- Try in normal browsing mode

**"Cannot backup corrupted data"**
- Data is too corrupted to backup
- Try automatic recovery first
- Use file import if you have external backup

**"Backup restoration failed"**
- Backup data is also corrupted
- Try manual backups or file import
- Reset to default as last resort

### Recovery Steps
1. Check browser console for detailed error messages
2. Try recovery options in the recommended order
3. If all else fails, reset to default and start fresh
4. Contact support with error details if issues persist

## Future Enhancements

- Cloud backup integration
- Automatic backup scheduling
- Cross-device data synchronization
- Advanced data compression
- Backup encryption for sensitive data
