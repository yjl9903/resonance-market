import 'dotenv/config';

import { products as allProducts } from '../../utils/products';

import { products, transactions, users } from '../schema';

import { connect } from './connect';

const database = connect();

await database
  .insert(users)
  .values({ id: 1, name: 'anonymous' })
  .onConflictDoNothing()
  .returning({ id: users.id });

for (const product of allProducts) {
  await database
    .insert(products)
    .values({
      city: product.city,
      name: product.name,
      type: product.type,
      valuable: product.valuable,
      baseVolume: product.baseVolume,
      basePrice: product.basePrice,
      cost: product.cost
    })
    .onConflictDoNothing();
}

for (const product of allProducts) {
  await database
    .insert(transactions)
    .values(
      product.transactions.map((transaction) => ({
        name: transaction.name,
        sourceCity: transaction.sourceCity,
        targetCity: transaction.targetCity,
        mileage: transaction.mileage,
        basePrice: transaction.basePrice
      }))
    )
    .onConflictDoNothing();
}
