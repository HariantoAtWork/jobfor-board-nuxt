import { computed } from 'vue'
import { useSession } from '@modules/0000-auth/lib/auth.client'

// Auth state
const user = computed(() => useSession().value?.data?.user || null)
export default user
