<template>
  <div class="undo-redo-buttons flex items-center gap-2">
    <!-- Undo Button -->
    <button
      @click="handleUndo"
      :disabled="!canUndo"
      :title="undoDescription ? `Undo: ${undoDescription}` : 'Nothing to undo'"
      class="undo-button flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
      :class="[
        canUndo
          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
          : 'bg-gray-50 text-gray-400 cursor-not-allowed',
      ]"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
        />
      </svg>
      Undo
      <span v-if="canUndo" class="text-xs text-gray-500">(Ctrl+Z)</span>
    </button>

    <!-- Redo Button -->
    <button
      @click="handleRedo"
      :disabled="!canRedo"
      :title="redoDescription ? `Redo: ${redoDescription}` : 'Nothing to redo'"
      class="redo-button flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
      :class="[
        canRedo
          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
          : 'bg-gray-50 text-gray-400 cursor-not-allowed',
      ]"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
        />
      </svg>
      Redo
      <span v-if="canRedo" class="text-xs text-gray-500">(Ctrl+Y)</span>
    </button>

    <!-- History Button (Optional) -->
    <button
      @click="toggleHistory"
      class="history-button flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200"
      title="View command history"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      History
    </button>
  </div>

  <!-- History Modal -->
  <div
    v-if="showHistory"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="closeHistory"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
      @click.stop
    >
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-lg font-semibold text-gray-900">Command History</h3>
        <button
          @click="closeHistory"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto max-h-96">
        <div v-if="history.length === 0" class="text-center text-gray-500 py-8">
          No commands in history
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(entry, index) in history"
            :key="index"
            class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div
              class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <span class="text-xs font-medium text-blue-600">{{
                history.length - index
              }}</span>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-medium text-gray-900">{{
                  entry.description
                }}</span>
                <span
                  class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded"
                  >{{ entry.type }}</span
                >
              </div>
              <div class="text-xs text-gray-500">
                {{ formatTimestamp(entry.timestamp) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between p-6 border-t bg-gray-50">
        <div class="text-sm text-gray-600">
          {{ history.length }} commands in history
        </div>
        <button
          @click="clearHistory"
          class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          Clear History
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  canUndo: boolean
  canRedo: boolean
  undoDescription: string | null
  redoDescription: string | null
  history: Array<{
    command: any
    description: string
    type: string
    timestamp: Date
  }>
}

interface Emits {
  (e: 'undo'): void
  (e: 'redo'): void
  (e: 'clear-history'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showHistory = ref(false)

const handleUndo = () => {
  if (props.canUndo) {
    emit('undo')
  }
}

const handleRedo = () => {
  if (props.canRedo) {
    emit('redo')
  }
}

const toggleHistory = () => {
  showHistory.value = !showHistory.value
}

const closeHistory = () => {
  showHistory.value = false
}

const clearHistory = () => {
  emit('clear-history')
  closeHistory()
}

const formatTimestamp = (timestamp: Date) => {
  return timestamp.toLocaleString()
}
</script>

<style scoped>
.undo-button:disabled,
.redo-button:disabled {
  pointer-events: none;
}

.undo-button:not(:disabled):hover,
.redo-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
