export const getServerSession = async (event) => {
  const path = '/api/auth/get-session'
  return await $fetch(path, event)
}
