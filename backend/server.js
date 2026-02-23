const express = require("express");
const cors = require("cors");
const questions = require("./data/questions");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/*
  GET QUESTIONS
  - Shuffles options
  - Does NOT send correct answer index
  - Secure for frontend
*/
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

/*
  POST ANSWER
  - Validates using original data
  - Compares strings (safe even after shuffle)
*/
app.post("/api/answer", (req, res) => {
  const { questionId, selectedAnswer } = req.body;

  const question = questions.find(q => q.id === questionId);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  const correctAnswer = question.options[question.correctAnswerIndex];

  const isCorrect = selectedAnswer === correctAnswer;

  res.json({
    correct: isCorrect,
    correctAnswer
  });
});

/*
  Optional Root Route
*/
app.get("/", (req, res) => {
  res.send("Bible Emoji Game API is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});