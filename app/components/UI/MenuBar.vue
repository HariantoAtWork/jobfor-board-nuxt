<template>
  <ClientOnly>
    <div ref="menuContainer" class="fixed top-4 right-4 z-50">
      <!-- Menu Bar (Pill Shape) -->
      <div class="relative">
        <button
          @click="toggleMenu"
          class="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white"
          :class="{ 'ring-2 ring-blue-500': isMenuOpen }"
        >
          <!-- Account Icon -->
          <Icon name="mdi-light:account" class="w-6 h-6 text-gray-700" />

          <!-- User Status Text -->
          <span class="text-sm font-medium text-gray-700">
            {{ user?.name || user?.email || 'Account' }}
          </span>

          <!-- Dropdown Arrow -->
          <Icon
            name="mdi:chevron-down"
            class="w-4 h-4 text-gray-500 transition-transform duration-200"
            :class="{ 'rotate-180': isMenuOpen }"
          />
        </button>

        <!-- Context Menu -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-if="isMenuOpen"
            @click.stop
            class="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
          >
            <!-- User Info Section (when logged in) -->
            <div v-if="user" class="p-4 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <Icon name="mdi-light:account" class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">
                    {{ user?.name || 'User' }}
                  </p>
                  <p class="text-sm text-gray-500">{{ user?.email }}</p>
                </div>
              </div>
            </div>

            <!-- Login Form (when not logged in) -->
            <div v-else class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Sign In</h3>

              <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    v-model="loginForm.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    v-model="loginForm.password"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  :disabled="isLoading"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span v-if="isLoading">Signing in...</span>
                  <span v-else>Sign In</span>
                </button>
              </form>

              <div class="mt-4 text-center">
                <button
                  @click="showSignUp = true"
                  class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </div>

            <!-- Sign Up Form -->
            <div v-if="showSignUp && !user" class="p-4 border-t border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Sign Up</h3>

              <form @submit.prevent="handleSignUp" class="space-y-4">
                <div>
                  <label
                    for="signup-name"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="signup-name"
                    v-model="signUpForm.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label
                    for="signup-email"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="signup-email"
                    v-model="signUpForm.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label
                    for="signup-password"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="signup-password"
                    v-model="signUpForm.password"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  :disabled="isLoading"
                  class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span v-if="isLoading">Creating account...</span>
                  <span v-else>Sign Up</span>
                </button>
              </form>

              <div class="mt-4 text-center">
                <button
                  @click="showSignUp = false"
                  class="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>

            <!-- Menu Actions (when logged in) -->
            <div v-if="user" class="p-2">
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="mdi:logout" class="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
const { useSession, signIn, signOut, signUp } = useAuth

// Auth state
const sessionData = useSession()
const user = computed(() => sessionData.value?.data?.user || null)
// import user from '~/utils/user'
const isPending = computed(() => sessionData.value?.isPending || false)

// Menu state
const isMenuOpen = ref(false)
const showSignUp = ref(false)
const isLoading = ref(false)
const menuContainer = ref<HTMLElement | null>(null)

// Form data
const loginForm = reactive({
  email: '',
  password: '',
})

const signUpForm = reactive({
  name: '',
  email: '',
  password: '',
})

// Menu functions
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    showSignUp.value = false
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  showSignUp.value = false
}

const handleClickOutside = (event: Event) => {
  if (menuContainer.value && !menuContainer.value.contains(event.target as Node)) {
    closeMenu()
  }
}

// Auth functions
const handleLogin = async () => {
  isLoading.value = true
  try {
    await signIn.email({
      email: loginForm.email,
      password: loginForm.password,
    })
    closeMenu()
    // Reset form
    loginForm.email = ''
    loginForm.password = ''
  } catch (error) {
    console.error('Login error:', error)
    // You could add toast notification here
  } finally {
    isLoading.value = false
  }
}

const handleSignUp = async () => {
  isLoading.value = true
  try {
    await signUp.email({
      name: signUpForm.name,
      email: signUpForm.email,
      password: signUpForm.password,
    })
    closeMenu()
    // Reset form
    signUpForm.name = ''
    signUpForm.email = ''
    signUpForm.password = ''
    showSignUp.value = false
  } catch (error) {
    console.error('Sign up error:', error)
    // You could add toast notification here
  } finally {
    isLoading.value = false
  }
}

const handleLogout = async () => {
  try {
    await signOut()
    closeMenu()
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Close menu on escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.removeEventListener('click', handleClickOutside)
})
</script>
