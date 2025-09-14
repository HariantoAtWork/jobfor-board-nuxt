<template>
  <div class="storage-recovery">
    <!-- Storage Status Banner -->
    <div v-if="storageInfo.isCorrupted" class="storage-error-banner">
      <div
        class="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
      >
        <Icon name="mdi:alert-circle" class="w-6 h-6 text-red-600" />
        <div class="flex-1">
          <h3 class="font-semibold text-red-800">Storage Data Corrupted</h3>
          <p class="text-sm text-red-700">
            Your browser storage data appears to be corrupted. This can happen
            due to browser updates, storage limits, or other issues. You can
            recover your data using the options below.
          </p>
          <p v-if="storageInfo.errorMessage" class="text-xs text-red-600 mt-1">
            Error: {{ storageInfo.errorMessage }}
          </p>
        </div>
        <button
          @click="showRecoveryModal = true"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Recover Data
        </button>
      </div>
    </div>

    <!-- Storage Recovery Modal -->
    <UIModal
      :is-open="showRecoveryModal"
      title="Storage Data Recovery"
      size="4xl"
      @close="showRecoveryModal = false"
      :show-footer="false"
    >
      <div class="space-y-6">
        <!-- Current Status -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-800 mb-2">
            Current Storage Status
          </h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Main Data:</span>
              <span
                :class="storageInfo.hasData ? 'text-green-600' : 'text-red-600'"
              >
                {{ storageInfo.hasData ? 'Present' : 'Missing' }}
              </span>
            </div>
            <div>
              <span class="text-gray-600">Backup Data:</span>
              <span
                :class="
                  storageInfo.hasBackup ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ storageInfo.hasBackup ? 'Present' : 'Missing' }}
              </span>
            </div>
            <div>
              <span class="text-gray-600">Data Size:</span>
              <span class="text-gray-800">{{
                formatBytes(storageInfo.dataSize)
              }}</span>
            </div>
            <div>
              <span class="text-gray-600">Status:</span>
              <span
                :class="
                  storageInfo.isCorrupted ? 'text-red-600' : 'text-green-600'
                "
              >
                {{ storageInfo.isCorrupted ? 'Corrupted' : 'Healthy' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Recovery Options -->
        <div class="space-y-4">
          <h4 class="font-semibold text-gray-800">Recovery Options</h4>

          <!-- Option 1: Export All Data (Recommended) -->
          <div class="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div class="flex items-start gap-3">
              <Icon name="mdi:download" class="w-6 h-6 text-blue-600 mt-1" />
              <div class="flex-1">
                <h5 class="font-medium text-blue-800">
                  Export All Data (Recommended)
                </h5>
                <p class="text-sm text-blue-700 mb-3">
                  <strong>First step:</strong> Export all your localStorage data
                  to a JSON file before attempting any recovery. This ensures
                  you have a complete backup of everything.
                </p>
                <button
                  @click="exportAllLocalStorage"
                  :disabled="isRecovering"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon
                    v-if="isRecovering"
                    name="mdi:loading"
                    class="w-4 h-4 animate-spin mr-2"
                  />
                  Export All Data
                </button>
              </div>
            </div>
          </div>

          <!-- Option 2: Try Automatic Recovery -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon name="mdi:auto-fix" class="w-6 h-6 text-blue-600 mt-1" />
              <div class="flex-1">
                <h5 class="font-medium text-gray-800">Automatic Recovery</h5>
                <p class="text-sm text-gray-600 mb-3">
                  Try to automatically fix corrupted data using built-in
                  recovery mechanisms.
                </p>
                <button
                  @click="tryAutomaticRecovery"
                  :disabled="isRecovering"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon
                    v-if="isRecovering"
                    name="mdi:loading"
                    class="w-4 h-4 animate-spin mr-2"
                  />
                  Try Automatic Recovery
                </button>
              </div>
            </div>
          </div>

          <!-- Option 3: Restore from Backup -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon
                name="mdi:backup-restore"
                class="w-6 h-6 text-green-600 mt-1"
              />
              <div class="flex-1">
                <h5 class="font-medium text-gray-800">Restore from Backup</h5>
                <p class="text-sm text-gray-600 mb-3">
                  Restore your data from the automatic backup (if available).
                </p>
                <button
                  @click="restoreFromBackup"
                  :disabled="isRecovering || !storageInfo.hasBackup"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon
                    v-if="isRecovering"
                    name="mdi:loading"
                    class="w-4 h-4 animate-spin mr-2"
                  />
                  Restore from Backup
                </button>
              </div>
            </div>
          </div>

          <!-- Option 4: Manual Backups -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon name="mdi:archive" class="w-6 h-6 text-purple-600 mt-1" />
              <div class="flex-1">
                <h5 class="font-medium text-gray-800">Manual Backups</h5>
                <p class="text-sm text-gray-600 mb-3">
                  Restore from manually created backups.
                </p>

                <div
                  v-if="manualBackups.length === 0"
                  class="text-sm text-gray-500 mb-3"
                >
                  No manual backups found.
                </div>

                <div v-else class="space-y-2 mb-3">
                  <div
                    v-for="backup in manualBackups"
                    :key="backup.id"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p class="text-sm font-medium text-gray-800">
                        {{ backup.description }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ formatDate(backup.timestamp) }} •
                        {{ formatBytes(backup.size) }}
                      </p>
                    </div>
                    <button
                      @click="restoreFromManualBackup(backup.id)"
                      :disabled="isRecovering"
                      class="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Restore
                    </button>
                  </div>
                </div>

                <button
                  @click="refreshManualBackups"
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Refresh Backups
                </button>
              </div>
            </div>
          </div>

          <!-- Option 5: Import from File -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon
                name="mdi:file-import"
                class="w-6 h-6 text-orange-600 mt-1"
              />
              <div class="flex-1">
                <h5 class="font-medium text-gray-800">Import from File</h5>
                <p class="text-sm text-gray-600 mb-3">
                  Import your data from a previously exported backup file.
                </p>
                <div class="flex gap-2">
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".json"
                    @change="handleFileImport"
                    class="hidden"
                  />
                  <button
                    @click="triggerFileImport"
                    :disabled="isRecovering"
                    class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Icon
                      v-if="isRecovering"
                      name="mdi:loading"
                      class="w-4 h-4 animate-spin mr-2"
                    />
                    Choose File
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Option 6: Reset to Default -->
          <div class="border border-red-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon name="mdi:alert-circle" class="w-6 h-6 text-red-600 mt-1" />
              <div class="flex-1">
                <h5 class="font-medium text-red-800">Reset to Default</h5>
                <p class="text-sm text-red-600 mb-3">
                  <strong>Warning:</strong> This will permanently delete all
                  your data and reset to a fresh board. Only use this if all
                  other recovery options have failed.
                </p>
                <button
                  @click="confirmReset"
                  :disabled="isRecovering"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Backup Current Data -->
        <div class="border-t pt-4">
          <h4 class="font-semibold text-gray-800 mb-3">Create Backup</h4>
          <div class="flex gap-2">
            <button
              @click="createBackup"
              :disabled="isRecovering"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon
                v-if="isRecovering"
                name="mdi:loading"
                class="w-4 h-4 animate-spin mr-2"
              />
              Create Manual Backup
            </button>
            <button
              @click="exportToFile"
              :disabled="isRecovering"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Export to File
            </button>
          </div>
        </div>
      </div>
    </UIModal>

    <!-- Confirmation Modal -->
    <UIModal
      :is-open="showConfirmModal"
      title="Confirm Reset"
      @close="showConfirmModal = false"
      @confirm="performReset"
      confirm-text="Reset to Default"
      confirm-class="bg-red-600 hover:bg-red-700"
    >
      <div class="text-center">
        <Icon
          name="mdi:alert-circle"
          class="w-12 h-12 text-red-600 mx-auto mb-4"
        />
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Are you sure?</h3>
        <p class="text-gray-600">
          This will permanently delete all your data and reset to a fresh board.
          This action cannot be undone.
        </p>
      </div>
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { StorageBackup, StorageInfo } from '~/utils/storageBackup'
import {
  getStorageInfo,
  createManualBackup,
  getAllManualBackups,
  restoreFromBackup,
  restoreFromAutomaticBackup,
  exportStorageToFile,
  importStorageFromFile,
  resetToDefaultData,
} from '~/utils/storageBackup'
import { useBoardWithCommands } from '~/composables/useBoardWithCommands'
import dayjs from '~/utils/dayjs-extend'

// Props
interface Props {
  showBanner?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showBanner: true,
})

