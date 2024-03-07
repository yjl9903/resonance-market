import { connect } from './connect';
import { initialize } from './initialize';

export default {
  async fetch(req: Request, env: any) {
    const database = connect(env);
    await initialize(database);

    return new Response(`OK`);
  }
};
