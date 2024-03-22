import { products as allProducts } from '../../utils/cities'

import { products, transactions, users } from '../schema'

import { database } from './connect'

await database
  .insert(users)
  .values({ id: 1, name: 'anonymous' })
  .onConflictDoNothing()
  .returning({ id: users.id })

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
      cost: product.cost,
    })
    .onConflictDoNothing()
}

for (const product of allProducts) {
  for (const transaction of product.transactions) {
    await database
      .insert(transactions)
      .values({
        name: transaction.name,
        sourceCity: transaction.sourceCity,
        targetCity: transaction.targetCity,
        mileage: transaction.mileage,
        basePrice: transaction.basePrice,
      })
      .onConflictDoNothing()
  }
}
