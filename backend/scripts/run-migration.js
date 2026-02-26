require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const migrationPath = path.join(__dirname, "..", "migrations", "001_add_username_password.sql");
const sql = fs.readFileSync(migrationPath, "utf8");

// Run only the ALTER TABLE statements (skip comments and empty lines)
const statements = sql
  .split(";")
  .map((s) => s.replace(/--[^\n]*/g, "").trim())
  .filter((s) => s.startsWith("ALTER TABLE"));

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Set it in .env or in the environment.");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("neon.tech") ? { rejectUnauthorized: false } : false,
  });

  try {
    for (const statement of statements) {
      if (statement) {
        await pool.query(statement + ";");
        console.log("Ran:", statement.slice(0, 60) + "...");
      }
    }
    console.log("Migration completed.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
