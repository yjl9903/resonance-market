// import { sql } from 'drizzle-orm';
import {
  text,
  integer,
  primaryKey,
  foreignKey,
  unique,
  sqliteTable
} from 'drizzle-orm/sqlite-core';

// User
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique()
});

export type User = typeof users.$inferSelect;

export type NewUser = typeof users.$inferInsert;

// Products
export const products = sqliteTable(
  'products',
  {
    name: text('name').notNull(),
    city: text('city').notNull(),
    valuable: integer('valuable', { mode: 'boolean' }).default(true),
    baseVolume: integer('base_volume').default(0),
    basePrice: integer('base_price').default(0)
  },
  (table) => ({ product_pk: primaryKey({ columns: [table.city, table.name] }) })
);

export type Product = typeof products.$inferSelect;

export type NewProduct = typeof products.$inferInsert;

// Transaction
export const transactions = sqliteTable(
  'transactions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    sourceCity: text('source_city').notNull(),
    targetCity: text('target_city').notNull(),
    mileage: integer('mileage').notNull(),
    basePrice: integer('base_price').notNull()
  },
  (table) => ({
    sourceProudctReference: foreignKey({
      columns: [table.sourceCity, table.name],
      foreignColumns: [products.city, products.name],
      name: 'transaction_source_fk'
    }),
    targetProudctReference: foreignKey({
      columns: [table.targetCity, table.name],
      foreignColumns: [products.city, products.name],
      name: 'transaction_source_fk'
    })
  })
);

export type Transaction = typeof transactions.$inferSelect;

export type NewTransaction = typeof transactions.$inferInsert;

// Logs
export const logs = sqliteTable(
  'logs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    city: text('city').notNull(),
    targetCity: text('target_city').notNull(),
    type: text('type').notNull(),
    trend: text('trend'),
    price: integer('price').notNull(),
    percent: integer('percent').notNull(),
    uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).notNull(),
    uploaderId: integer('uploader_id')
      .notNull()
      .references(() => users.id)
  },
  (table) => ({
    productReference: foreignKey({
      columns: [table.city, table.name],
      foreignColumns: [products.city, products.name],
      name: 'product_log_fk'
    }),
    uniqueLog: unique().on(table.name, table.city, table.uploadedAt)
  })
);

export type Log = typeof logs.$inferSelect;

export type NewLog = typeof logs.$inferInsert;
