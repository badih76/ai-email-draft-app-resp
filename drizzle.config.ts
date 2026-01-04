import { defineConfig } from 'drizzle-kit';

console.log('drizzle.config.ts: ', process.env.DATABASE_URL);
export default defineConfig({
  out: './drizzle',
  schema: './src/drizzle/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