// Emits
const emit = defineEmits<{
  recovered: []
  reset: []
}>()

// Use the board composable
const { recoverFromCorruption } = useBoardWithCommands()

// State
const showRecoveryModal = ref(false)
const showConfirmModal = ref(false)
const isRecovering = ref(false)
const storageInfo = ref<StorageInfo>({
  hasData: false,
  hasBackup: false,
  dataSize: 0,
  backupSize: 0,
  lastModified: null,
  isCorrupted: false,
})
const manualBackups = ref<StorageBackup[]>([])
const fileInput = ref<HTMLInputElement>()

// Computed
const shouldShowBanner = computed(() => {
  return props.showBanner && storageInfo.value.isCorrupted
})

// Methods
const refreshStorageInfo = () => {
  storageInfo.value = getStorageInfo()
}

const refreshManualBackups = () => {
  manualBackups.value = getAllManualBackups()
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (timestamp: string): string => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

const exportAllLocalStorage = () => {
  try {
    const allData: Record<string, any> = {}

    // Get all localStorage data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        try {
          // Try to parse as JSON first
          allData[key] = JSON.parse(localStorage.getItem(key) || '')
        } catch (e) {
          // If not JSON, store as string
          allData[key] = localStorage.getItem(key)
        }
      }
    }

    // Create download
    const dataStr = JSON.stringify(allData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `localStorage-backup-${dayjs().format('YYYY-MM-DD')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log('✅ All localStorage data exported!')
    alert('All localStorage data exported successfully!')
  } catch (error) {
    console.error('Failed to export localStorage data:', error)
    alert('Failed to export localStorage data. Please try again.')
  }
}

const tryAutomaticRecovery = async () => {
  isRecovering.value = true
  try {
    recoverFromCorruption()
    refreshStorageInfo()
    emit('recovered')
    alert('Automatic recovery completed successfully!')
  } catch (error) {
    console.error('Automatic recovery failed:', error)
    alert('Automatic recovery failed. Please try other recovery options.')
  } finally {
    isRecovering.value = false
  }
}

const restoreFromBackup = async () => {
  isRecovering.value = true
  try {
    const success = restoreFromAutomaticBackup()
    if (success) {
      refreshStorageInfo()
      emit('recovered')
      alert('Data restored from automatic backup successfully!')
    } else {
      alert('Failed to restore from automatic backup.')
    }
  } catch (error) {
    console.error('Backup restoration failed:', error)
    alert('Failed to restore from backup.')
  } finally {
    isRecovering.value = false
  }
}

const restoreFromManualBackup = async (backupId: string) => {
  isRecovering.value = true
  try {
    const success = restoreFromBackup(backupId)
    if (success) {
      refreshStorageInfo()
      emit('recovered')
      alert('Data restored from manual backup successfully!')
    } else {
      alert('Failed to restore from manual backup.')
    }
  } catch (error) {
    console.error('Manual backup restoration failed:', error)
    alert('Failed to restore from manual backup.')
  } finally {
    isRecovering.value = false
  }
}

const createBackup = async () => {
  isRecovering.value = true
  try {
    const backup = createManualBackup()
    if (backup) {
      refreshManualBackups()
      alert(`Manual backup created successfully: ${backup.description}`)
    } else {
      alert('Failed to create manual backup.')
    }
  } catch (error) {
    console.error('Backup creation failed:', error)
    alert('Failed to create manual backup.')
  } finally {
    isRecovering.value = false
  }
}

const exportToFile = () => {
  try {
    exportStorageToFile()
    alert('Data exported to file successfully!')
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to export data to file.')
  }
}

const triggerFileImport = () => {
  fileInput.value?.click()
}

const handleFileImport = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  isRecovering.value = true
  try {
    await importStorageFromFile(file)
    refreshStorageInfo()
    emit('recovered')
    alert('Data imported from file successfully!')
  } catch (error) {
    console.error('Import failed:', error)
    alert(
      `Failed to import data: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
  } finally {
    isRecovering.value = false
    // Reset file input
    if (target) target.value = ''
  }
}

const confirmReset = () => {
  showConfirmModal.value = true
}

const performReset = () => {
  isRecovering.value = true
  try {
    resetToDefaultData()
    refreshStorageInfo()
    emit('reset')
    alert('Board reset to default successfully!')
  } catch (error) {
    console.error('Reset failed:', error)
    alert('Failed to reset board.')
  } finally {
    isRecovering.value = false
    showConfirmModal.value = false
  }
}

// Lifecycle
onMounted(() => {
  refreshStorageInfo()
  refreshManualBackups()
})

// Expose methods for parent components
defineExpose({
  refreshStorageInfo,
  showRecoveryModal: () => {
    showRecoveryModal.value = true
  },
})
</script>

<style scoped>
.storage-recovery {
  @apply w-full;
}

.storage-error-banner {
  @apply mb-4;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
