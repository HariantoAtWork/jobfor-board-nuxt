<template>
  <div class="card-notes">
    <div class="card-note-header">
      <h3 class="text-sm font-medium text-gray-700 card-label">
        <Icon name="mdi-light:note-text" />
        Notes ({{ sortedNotes.length }})
      </h3>
    </div>

    <div class="card-note-content">
      <section>
        <!-- Add Note Button -->
        <div
          v-if="isEditing && !showAddForm && !editingNote"
          class="card-note-footer"
        >
          <button @click="showAddForm = true" class="card-note-add-button">
            <Icon name="mdi-light:plus" />
            Add Note
          </button>
        </div>

        <!-- Add Note Form -->
        <div v-if="isEditing && showAddForm" class="add-note-form bg-yellow-50">
          <div class="form-group">
            <label class="form-label">Title</label>
            <input
              v-model="newNote.title"
              type="text"
              class="form-input"
              placeholder="Note title"
              @keyup.enter="addNote"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Content (optional)</label>
            <textarea
              v-model="newNote.body"
              class="form-textarea"
              rows="3"
              placeholder="Note content (optional)..."
              @keyup.ctrl.enter="addNote"
            ></textarea>
          </div>
          <div class="form-actions">
            <button
              @click="addNote"
              class="btn btn-primary"
              :disabled="!canAddNote"
            >
              Add Note
            </button>
            <button @click="cancelAddNote" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
        <!-- Add Note Form End -->
      </section>

      <!-- Existing Notes -->
      <div v-for="note in sortedNotes" :key="note.id" class="card-note-item">
        <!-- View Mode -->
        <div v-if="!isEditingNote(note.id)">
          <div
            v-if="!isEditing"
            class="note-header clickable"
            @click="toggleNoteExpansion(note.id)"
            :title="isNoteExpanded(note.id) ? 'Collapse note' : 'Expand note'"
          >
            <div class="note-title-row">
              <h4 class="note-title">{{ note.title }}</h4>
              <span class="note-date">{{ formatTimeAgo(note.createdAt) }}</span>
            </div>
            <div class="note-actions">
              <Icon
                :name="
                  isNoteExpanded(note.id)
                    ? 'mdi-light:chevron-up'
                    : 'mdi-light:chevron-down'
                "
                class="note-toggle-icon"
              />
            </div>
          </div>
          <div v-else class="note-header">
            <div class="note-title-row">
              <h4 class="note-title note-title--edit">{{ note.title }}</h4>
              <span class="note-date">{{ formatTimeAgo(note.createdAt) }}</span>
            </div>
            <div class="note-actions">
              <button
                @click="editNote(note)"
                class="note-action-btn"
                title="Edit note"
              >
                <Icon name="mdi-light:pencil" />
              </button>
              <button
                @click="deleteNote(note.id)"
                class="note-action-btn text-red-600 hover:text-red-800"
                title="Delete note"
              >
                <Icon name="mdi-light:delete" />
              </button>
            </div>
          </div>
          <div
            v-if="isNoteExpanded(note.id) || isEditing"
            class="note-body-container"
          >
            <div
              v-if="note.body"
              class="note-body whitespace-pre-wrap make-html"
              v-html="makeHtml(note.body)"
            />
            <div v-else class="note-body text-gray-500 italic">No content</div>
          </div>
        </div>

        <!-- Edit Mode (Inline) -->
        <div v-else class="edit-note-inline">
          <div class="form-group">
            <label class="form-label">Title</label>
            <input
              v-model="editingNote!.title"
              type="text"
              class="form-input"
              placeholder="Note title"
              @keyup.enter="saveNoteEdit"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Created Date</label>
            <input
              v-model="editingNote!.createdAt"
              type="datetime-local"
              class="form-input"
              step="1"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Content (optional)</label>
            <textarea
              v-model="editingNote!.body"
              class="form-textarea"
              rows="3"
              placeholder="Note content (optional)..."
              @keyup.ctrl.enter="saveNoteEdit"
            ></textarea>
          </div>
          <div class="form-actions">
            <button
              @click="saveNoteEdit"
              class="btn btn-primary"
              :disabled="!canSaveNote"
            >
              Save Changes
            </button>
            <button @click="cancelNoteEdit" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { INote } from '~/types'
