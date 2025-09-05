// Boards module for managing board data
import { defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'module-boards',
  },
  setup() {
    // This module provides board database functionality
    // No API routes needed as boards API is handled in server/api/boards/
  },
})
