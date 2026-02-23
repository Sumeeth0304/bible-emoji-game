import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "https://your-render-url.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const [highScore, setHighScore] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  /* ===============================
     REGISTER USER
  =============================== */

  const registerUser = async () => {
    if (!firstName || !lastName) return;

    const res = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName })
    });

    const data = await res.json();
    setUser(data);

    // Fetch previous high score
    const highRes = await fetch(`${API_BASE}/api/user/${data.id}/highscore`);
    const highData = await highRes.json();
    setHighScore(highData.highscore);
  };

  /* ===============================
     FETCH QUESTIONS
  =============================== */

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE}/api/questions`)
        .then(res => res.json())
        .then(data => setQuestions(data));
    }
  }, [user]);

  /* ===============================
     SUBMIT ANSWER
  =============================== */

  const submitAnswer = async (index) => {
    if (selected !== null) return;

    setSelected(index);

    const res = await fetch(`${API_BASE}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: questions[currentIndex].id,
        selectedAnswer: questions[currentIndex].options[index]
      })
    });

    const data = await res.json();

    if (data.correct) {
      setScore(prev => prev + 1);
      setFeedback("Correct!");
    } else {
      setFeedback(`Wrong! Correct answer: ${data.correctAnswer}`);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setFeedback("");
    setCurrentIndex(prev => prev + 1);
  };

  /* ===============================
     SUBMIT SCORE
  =============================== */

  const submitScore = async () => {
    await fetch(`${API_BASE}/api/submit-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        score
      })
    });

    fetchLeaderboard();
  };

  const fetchLeaderboard = async () => {
    const res = await fetch(`${API_BASE}/api/leaderboard`);
    const data = await res.json();
    setLeaderboard(data);
  };

  /* ===============================
     REGISTRATION SCREEN
  =============================== */

  if (!user) {
    return (
      <div className="container">
        <h1>Register to Play</h1>
        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button onClick={registerUser}>Start Game</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="container">Loading...</div>;
  }

  if (currentIndex >= questions.length) {
    return (
      <div className="container">
        <h1>Game Over</h1>
        <p>Your Score: {score}/{questions.length}</p>

        {highScore && (
          <p>Your Previous High Score: {highScore}</p>
        )}

        <button onClick={submitScore}>Submit Score</button>
        <button onClick={fetchLeaderboard}>View Leaderboard</button>

        {leaderboard.length > 0 && (
          <div>
            <h2>Leaderboard</h2>
            {leaderboard.map((player, index) => (
              <p key={index}>
                {index + 1}. {player.first_name} {player.last_name} — {player.score}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="container">
      <h1>Hello {user.first_name}!</h1>
      <p>High Score: {highScore || 0}</p>

      <div className="emoji">{current.emojis}</div>

      {current.options.map((option, index) => (
        <button
          key={index}
          onClick={() => submitAnswer(index)}
          disabled={selected !== null}
        >
          {option}
        </button>
      ))}

      {feedback && (
        <>
          <p>{feedback}</p>
          <button onClick={nextQuestion}>Next</button>
        </>
      )}

      <p>Score: {score}</p>
    </div>
  );
}

export default App;