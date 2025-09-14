# Storage Recovery Testing Scripts

This document contains JavaScript injection scripts for testing the Storage Recovery System. These scripts simulate various localStorage corruption scenarios to help you test the recovery functionality.

## 🚀 Quick Start

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Copy and paste any script below
4. Press Enter to execute
5. Refresh the page to see the recovery system in action

## 🧪 Test Scenarios

### 1. Complete localStorage Corruption

**Purpose**: Simulates completely corrupted localStorage data

```javascript
// Complete corruption - invalid JSON
localStorage.setItem('job-application-board', '{"corrupted": true, "invalid": json}');
localStorage.setItem('job-application-board-backup', 'not-valid-json-at-all');
console.log('✅ localStorage completely corrupted! Refresh the page to see the recovery system.');
```

**Expected Result**: Red error banner, "Corrupted" status, recovery options available

---

### 2. Partial Data Corruption

**Purpose**: Simulates partially corrupted data with wrong data types

```javascript
// Partial corruption - wrong data types
localStorage.setItem('job-application-board', JSON.stringify({
  id: "corrupted-board",
  columns: "this-should-be-an-array",
  cards: null,
  invalidField: undefined
}));
console.log('✅ localStorage partially corrupted! Refresh the page to see the recovery system.');
```

**Expected Result**: Data validation errors, recovery system activated

---

### 3. Malformed JSON Structure

**Purpose**: Simulates valid JSON but invalid data structure

```javascript
// Malformed structure - valid JSON but wrong schema
localStorage.setItem('job-application-board', '{"id": "test", "columns": [{"id": "col1", "title": "Test", "order": 1}], "cards": [{"id": "card1", "title": "Test Card", "columnId": "col1", "createdAt": "2025-01-01T00:00:00.000Z", "lastMoved": "2025-01-01T00:00:00.000Z", "history": [], "notes": []}], "extra": "data"}');
localStorage.setItem('job-application-board-backup', '{"id": "backup", "columns": [], "cards": []}');
console.log('✅ localStorage has malformed data! Refresh the page to see the recovery system.');
```

**Expected Result**: Structure validation errors, sanitization attempts

---

### 4. Storage Quota Exceeded Simulation

**Purpose**: Simulates localStorage quota issues

```javascript
// Storage quota exceeded
try {
  // Fill up localStorage with junk data
  for (let i = 0; i < 1000; i++) {
    localStorage.setItem(`junk-${i}`, 'x'.repeat(1000));
  }
  // Then try to save corrupted data
  localStorage.setItem('job-application-board', '{"corrupted": true}');
} catch (e) {
  console.log('✅ Storage quota exceeded! Refresh the page to see the recovery system.');
}
```

**Expected Result**: Storage quota errors, recovery system handles gracefully

---

### 5. Mixed Valid/Invalid Data

**Purpose**: Simulates data with some valid and some invalid fields

```javascript
// Mixed valid/invalid data
localStorage.setItem('job-application-board', JSON.stringify({
  id: "mixed-board",
  columns: [
    { id: "col1", title: "Valid Column", order: 1, description: "" }
  ],
  cards: [
    {
      id: "card1",
      title: "Valid Card",
      columnId: "col1",
      createdAt: "2025-01-01T00:00:00.000Z",
      lastMoved: "2025-01-01T00:00:00.000Z",
      history: [],
      notes: [],
      invalidField: "this-should-not-be-here"
    }
  ]
}));
console.log('✅ localStorage has mixed valid/invalid data! Refresh the page to see the recovery system.');
```

**Expected Result**: Data sanitization, invalid fields removed

---

### 6. Empty/Null Data

**Purpose**: Simulates empty or null localStorage data

```javascript
// Empty/null data
localStorage.setItem('job-application-board', '');
localStorage.setItem('job-application-board-backup', null);
console.log('✅ localStorage has empty/null data! Refresh the page to see the recovery system.');
```

**Expected Result**: Default data loading, no corruption banner

---

### 7. Old Data Format Simulation

**Purpose**: Simulates old data format that needs migration

```javascript
// Old data format (pre-migration)
localStorage.setItem('job-application-board', JSON.stringify({
  id: "old-board",
  columns: [
    { id: "col1", title: "Old Column" } // Missing order field
  ],
  cards: [
    {
      id: "card1",
      title: "Old Card",
      column_id: "col1", // Old field name
      created_at: "2025-01-01T00:00:00.000Z", // Old field name
      last_moved: "2025-01-01T00:00:00.000Z", // Old field name
      place: "Old Location", // Old field name
      job_title: "Old Job Title", // Old field name
      history: [],
      notes: []
    }
  ]
}));
console.log('✅ localStorage has old data format! Refresh the page to see migration in action.');
```

**Expected Result**: Data migration, field name updates

---

### 8. Circular Reference Data

**Purpose**: Simulates data with circular references

```javascript
// Circular reference data
const circularData = {
  id: "circular-board",
  columns: [],
  cards: []
};
circularData.self = circularData; // Create circular reference

try {
  localStorage.setItem('job-application-board', JSON.stringify(circularData));
} catch (e) {
  console.log('✅ Circular reference detected! Refresh the page to see the recovery system.');
}
```

