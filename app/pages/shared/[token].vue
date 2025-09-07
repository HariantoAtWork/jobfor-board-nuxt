<template>
  <!-- Header -->
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <UILogo class="h-8 w-auto" />
          <span class="ml-2 text-lg font-semibold text-gray-900">
            Shared Board
          </span>
        </div>
        <div class="flex items-center gap-4">
          <div v-if="board" class="text-sm text-gray-500">
            Shared by: {{ board.user_id }}
          </div>
          <div class="flex items-center gap-2">
            <Icon name="mdi:eye" class="w-5 h-5 text-green-600" />
            <span class="text-sm text-gray-600">Public View</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content Area -->
  <main class="overflow-y-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="text-center">
        <Icon
          name="mdi:loading"
          class="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4"
        />
        <p class="text-gray-600">Loading shared board...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center h-full">
      <div class="text-center">
        <Icon
          name="mdi:alert-circle"
          class="w-12 h-12 text-red-500 mx-auto mb-4"
        />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Board Not Found
        </h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="goHome"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>

    <!-- Board Content -->
    <div v-else-if="board" class="bg-white rounded-lg shadow-sm border">
      <div
        v-if="!board.data.columns || board.data.columns.length === 0"
        class="p-8 text-center"
      >
        <Icon
          name="mdi:view-column-outline"
          class="w-12 h-12 text-gray-300 mx-auto mb-4"
        />
        <p class="text-gray-500">This board has no columns yet.</p>
      </div>
      <div v-else class="p-6">
        <div class="flex gap-6 overflow-x-auto pb-4">
          <div
            v-for="column in sortedColumns"
            :key="column.id"
            class="flex-shrink-0 w-80"
          >
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-medium text-gray-900 mb-4">
                {{ column.title }}
              </h3>
              <div class="space-y-3">
                <div
                  v-for="card in getCardsForColumn(column.id)"
                  :key="card.id"
                  class="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                  @click="viewCard(card)"
                >
                  <h4 class="font-medium text-gray-900 mb-2">
                    {{ card.title }}
                  </h4>
                  <p v-if="card.company" class="card-label text-gray-600 mb-2">
                    <Icon name="mdi-light:factory" />{{ card.company }}
                  </p>
                  <p v-if="card.jobTitle" class="card-label text-gray-600 mb-2">
                    <Icon name="mdi-light:briefcase" />{{ card.jobTitle }}
                  </p>
                  <div
                    v-if="card.description"
                    class="card-label text-gray-500 line-clamp-3"
                    style="line-clamp: 3"
                    v-html="makeHtml(card.description)"
                  />
                  <div v-if="card.link" class="mt-3">
                    <a
                      :href="card.link"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="card-label text-blue-600 hover:text-blue-800"
                      @click.stop
                    >
                      <Icon name="mdi:open-in-new" class="w-4 h-4" />
                      View Job
                    </a>
                  </div>
                  <div v-if="card.notes && card.notes.length > 0" class="mt-3">
                    <div class="text-xs text-gray-500">
                      {{ card.notes.length }} note{{
                        card.notes.length !== 1 ? 's' : ''
                      }}
                    </div>
                  </div>

                  <div class="mt-3">
                    <div class="card-label">
                      <Icon name="mdi:clock-outline" />{{
                        cardFormatTime(card.lastMoved, nowStore.now)
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-center gap-4">
        <div class="relative board-info-menu-container">
          <button
            @click="toggleBoardInfoMenu"
            class="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Icon name="mdi:information" class="w-5 h-5" />
            Board Info
            <Icon name="mdi:chevron-down" class="w-4 h-4" />
          </button>

          <!-- Board Info Context Menu -->
          <div
            v-if="showBoardInfoMenu"
            class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[280px]"
          >
            <div class="px-4 py-2 border-b border-gray-100">
              <h4 class="font-medium text-gray-900">Board Information</h4>
            </div>
            <div class="px-4 py-2 space-y-2">
              <div v-if="board">
                <div class="text-sm">
                  <span class="font-medium text-gray-700">Title:</span>
                  <span class="text-gray-900 ml-2">{{ board.title }}</span>
                </div>
                <div class="text-sm">
                  <span class="font-medium text-gray-700">Created:</span>
                  <span class="text-gray-900 ml-2">{{
                    formatDate(board.created_at)
                  }}</span>
                </div>
                <div class="text-sm">
                  <span class="font-medium text-gray-700">Last Updated:</span>
                  <span class="text-gray-900 ml-2">{{
                    formatDate(board.updated_at)
                  }}</span>
                </div>
                <div class="text-sm">
                  <span class="font-medium text-gray-700">Cards:</span>
                  <span class="text-gray-900 ml-2">{{
                    board.data.cards?.length || 0
                  }}</span>
                </div>
                <div class="text-sm">
                  <span class="font-medium text-gray-700">Columns:</span>
                  <span class="text-gray-900 ml-2">{{
                    board.data.columns?.length || 0
                  }}</span>
                </div>
                <div class="text-sm">
                  <span class="font-medium text-gray-700">Status:</span>
                  <span class="text-green-600 ml-2 flex items-center gap-1">
                    <Icon name="mdi:eye" class="w-4 h-4" />
                    Public
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          @click="showHistory = true"
          class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Icon name="mdi:history" class="w-5 h-5" />
          History
        </button>
      </div>
    </div>
  </footer>

  <!-- Card Detail Modal -->
  <div v-if="selectedCard" class="modal-overlay" @click="selectedCard = null">
    <div class="modal-content max-w-2xl" @click.stop>
      <div class="modal-header flex items-center justify-between">
        <h3 class="text-lg font-medium">{{ selectedCard.title }}</h3>
        <button
          @click="selectedCard = null"
          class="text-gray-500 hover:text-gray-700 flex items-center justify-center"
        >
          <Icon name="mdi:close" />
        </button>
      </div>
      <div class="modal-body">
        <div class="space-y-4">
          <div v-if="selectedCard.company">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Company</label
            >
            <p class="text-gray-900">{{ selectedCard.company }}</p>
          </div>
          <div v-if="selectedCard.jobTitle">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Job Title</label
            >
            <p class="text-gray-900">{{ selectedCard.jobTitle }}</p>
          </div>
          <div v-if="selectedCard.location">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Location</label
            >
            <p class="text-gray-900">{{ selectedCard.location }}</p>
          </div>
          <div v-if="selectedCard.description">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Description</label
            >
            <div class="text-gray-900 whitespace-pre-wrap">
              {{ selectedCard.description }}
            </div>
          </div>
          <div v-if="selectedCard.link">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Link</label
            >
            <a
              :href="selectedCard.link"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Icon name="mdi:open-in-new" class="w-4 h-4" />
              {{ selectedCard.link }}
            </a>
          </div>
          <div class="mt-3">
            <div class="card-label">
              <Icon name="mdi:clock-outline" />{{
                cardFormatTime(selectedCard.lastMoved, nowStore.now)
              }}
            </div>
          </div>
          <div v-if="selectedCard.notes && selectedCard.notes.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Notes</label
            >
            <div class="space-y-2">
              <div
                v-for="note in selectedCard.notes"
                :key="note.id"
                class="bg-gray-50 rounded-lg p-3"
              >
                <div
                  class="text-sm text-gray-900 whitespace-pre-wrap"
                  v-html="makeHtml(note.body || '')"
                />
                <div class="text-xs text-gray-500 mt-2">
                  {{ cardFormatTime(note.createdAt, nowStore.now) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Activity History Modal -->
  <div v-if="showHistory" class="modal-overlay" @click="showHistory = false">
    <div class="modal-content max-w-2xl" @click.stop>
      <div class="modal-header flex items-center justify-between">
        <h3 class="text-lg font-medium">Activity History</h3>
        <button
          @click="showHistory = false"
          class="text-gray-500 hover:text-gray-700 flex items-center justify-center"
        >
          <Icon name="mdi:close" />
        </button>
      </div>
      <div class="modal-body pt-0">
        <div
          v-if="activityHistory.length === 0"
          class="text-center text-gray-500 py-8"
        >
          <Icon
            name="mdi:clock-outline"
            class="w-12 h-12 mx-auto mb-4 text-gray-300"
          />
          <p>No activity history yet</p>
        </div>
        <div v-else class="space-y-6">
          <div
            v-for="(group, monthYear) in groupedHistory"
            :key="monthYear"
            class="activity-group"
          >
            <div class="activity-group-header">
              <h4 class="text-sm font-semibold text-gray-700">
                {{ monthYear }}
              </h4>
            </div>
            <div class="activity-group-content">
              <div class="space-y-3">
                <div
                  v-for="activity in group"
                  :key="activity.id"
                  class="activity-item"
                >
                  <div class="flex gap-3">
                    <div class="activity-icon">
                      <Icon
                        :name="
                          activity.type === 'note'
                            ? 'mdi:note-text'
                            : 'mdi:arrow-right'
                        "
                        class="w-4 h-4 text-gray-400"
                      />
                    </div>
                    <div class="activity-content">
                      <div
                        class="text-sm text-gray-900"
                        v-html="makeHtml(activity.description)"
                      ></div>
                      <div class="text-xs text-gray-500 mt-1">
                        {{ formatTime(activity.timestamp) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from '~/utils/dayjs-extend'
import makeHtml from '~/utils/makeHtml'
import { formatTime as cardFormatTime } from '~/utils/dayjs-extend'
import nowStore from '~/store/now'
import type { IBoard, IColumn, ICard } from '~/types'

// Use the shared layout for this page
definePageMeta({
  layout: 'shared',
})

// Get route params
const route = useRoute()
const router = useRouter()
const token = route.params.token as string

// State
const board = ref<IBoard | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedCard = ref<ICard | null>(null)
const showHistory = ref(false)
const showBoardInfoMenu = ref(false)

// Computed
const sortedColumns = computed(() => {
  if (!board.value?.data?.columns) return []
  return [...board.value.data.columns].sort((a, b) => a.order - b.order)
})

// Activity History
const activityHistory = computed(() => {
  const history: Array<{
    id: string
    description: string
    timestamp: string
    type: 'movement' | 'note'
  }> = []

  if (!board.value?.data?.cards) return history

  // Collect all card movements from history
  board.value.data.cards.forEach((card: ICard) => {
    if (card.history && card.history.length > 0) {
      card.history.forEach((entry: any) => {
        history.push({
          id: entry.id,
          description: `**${card.title}** moved to **${entry.columnTitle}**`,
          timestamp: entry.timestamp,
          type: 'movement',
        })
      })
    }

    // Collect all notes from cards
    if (card.notes && card.notes.length > 0) {
      card.notes.forEach((note: any) => {
        history.push({
          id: note.id,
          description: `**${card.title}** - 🗒️ Note: **${note.title}**`,
          timestamp: note.createdAt,
          type: 'note',
        })
      })
    }
  })

  // Sort by timestamp (newest first)
  return history.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
})

const groupedHistory = computed(() => {
  const groups: Record<string, any[]> = {}

  activityHistory.value.forEach((activity) => {
    const date = dayjs(activity.timestamp)
    const monthYear = date.format('MMMM YYYY')

    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    groups[monthYear].push(activity)
  })

  return groups
})

// Methods
const getCardsForColumn = (columnId: string) => {
  if (!board.value?.data?.cards) return []
  return board.value.data.cards
    .filter((card: ICard) => card.columnId === columnId)
    .sort((a, b) => (a as any).order - (b as any).order)
}

const viewCard = (card: ICard) => {
  selectedCard.value = card
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const goHome = () => {
  router.push('/')
}

const toggleBoardInfoMenu = () => {
  showBoardInfoMenu.value = !showBoardInfoMenu.value
}

// Click outside handler for board info menu
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.board-info-menu-container')) {
    showBoardInfoMenu.value = false
  }
}

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Load shared board
const loadSharedBoard = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await fetch(`/api/shared/${token}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          'This shared board was not found or is no longer available.'
        )
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      board.value = result.data
    } else {
      throw new Error(result.message || 'Failed to load shared board')
    }
  } catch (err) {
    console.error('Error loading shared board:', err)
    error.value = err instanceof Error ? err.message : 'Unknown error occurred'
  } finally {
    loading.value = false
  }
}

// Load board on mount
onMounted(() => {
  if (token) {
    loadSharedBoard()
  } else {
    error.value = 'Invalid share token'
    loading.value = false
  }
})

// Set page title
useHead({
  title: computed(() =>
    board.value ? `${board.value.title} - Shared Board` : 'Shared Board'
  ),
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
