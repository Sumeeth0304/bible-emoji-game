-- Add username and password_hash for sign up / login.
-- Run this once on your existing database (e.g. psql $DATABASE_URL -f migrations/001_add_username_password.sql).

-- Add columns if they don't exist (safe for existing users table).
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Optional: backfill username from first_name for existing rows so UNIQUE doesn't block.
-- UPDATE users SET username = LOWER(TRIM(first_name)) WHERE username IS NULL AND first_name IS NOT NULL;
-- Then make username NOT NULL for new signups only; existing rows can stay nullable or you can require a one-time “set password” flow.

-- For a fresh install, you can use this schema instead:
-- DROP TABLE IF EXISTS scores;
-- DROP TABLE IF EXISTS users;
-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   username VARCHAR(255) UNIQUE NOT NULL,
--   password_hash VARCHAR(255) NOT NULL,
--   first_name VARCHAR(255),
--   last_name VARCHAR(255)
-- );
-- CREATE TABLE scores (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), score INTEGER);
