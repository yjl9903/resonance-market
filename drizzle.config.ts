import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default {
  schema: './drizzle/schema/',
  out: './drizzle/migrations',
} satisfies Config
