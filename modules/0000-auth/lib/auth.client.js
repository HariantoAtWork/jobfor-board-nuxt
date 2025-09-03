import { createAuthClient } from 'better-auth/vue'
const authClient = createAuthClient()
export default authClient
export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  forgetPassword,
  resetPassword,
  deleteUser,
  listAccounts,
  unlinkAccount,
} = authClient
