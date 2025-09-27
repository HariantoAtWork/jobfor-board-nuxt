<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          Authentication Status Checker
        </h1>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
          ></div>
          <p class="text-gray-600">Checking authentication status...</p>
        </div>

        <!-- Authenticated State -->
        <div v-else-if="authStatus?.authenticated" class="space-y-4">
          <div
            class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto"
          >
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-green-800">Authenticated</h2>
          <p class="text-gray-600">You are successfully logged in!</p>

          <div v-if="authStatus.data" class="mt-6 p-4 bg-gray-50 rounded-lg text-left">
            <h3 class="font-medium text-gray-900 mb-3">User Information:</h3>
            <div class="space-y-2 text-sm">
              <div>
                <span class="font-medium">ID:</span> {{ authStatus.data.user.id }}
              </div>
              <div>
                <span class="font-medium">Email:</span> {{ authStatus.data.user.email }}
              </div>
              <div v-if="authStatus.data.user.name">
                <span class="font-medium">Name:</span> {{ authStatus.data.user.name }}
              </div>
              <div>
                <span class="font-medium">Email Verified:</span>
                <span
                  :class="
                    authStatus.data.user.emailVerified ? 'text-green-600' : 'text-red-600'
                  "
                >
                  {{ authStatus.data.user.emailVerified ? 'Yes' : 'No' }}
                </span>
              </div>
              <div class="pt-2 border-t">
                <span class="font-medium">Session Expires:</span>
                {{ formatDate(authStatus.data.session.expiresAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Not Authenticated State -->
        <div v-else class="space-y-4">
          <div
            class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto"
          >
            <svg
              class="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-red-800">Not Authenticated</h2>
          <p class="text-gray-600">You are not logged in.</p>

          <div class="mt-6 space-y-3">
            <NuxtLink
              to="/auth/signin"
              class="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/auth/signup"
              class="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-center"
            >
              Sign Up
            </NuxtLink>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 class="font-medium text-red-800 mb-2">Error</h3>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>

        <!-- Refresh Button -->
        <div class="mt-6">
          <button
            @click="checkAuthStatus"
            :disabled="loading"
            class="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Checking...' : 'Refresh Status' }}
          </button>
        </div>

        <!-- Debug Info -->
        <div v-if="authStatus" class="mt-6 p-4 bg-gray-100 rounded-lg text-left">
          <h3 class="font-medium text-gray-900 mb-2">Debug Information:</h3>
          <pre class="text-xs text-gray-600 overflow-auto">{{
            JSON.stringify(authStatus, null, 2)
          }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface AuthStatus {
  success: boolean
  authenticated: boolean
  message: string
  data?: {
    user: {
      id: string
      email: string
      name?: string
      emailVerified: boolean
    }
    session: {
      id: string
      expiresAt: string
    }
  }
  error?: string
  timestamp: string
}

const loading = ref(true)
const authStatus = ref<AuthStatus | null>(null)
const error = ref<string | null>(null)

const checkAuthStatus = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await $fetch<AuthStatus>('/api/status')
    authStatus.value = response

    if (!response.success) {
      error.value = response.message
    }
  } catch (err: any) {
    console.error('Error checking auth status:', err)
    error.value = err.message || 'Failed to check authentication status'
    authStatus.value = null
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    })
  } catch {
    return dateString
  }
}

// Check auth status on component mount
onMounted(() => {
  checkAuthStatus()
})

// Set page title
useHead({
  title: 'Authentication Status - Job Application Organiser',
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
