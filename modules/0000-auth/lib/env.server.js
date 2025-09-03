import { loadEnv } from 'vite'
const env = loadEnv('production', process.cwd(), '')
Object.assign(process.env, env)
export { env }