**Expected Result**: JSON serialization errors, recovery system activated

---

## 🧹 Cleanup Scripts

### Complete localStorage Reset

```javascript
// Complete reset - clears everything
localStorage.clear();
console.log('✅ localStorage completely cleared! Refresh the page to see fresh state.');
```

### Job Board Data Only Reset

```javascript
// Reset only job board related data
localStorage.removeItem('job-application-board');
localStorage.removeItem('job-application-board-backup');
localStorage.removeItem('job-application-board-version');
localStorage.removeItem('job-application-board-recovery');

// Clear all manual backups
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith('job-application-board-manual-backup-')) {
    localStorage.removeItem(key);
  }
}
console.log('✅ Job board data cleared! Refresh the page to see fresh state.');
```

### Remove Junk Data Only

```javascript
// Remove only junk data (from quota test)
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith('junk-')) {
    localStorage.removeItem(key);
  }
}
console.log('✅ Junk data removed! Job board data preserved.');
```

## 🔍 Inspection Scripts

### Check Current Storage Status

```javascript
// Check current storage status
const storageInfo = {
  hasMainData: !!localStorage.getItem('job-application-board'),
  hasBackup: !!localStorage.getItem('job-application-board-backup'),
  hasVersion: !!localStorage.getItem('job-application-board-version'),
  hasRecovery: !!localStorage.getItem('job-application-board-recovery'),
  manualBackups: 0,
  totalSize: 0
};

// Count manual backups
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith('job-application-board-manual-backup-')) {
    storageInfo.manualBackups++;
  }
}

// Calculate total size
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith('job-application-board')) {
    storageInfo.totalSize += localStorage.getItem(key).length;
  }
}

console.log('📊 Storage Status:', storageInfo);
```

### Validate Current Data

```javascript
// Validate current data structure
try {
  const data = localStorage.getItem('job-application-board');
  if (data) {
    const parsed = JSON.parse(data);
    console.log('✅ Data is valid JSON');
    console.log('📋 Data structure:', {
      hasId: !!parsed.id,
      hasColumns: Array.isArray(parsed.columns),
      hasCards: Array.isArray(parsed.cards),
      columnCount: parsed.columns?.length || 0,
      cardCount: parsed.cards?.length || 0
    });
  } else {
    console.log('❌ No main data found');
  }
} catch (e) {
  console.log('❌ Data is corrupted:', e.message);
}
```

### List All Storage Keys

```javascript
// List all localStorage keys
console.log('🔑 All localStorage keys:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`  ${key}: ${value.length} characters`);
}
```

## 🎯 Testing Workflow

### Recommended Testing Sequence

1. **Start Fresh**
   ```javascript
   localStorage.clear();
   ```

2. **Test Normal Flow**
   - Refresh page
   - Create some cards and columns
   - Verify everything works

3. **Test Corruption Scenarios**
   - Use corruption scripts one by one
   - Test each recovery option
   - Verify data restoration

4. **Test Edge Cases**
   - Try multiple corruption types
   - Test recovery with no backup
   - Test recovery with corrupted backup

5. **Clean Up**
   - Use cleanup scripts between tests
   - Verify fresh state

### What to Look For

After injecting corrupted data and refreshing:

- ✅ **Red Error Banner**: Appears at top of page
- ✅ **Recovery Button**: "Recover Data" button visible
- ✅ **Recovery Modal**: Opens with multiple options
- ✅ **Storage Status**: Shows "Corrupted" status
- ✅ **Error Messages**: Specific error information displayed
- ✅ **Recovery Options**: All recovery methods work
- ✅ **Data Restoration**: Data is properly restored

### Console Monitoring

Keep the browser console open to monitor:

- Error messages during corruption
- Recovery process logs
- Data validation results
- Migration messages
- Success/failure notifications

## 🚨 Troubleshooting

### Common Issues

**Script doesn't execute**
- Check console for syntax errors
- Ensure you're in the correct domain
- Try refreshing the page first

**Recovery system doesn't appear**
- Check if the StorageRecovery component is loaded
- Verify the corruption was applied correctly
- Check console for component errors

**Recovery fails**
- Check console for detailed error messages
- Verify backup data exists
- Try different recovery options

### Debug Commands

```javascript
// Check if StorageRecovery component is loaded
console.log('StorageRecovery loaded:', !!document.querySelector('.storage-recovery'));

// Check storage info
console.log('Storage info:', {
  main: localStorage.getItem('job-application-board'),
  backup: localStorage.getItem('job-application-board-backup')
});

// Force refresh storage info
if (window.storageRecoveryRef) {
  window.storageRecoveryRef.refreshStorageInfo();
}
```

## 📝 Notes

- These scripts are for testing purposes only
- Always use cleanup scripts between tests
- Keep backups of important data before testing
- Test in a development environment first
- Some scripts may cause the page to reload automatically

## 🔄 Updates

This document will be updated as new testing scenarios are discovered or the Storage Recovery System is enhanced.

---

**Happy Testing!** 🧪✨
