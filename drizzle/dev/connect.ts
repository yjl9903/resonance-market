import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import { logs, products, users } from '../schema'

export const client = new Database('sqlite.db')

export const database = drizzle(client, { logger: false, schema: { users, products, logs } })
