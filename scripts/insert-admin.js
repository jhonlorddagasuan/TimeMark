const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const connectionString = process.env.DATABASE_URL;

async function main() {
  if (!connectionString) {
    console.error("DATABASE_URL is not set in .env.local");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to database...");

    // Check if user already exists
    const checkRes = await client.query(
      "SELECT id FROM users WHERE username = 'admin' OR email = 'admin@gmail.com'"
    );

    const passwordHash = await bcrypt.hash('123123', 10);

    if (checkRes.rowCount > 0) {
      // Update existing admin password
      await client.query(
        "UPDATE users SET password_hash = $1 WHERE username = 'admin' OR email = 'admin@gmail.com'",
        [passwordHash]
      );
      console.log("Admin user already exists. Password updated to '123123'.");
    } else {
      // Insert new admin user
      await client.query(
        `INSERT INTO users (username, email, password_hash, full_name)
         VALUES ('admin', 'admin@gmail.com', $1, 'Admin User')`,
        [passwordHash]
      );
      console.log("Admin user (username: admin, email: admin@gmail.com) created successfully with password '123123'.");
    }
  } catch (error) {
    console.error("Error inserting admin user:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
