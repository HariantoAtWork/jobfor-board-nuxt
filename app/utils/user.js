import { computed } from 'vue'
import { useSession } from '@modules/0000-auth/lib/auth.client'

// Auth state
const sessionData = useSession()
const user = computed(() => sessionData.value?.data?.user || null)

export { user as default }
