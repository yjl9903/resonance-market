import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

import { database } from './connect'

migrate(database, { migrationsFolder: './drizzle/migrations' })
