import { products } from '~/utils/cities';

export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', `max-age=${3600 * 24}`);

  return products;
});
