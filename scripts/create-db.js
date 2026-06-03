const { Client } = require('pg');

const connectionString = 'postgresql://postgres:aech123@localhost:5432/postgres';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const result = await client.query("SELECT 1 FROM pg_database WHERE datname = 'taskflow'");
    if (result.rowCount === 0) {
      await client.query('CREATE DATABASE taskflow');
      console.log("Database 'taskflow' created successfully.");
    } else {
      console.log("Database 'taskflow' already exists.");
    }
  } catch (error) {
    console.error("Error creating database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
