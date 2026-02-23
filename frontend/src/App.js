import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch("https://bible-emoji-game.onrender.com/api/questions")
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  if (questions.length === 0) {
    return <div className="container">Loading...</div>;
  }

  const current = questions[currentIndex];

  const submitAnswer = (index) => {
    if (selected !== null) return;

    setSelected(index);

    fetch("https://bible-emoji-game.onrender.com/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      questionId: current.id,
      selectedAnswer: current.options[index]
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.correct) {
          setFeedback("Correct!");
          setScore(score + 1);
        } else {
          setFeedback(`Wrong! Correct answer: ${data.correctAnswer}`);
        }
      });
  };

  const nextQuestion = () => {
    setSelected(null);
    setFeedback("");
    setCurrentIndex(currentIndex + 1);
  };

  if (currentIndex >= questions.length) {
    return (
      <div className="container">
        <h1>Game Over</h1>
        <p>Your Score: {score}/{questions.length}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Bible Emoji Guess</h1>

      <div className="emoji">{current.emojis}</div>

      <div className="options">
        {current.options.map((opt, index) => (
          <button
            key={index}
            onClick={() => submitAnswer(index)}
            disabled={selected !== null}
          >
            {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <>
          <p className="feedback">{feedback}</p>
          <button className="next" onClick={nextQuestion}>
            Next
          </button>
        </>
      )}

      <p className="score">Score: {score}</p>
    </div>
  );
}

export default App;