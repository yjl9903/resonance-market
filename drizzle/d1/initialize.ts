// import { and, eq } from 'drizzle-orm';

import { products as allProducts } from '../../utils/cities';

import { products, transactions, users } from '../schema';

import type { connect } from './connect';

export async function initialize(database: Awaited<ReturnType<typeof connect>>) {
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

  // Clear transactions
  await database.delete(transactions).returning({ id: transactions.id });

  // Insert transactions
  for (const product of allProducts) {
    if (product.transactions.length === 0) continue;

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
      .returning({ id: transactions.id })
      .onConflictDoNothing();
  }
}
