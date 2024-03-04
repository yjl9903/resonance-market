// import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique()
});

export type User = typeof users.$inferSelect;

export type NewUser = typeof users.$inferInsert;

export const products = sqliteTable('products', {
  name: text('name').notNull().primaryKey(),
  city: text('city').notNull()
});

export type Product = typeof products.$inferSelect;

export type NewProduct = typeof products.$inferInsert;

export const logs = sqliteTable('logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name')
    .notNull()
    .references(() => products.name),
  city: text('city').notNull(),
  type: text('type').notNull(),
  price: integer('price').notNull(),
  percent: integer('percent').notNull(),
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).notNull(),
  uploaderId: integer('uploader_id')
    .notNull()
    .references(() => users.id)
});

export type Log = typeof logs.$inferSelect;

export type NewLog = typeof logs.$inferInsert;
