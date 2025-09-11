<template>
  <div class="form-group">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="form-input-container">
      <slot />
    </div>
    <p v-if="helpText" class="form-help-text">{{ helpText }}</p>
    <p v-if="error" class="form-error-text">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  helpText?: string
  error?: string
  required?: boolean
  inputId?: string
}

withDefaults(defineProps<Props>(), {
  required: false,
})
</script>

<style scoped>
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input-container {
  @apply relative;
}

.form-help-text {
  @apply text-sm text-gray-500 mt-1;
}

.form-error-text {
  @apply text-sm text-red-600 mt-1;
}
</style>