import { ref, computed } from 'vue'
import { formatTimeAgo } from '~/utils/helpers'
import dayjs from '~/utils/dayjs-extend'

interface Props {
  isEditing: boolean
  notes: INote[]
}

interface Emits {
  (e: 'addnote', note: Omit<INote, 'id' | 'createdAt'>): void
  (e: 'updatenote', noteId: string, noteData: Partial<INote>): void
  (e: 'deletenote', noteId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showAddForm = ref(false)
const editingNote = ref<INote | null>(null)
const expandedNotes = ref<Set<string>>(new Set())

// Sort notes by creation date (newest first)
const sortedNotes = computed(() => {
  return [...props.notes].sort((a, b) => {
    return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
  })
})

const newNote = ref({
  title: '',
  body: '',
})

const canAddNote = computed(() => {
  return newNote.value.title.trim()
})

const canSaveNote = computed(() => {
  return editingNote.value?.title.trim()
})

const addNote = () => {
  if (canAddNote.value) {
    emit('addnote', {
      title: newNote.value.title.trim(),
      body: newNote.value.body.trim() || undefined,
    })
    cancelAddNote()
  }
}

const cancelAddNote = () => {
  showAddForm.value = false
  newNote.value = { title: '', body: '' }
}

const editNote = (note: INote) => {
  // Convert ISO string to user's local datetime format using dayjs
  const localDateTime = dayjs(note.createdAt).format('YYYY-MM-DDTHH:mm:ss')

  editingNote.value = {
    ...note,
    createdAt: localDateTime,
  }
}

const saveNoteEdit = () => {
  if (editingNote.value && canSaveNote.value) {
    // Convert local datetime to ISO string using dayjs
    const isoString = dayjs(editingNote.value.createdAt).toISOString()

    const updatedNote = {
      title: editingNote.value.title.trim(),
      body: editingNote.value.body.trim() || undefined,
      createdAt: isoString,
    }

    emit('updatenote', editingNote.value.id, updatedNote)
    cancelNoteEdit()
  }
}

const cancelNoteEdit = () => {
  editingNote.value = null
}

const deleteNote = (noteId: string) => {
  if (confirm('Are you sure you want to delete this note?')) {
    emit('deletenote', noteId)
  }
}

const toggleNoteExpansion = (noteId: string) => {
  if (expandedNotes.value.has(noteId)) {
    expandedNotes.value.delete(noteId)
  } else {
    expandedNotes.value.add(noteId)
  }
}

const isNoteExpanded = (noteId: string) => {
  return expandedNotes.value.has(noteId)
}

const isEditingNote = (noteId: string) => {
  return editingNote.value?.id === noteId
}
</script>

<style scoped>
.card-notes {
  @apply rounded-lg;
}

.card-note-header {
  @apply mb-3;
}

.card-note-content {
  @apply space-y-3;
}

.card-note-item {
  @apply rounded bg-slate-100 shadow-sm border border-slate-200;
}

.note-header {
  @apply flex items-center justify-between;
}

.note-header.clickable {
  @apply cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors;
}

.note-title-row {
  @apply flex items-center gap-3 flex-1;
}

.note-title.note-title--edit {
  @apply p-2;
}

.note-title {
  @apply font-medium text-gray-900 text-sm;
}

.note-date {
  @apply text-gray-500 text-xs;
}

.note-actions {
  @apply flex items-center gap-1;
}

.note-action-btn {
  @apply p-1 text-gray-400 hover:text-gray-600 transition-colors;
}

.note-toggle-icon {
  @apply text-gray-400 transition-colors;
}

.note-body {
  @apply text-gray-700 text-xs;
}

.note-body-container {
  @apply p-2;
}

.note-meta {
  @apply flex items-center justify-end;
}

.add-note-form {
  @apply bg-amber-100 p-3 rounded border border-amber-200;
}

.edit-note-inline {
  @apply p-3;
}

.form-actions {
  @apply flex items-center gap-2 mt-3;
}

.card-note-footer {
  @apply mt-3;
}

.card-note-add-button {
  @apply w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors;
}

.btn {
  @apply px-3 py-2 text-sm font-medium rounded-lg transition-colors;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}
</style>
