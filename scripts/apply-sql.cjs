/* Apply a .sql file to the database using node-postgres */
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Client } = require('pg');

async function applySql(filePath) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  const sqlPath = path.resolve(filePath);
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = new Client({ connectionString });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log(`Applied SQL: ${path.basename(sqlPath)}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to apply SQL:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

const file = process.argv[2] || './drizzle/0001_add_profile_image_url.sql';
applySql(file).catch((e) => {
  console.error(e);
  process.exit(1);
});


