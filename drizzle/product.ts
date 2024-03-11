import { cities } from '../lib/city';

for (const city of cities) {
  for (const product of city.products) {
    console.log(
      `INSERT INTO \`products\` (\`name\`, \`city\`) VALUES ('${product.name}', '${city.name}');`
    );
  }
}
