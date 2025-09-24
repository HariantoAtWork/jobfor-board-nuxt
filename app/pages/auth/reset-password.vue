<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-fill space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
          <i class="fas fa-key text-indigo-600 text-xl" aria-hidden="true" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Your Password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-check-circle text-green-400 text-xl" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              Password Reset Successful!
            </h3>
            <div class="mt-2 text-sm text-green-700">
              <p>Your password has been successfully reset. You can now sign in with your new password.
              </p>
            </div>
            <div class="mt-4">
              <div class="-mx-2 -my-1.5 flex">
                <NuxtLink to="/"
                  class="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600">
                  Go to Home
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="uis:exclamation-circle" class="w-5 h-5 text-red-400 mt-0.5 mr-2" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Reset Failed
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Reset Form -->
      <form v-if="!success" class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="space-y-4">
          <div>
            <label for="password" class="sr-only">New Password</label>
            <div class="relative">
              <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                minlength="8"
                class="appearance-none rounded-md relative block w-fill px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New password (min. 8 characters)">
              <button type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="sr-only">Confirm New Password</label>
            <div class="relative">
              <input id="confirmPassword" v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'" required
                class="appearance-none rounded-md relative block w-fill px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm new password">
              <button type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                @click="showConfirmPassword = !showConfirmPassword">
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="w-5 h-5"
                  aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword"
          class="text-sm text-red-600">
          Passwords do not match
        </div>

        <div>
          <button type="submit" :disabled="loading || !isFormValid"
            class="group relative w-fill flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-spinner fa-spin text-indigo-500 text-sm" aria-hidden="true" />
            </span>
            {{ loading ? 'Resetting Password...' : 'Reset Password' }}
          </button>
        </div>

        <div class="text-center">
          <NuxtLink to="/" class="font-medium text-indigo-600 hover:text-indigo-500">
            Back to Home
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const { resetPassword } = useAuth
const route = useRoute()

// Form state
const form = reactive({
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const isFormValid = computed(() => {
  return form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.password.length >= 8
})

const handleResetPassword = async () => {
  if (loading.value || !isFormValid.value) return

  // Check password match
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const token = route.query.token
    if (!token) {
      error.value = 'Invalid or missing reset token. Please request a new password reset.'
      loading.value = false
      return
    }

    const { error: resetError } = await resetPassword({
      token: token,
      password: form.password
    }, {
      onRequest: () => {
        loading.value = true
      },
      onSuccess: () => {
        loading.value = false
        success.value = true
      },
      onError: (ctx) => {
        loading.value = false
        error.value = ctx.error.message || 'An error occurred while resetting your password'
      }
    })

    if (resetError) {
      error.value = resetError.message || 'An error occurred while resetting your password'
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

// Check if token exists on mount
onMounted(() => {
  const token = route.query.token
  if (!token) {
    error.value = 'Invalid or missing reset token. Please request a new password reset from the sign-in page.'
  }
})

// Set page title
useHead({
  title: 'Reset Password'
})
</script>
