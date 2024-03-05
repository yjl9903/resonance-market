import 'dotenv/config';

import { migrate } from 'drizzle-orm/libsql/migrator';

import { connect } from './connect';

const database = connect();

migrate(database, { migrationsFolder: './drizzle/migrations' });
