import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { cities } from '../lib/city';

import { products } from './schema';
import { database } from './connect';

migrate(database, { migrationsFolder: './drizzle/migrations' });

for (const city of cities) {
  for (const product of city.products) {
    await database
      .insert(products)
      .values({ city: city.name, name: product.name })
      .onConflictDoNothing();
  }
}
