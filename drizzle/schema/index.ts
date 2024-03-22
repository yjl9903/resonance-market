// import { sql } from 'drizzle-orm';
import {
  foreignKey,
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique
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
    type: text('type', { enum: ['normal', 'specialty', 'manufacture'] }).notNull(),
    valuable: integer('valuable', { mode: 'boolean' }).notNull(),
    baseVolume: integer('base_volume'),
    basePrice: integer('base_price').notNull(),
    cost: integer('cost')
  },
  table => ({ productPrimaryKey: primaryKey({ columns: [table.city, table.name] }) })
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
  table => ({
    sourceProudctReference: foreignKey({
      columns: [table.sourceCity, table.name],
      foreignColumns: [products.city, products.name],
      name: 'transaction_source_fk'
    }),
    uniqueTransaction: unique().on(table.name, table.sourceCity, table.targetCity)
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
    sourceCity: text('source_city').notNull(),
    targetCity: text('target_city').notNull(),
    type: text('type', { enum: ['buy', 'sell'] }).notNull(),
    trend: text('trend', { enum: ['up', 'same', 'down'] }).notNull(),
    price: integer('price').notNull(),
    percent: integer('percent').notNull(),
    uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).notNull(),
    uploaderId: integer('uploader_id')
      .notNull()
      .references(() => users.id)
  },
  table => ({
    productReference: foreignKey({
      columns: [table.sourceCity, table.name],
      foreignColumns: [products.city, products.name],
      name: 'product_log_fk'
    }),
    uniqueLog: unique().on(table.name, table.sourceCity, table.targetCity, table.uploadedAt)
  })
);

export type Log = typeof logs.$inferSelect;

export type NewLog = typeof logs.$inferInsert;
