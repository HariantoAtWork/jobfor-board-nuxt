<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
    <div :class="['modal-content', sizeClass, maxHeightClass]" @click.stop>
      <!-- Header -->
      <div v-if="showHeader" class="modal-header">
        <div class="flex items-center justify-between w-full">
          <h3 class="text-lg font-medium">{{ title }}</h3>
          <button
            v-if="showCloseButton"
            @click="close"
            class="text-gray-500 hover:text-gray-700 flex items-center justify-center"
          >
            <Icon name="mdi:close" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="showFooter" class="modal-footer">
        <slot name="footer">
          <div class="flex justify-end gap-2">
            <button
              v-if="showCancelButton"
              @click="close"
              class="btn btn-secondary"
            >
              {{ cancelText }}
            </button>
            <button
              v-if="showConfirmButton"
              @click="confirm"
              class="btn btn-primary"
              :disabled="confirmDisabled"
            >
              {{ confirmText }}
            </button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'
  maxHeight?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showHeader?: boolean
  showFooter?: boolean
  showCloseButton?: boolean
  showCancelButton?: boolean
  showConfirmButton?: boolean
  cancelText?: string
  confirmText?: string
  confirmDisabled?: boolean
  closeOnOverlay?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  maxHeight: 'lg',
  showHeader: true,
  showFooter: true,
  showCloseButton: true,
  showCancelButton: true,
  showConfirmButton: false,
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  confirmDisabled: false,
  closeOnOverlay: true,
})

const emit = defineEmits<Emits>()

const sizeClass = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  }
  return sizes[props.size]
})

const maxHeightClass = computed(() => {
  const heights = {
    sm: 'max-h-sm',
    md: 'max-h-md',
    lg: 'max-h-lg',
    xl: 'max-h-xl',
    full: 'max-h-full',
  }
  return heights[props.maxHeight]
})

const close = () => {
  emit('close')
}

const confirm = () => {
  emit('confirm')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}
</script>
