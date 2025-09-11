<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger -->
    <button @click="toggle" :class="triggerClasses" :disabled="disabled">
      <slot name="trigger">
        <span>{{ triggerText }}</span>
        <Icon
          name="mdi:chevron-down"
          :class="[
            'w-4 h-4 transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
          ]"
        />
      </slot>
    </button>

    <!-- Dropdown Content -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        :class="[
          'absolute z-50 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden',
          positionClasses,
        ]"
        @click.stop
      >
        <div
          v-if="header"
          class="px-4 py-2 border-b border-gray-100 bg-gray-50"
        >
          <h4 class="text-sm font-medium text-gray-900">{{ header }}</h4>
        </div>

        <div :class="contentClasses">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  triggerText?: string
  header?: string
  position?: 'left' | 'right' | 'center'
  maxHeight?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  closeOnClick?: boolean
}

interface Emits {
  (e: 'open'): void
  (e: 'close'): void
  (e: 'toggle'): void
}

const props = withDefaults(defineProps<Props>(), {
  triggerText: 'Options',
  position: 'right',
  maxHeight: 'md',
  disabled: false,
  closeOnClick: true,
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const triggerClasses = computed(() => {
  return [
    'flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700',
    'bg-white border border-gray-300 rounded-lg',
    'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-colors',
  ].join(' ')
})

const positionClasses = computed(() => {
  const positions = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2',
  }
  return positions[props.position]
})

const contentClasses = computed(() => {
  const maxHeights = {
    sm: 'max-h-32',
    md: 'max-h-60',
    lg: 'max-h-80',
    xl: 'max-h-96',
  }
  return ['overflow-y-auto', maxHeights[props.maxHeight]].join(' ')
})

const toggle = () => {
  if (props.disabled) return

  isOpen.value = !isOpen.value

  if (isOpen.value) {
    emit('open')
  } else {
    emit('close')
  }

  emit('toggle')
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    close()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

// Handle clicks inside dropdown content
const handleContentClick = () => {
  if (props.closeOnClick) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})

// Expose methods for parent components
defineExpose({
  open: () => {
    isOpen.value = true
    emit('open')
  },
  close,
  toggle,
})
</script>
