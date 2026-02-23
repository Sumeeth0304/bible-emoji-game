require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const questions = require("./data/questions");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ===============================
   GAME ROUTES
================================= */

app.get("/api/questions", (req, res) => {
  const shuffledQuestions = questions.map(q => {
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);

    return {
      id: q.id,
      emojis: q.emojis,
      options: shuffledOptions
    };
  });

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
   USER ROUTES
================================= */

// Register user
app.post("/api/register", async (req, res) => {
  const { firstName, lastName } = req.body;

  const result = await pool.query(
    "INSERT INTO users (first_name, last_name) VALUES ($1, $2) RETURNING *",
    [firstName, lastName]
  );

  res.json(result.rows[0]);
});

// Submit score
app.post("/api/submit-score", async (req, res) => {
  const { userId, score } = req.body;

  await pool.query(
    "INSERT INTO scores (user_id, score) VALUES ($1, $2)",
    [userId, score]
  );

  res.json({ message: "Score saved" });
});

// Leaderboard
app.get("/api/leaderboard", async (req, res) => {
  const result = await pool.query(`
    SELECT users.first_name, users.last_name, scores.score
    FROM scores
    JOIN users ON scores.user_id = users.id
    ORDER BY scores.score DESC
    LIMIT 10
  `);

  res.json(result.rows);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});