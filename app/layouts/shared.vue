<template>
  <ClientOnly>
    <div class="shared-container">
      <!-- Shared Layout - Clean, minimal design for public sharing -->
      <slot />
    </div>
  </ClientOnly>
</template>

<script setup>
// Shared layout for public board viewing
// This layout provides a clean, minimal interface without main app navigation
</script>

<style scoped>
/* Shared layout specific styles */
.shared-container {
  @apply bg-gray-50;
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* Modal styles */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white rounded-lg shadow-xl max-w-md w-full mx-4;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  @apply px-6 py-4 border-b border-gray-200;
  flex-shrink: 0;
}

.modal-body {
  @apply px-6 py-4;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

/* Activity History Modal */
.activity-group {
  @apply relative;
}

.activity-group-header {
  @apply sticky top-0 z-10 bg-slate-100 py-3 px-2 border-b border-gray-200 shadow-sm;
  margin: 0 -1.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.activity-group-content {
  @apply pt-2 pb-4;
}

.activity-item {
  @apply p-2 rounded-lg hover:bg-gray-50 transition-colors;
}

.activity-icon {
  @apply flex-shrink-0 mt-0.5;
}

.activity-content {
  @apply flex-1 min-w-0;
}
</style>
