import 'dotenv/config';

import { cities } from '../../lib/city';

import { products, users } from '../schema';

import { connect } from './connect';

const database = connect();

await database
  .insert(users)
  .values({ id: 1, name: 'anonymous' })
  .onConflictDoUpdate({ target: users.id, set: { name: 'anonymous' } })
  .returning({ id: users.id });

for (const city of cities) {
  for (const product of city.products) {
    await database
      .insert(products)
      .values({ city: city.name, name: product.name })
      .onConflictDoNothing();
  }
}
