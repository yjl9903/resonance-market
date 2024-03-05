import { cities } from '../../lib/city';

import { products, users } from '../schema';

import { database } from './connect';

await database
  .insert(users)
  .values({ id: 1, name: 'anonymous' })
  .onConflictDoNothing()
  .returning({ id: users.id });

for (const city of cities) {
  for (const product of city.products) {
    await database
      .insert(products)
      .values({ city: city.name, name: product.name })
      .onConflictDoNothing();
  }
}
