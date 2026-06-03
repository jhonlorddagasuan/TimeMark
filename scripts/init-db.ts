import { initializeDatabase } from '../lib/db-init.js';

async function main() {
  console.log('Starting database initialization...');
  try {
    await initializeDatabase();
    console.log('✅ Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();
