const express = require("express");
const cors = require("cors");
const questions = require("./data/questions");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all questions (without correct answer)
app.get("/api/questions", (req, res) => {
  const safeQuestions = questions.map(q => ({
    id: q.id,
    emojis: q.emojis,
    options: q.options
  }));

  res.json(safeQuestions);
});

// Check answer
app.post("/api/answer", (req, res) => {
  const { questionId, selectedIndex } = req.body;

  const question = questions.find(q => q.id === questionId);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  const isCorrect = question.correctAnswerIndex === selectedIndex;

  res.json({
    correct: isCorrect,
    correctAnswer: question.options[question.correctAnswerIndex]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});