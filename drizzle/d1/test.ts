import { products } from '../schema';

import { connect } from './connect';
import { initialize } from './initialize';

export default {
  async fetch(req: Request, env: any) {
    const database = connect(env);
    await initialize(database);

    const prods = await database.select().from(products);
    const trans = await database.select().from(products);

    return new Response(JSON.stringify({ products: prods, transactions: trans }, null, 2), {
      headers: { 'content-type': 'application/json' }
    });
  }
};
