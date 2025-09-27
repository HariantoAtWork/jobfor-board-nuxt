<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Sign Out</h1>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
          ></div>
          <p class="text-gray-600">Signing out...</p>
        </div>

        <!-- Success State -->
        <div v-else-if="signoutResult?.success" class="space-y-4">
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
          <h2 class="text-xl font-semibold text-green-800">Successfully Signed Out</h2>
          <p class="text-gray-600">{{ signoutResult.message }}</p>

          <div class="mt-6 space-y-3">
            <NuxtLink
              to="/auth/signin"
              class="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              Sign In Again
            </NuxtLink>
            <NuxtLink
              to="/test-auth/status"
              class="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-center"
            >
              Check Auth Status
            </NuxtLink>
          </div>
        </div>

        <!-- Initial State - Show Sign Out Button -->
        <div v-else-if="!signoutResult" class="space-y-4">
          <div
            class="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto"
          >
            <svg
              class="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-800">Ready to Sign Out?</h2>
          <p class="text-gray-600">Click the button below to sign out of your account.</p>

          <div class="mt-6">
            <button
              @click="handleSignOut"
              :disabled="loading"
              class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Signing Out...' : 'Sign Out' }}
            </button>
          </div>

          <div class="mt-4 space-y-2">
            <NuxtLink
              to="/test-auth/status"
              class="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-center"
            >
              Check Auth Status
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-center"
            >
              Back to Dashboard
            </NuxtLink>
          </div>
        </div>

        <!-- Error State -->
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
          <h2 class="text-xl font-semibold text-red-800">Sign Out Failed</h2>
          <p class="text-gray-600">{{ signoutResult.message }}</p>

          <div class="mt-6 space-y-3">
            <button
              @click="handleSignOut"
              :disabled="loading"
              class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Retrying...' : 'Try Again' }}
            </button>
            <NuxtLink
              to="/test-auth/is-logged-in"
              class="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-center"
            >
              Check Auth Status
            </NuxtLink>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 class="font-medium text-red-800 mb-2">Error</h3>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>

        <!-- Debug Info -->
        <div v-if="signoutResult" class="mt-6 p-4 bg-gray-100 rounded-lg text-left">
          <h3 class="font-medium text-gray-900 mb-2">Debug Information:</h3>
          <pre class="text-xs text-gray-600 overflow-auto">{{
            JSON.stringify(signoutResult, null, 2)
          }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface SignoutResult {
  success: boolean
  message: string
  error?: string
  timestamp: string
}

const loading = ref(false)
const signoutResult = ref<SignoutResult | null>(null)
const error = ref<string | null>(null)

const handleSignOut = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await $fetch<SignoutResult>('/api/proxy/logout', {
      method: 'POST',
    })

    signoutResult.value = response

    if (!response.success) {
      error.value = response.message
    }
  } catch (err: any) {
    console.error('Error during signout:', err)
    error.value = err.message || 'Failed to sign out'
    signoutResult.value = {
      success: false,
      message: err.message || 'Failed to sign out',
      error: err.message,
      timestamp: new Date().toISOString(),
    }
  } finally {
    loading.value = false
  }
}

// Set page title
useHead({
  title: 'Sign Out - Job Application Organiser',
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
