require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const questions = require("./data/questions");

const app = express();
const PORT = process.env.PORT || 5000;
const SALT_ROUNDS = 10;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ===============================
   HELPER: SHUFFLE
================================= */

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/* ===============================
   GAME ROUTES
================================= */

app.get("/api/questions", (req, res) => {
  const shuffledQuestions = shuffleArray(questions).map(q => ({
    id: q.id,
    emojis: q.emojis,
    options: shuffleArray(q.options)
  }));

  res.json(shuffledQuestions);
});

app.post("/api/answer", (req, res) => {
  const { questionId, selectedAnswer } = req.body;

  const question = questions.find(q => q.id === questionId);
  const correctAnswer = question.options[question.correctAnswerIndex];

  res.json({
    correct: selectedAnswer === correctAnswer,
    correctAnswer
  });
});

/* ===============================
   AUTH / USER ROUTES
================================= */

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const trimmed = username.trim().toLowerCase();
  if (trimmed.length < 2) {
    return res.status(400).json({ error: "Username must be at least 2 characters." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const existing = await pool.query(
    "SELECT id FROM users WHERE LOWER(username) = $1",
    [trimmed]
  );

  if (existing.rows.length > 0) {
    return res.status(409).json({ error: "Username already taken." });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await pool.query(
    `INSERT INTO users (username, password_hash, first_name, last_name)
     VALUES ($1, $2, $1, '') RETURNING id, username, first_name, last_name`,
    [trimmed, passwordHash]
  );

  const row = result.rows[0];
  res.status(201).json({ id: row.id, username: row.username, first_name: row.first_name, last_name: row.last_name });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const result = await pool.query(
    "SELECT id, username, password_hash, first_name, last_name FROM users WHERE LOWER(username) = $1",
    [username.trim().toLowerCase()]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  res.json({
    id: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name
  });
});

app.post("/api/submit-score", async (req, res) => {
  const { userId, score } = req.body;

  await pool.query(
    "INSERT INTO scores (user_id, score) VALUES ($1, $2)",
    [userId, score]
  );

  res.json({ message: "Score saved" });
});

app.get("/api/user/:id/highscore", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT MAX(score) as highscore FROM scores WHERE user_id = $1",
    [id]
  );

  res.json(result.rows[0]);
});

/* ===============================
   DELETE ACCOUNT
================================= */

app.delete("/api/user/:id", async (req, res) => {
  const { id } = req.params;

  // Delete scores first (safe even if cascade exists)
  await pool.query("DELETE FROM scores WHERE user_id = $1", [id]);

  // Delete user
  await pool.query("DELETE FROM users WHERE id = $1", [id]);

  res.json({ message: "Account deleted successfully" });
});

app.get("/api/leaderboard", async (req, res) => {
  const result = await pool.query(`
    SELECT u.username, u.first_name, u.last_name, MAX(s.score) as score
    FROM scores s
    JOIN users u ON s.user_id = u.id
    GROUP BY u.id, u.username, u.first_name, u.last_name
    ORDER BY score DESC
    LIMIT 10
  `);

  res.json(result.rows);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});