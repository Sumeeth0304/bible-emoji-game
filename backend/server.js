require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const questions = require("./data/questions");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ===============================
   HELPER: SHUFFLE FUNCTION
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
  // Shuffle question order
  const shuffledQuestions = shuffleArray(questions).map(q => {
    return {
      id: q.id,
      emojis: q.emojis,
      // Shuffle answer options too
      options: shuffleArray(q.options)
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

app.post("/api/register", async (req, res) => {
  const { firstName, lastName } = req.body;

  const existing = await pool.query(
    "SELECT * FROM users WHERE first_name = $1 AND last_name = $2",
    [firstName, lastName]
  );

  if (existing.rows.length > 0) {
    return res.json(existing.rows[0]);
  }

  const result = await pool.query(
    "INSERT INTO users (first_name, last_name) VALUES ($1, $2) RETURNING *",
    [firstName, lastName]
  );

  res.json(result.rows[0]);
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

app.get("/api/leaderboard", async (req, res) => {
  const result = await pool.query(`
    SELECT u.first_name, u.last_name, MAX(s.score) as score
    FROM scores s
    JOIN users u ON s.user_id = u.id
    GROUP BY u.id
    ORDER BY score DESC
    LIMIT 10
  `);

  res.json(result.rows);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});