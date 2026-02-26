import { useEffect, useState } from "react";
import "./App.css";

const API_BASE =
  process.env.REACT_APP_API_BASE || "https://bible-emoji-game.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  /* ===============================
     AUTO LOGIN
  =============================== */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchHighScore(parsed.id);
    }
  }, []);

  const fetchHighScore = async (userId) => {
    const res = await fetch(`${API_BASE}/api/user/${userId}/highscore`);
    const data = await res.json();
    setHighScore(data.highscore || 0);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setHighScore(0);
    setQuestions([]);
    setScore(0);
    setCurrentIndex(0);
    setSelected(null);
    setFeedback("");
    setLeaderboard([]);
  };

  /* ===============================
     REGISTER
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
    localStorage.setItem("user", JSON.stringify(data));
    setFirstName("");
    setLastName("");
    fetchHighScore(data.id);
  };

  /* ===============================
     LOAD QUESTIONS
  =============================== */

  const loadQuestions = async () => {
    setQuestionsLoading(true);
    setQuestionsError("");

    try {
      const res = await fetch(`${API_BASE}/api/questions`);
      if (!res.ok) {
        throw new Error(`Failed to load questions (HTTP ${res.status})`);
      }
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (e) {
      setQuestions([]);
      setQuestionsError(
        e instanceof Error ? e.message : "Failed to load questions"
      );
    } finally {
      setQuestionsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* ===============================
     ANSWER
  =============================== */

  useEffect(() => {
    setSelected(null);
    setFeedback("");
  }, [currentIndex]);

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

  const handleNext = async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      await goToGameOver();
      return;
    }

    setCurrentIndex(nextIndex);
  };

  const goToGameOver = async () => {
    await fetch(`${API_BASE}/api/submit-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        score
      })
    });

    await fetchHighScore(user.id);

    const lb = await fetch(`${API_BASE}/api/leaderboard`);
    const lbData = await lb.json();
    setLeaderboard(lbData);

    setCurrentIndex(questions.length);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback("");
    setLeaderboard([]);
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

  if (questionsLoading) {
    return <div className="container">Loading...</div>;
  }

  if (questionsError) {
    return (
      <div className="container">
        <h1>Couldn’t load the game</h1>
        <p>{questionsError}</p>
        <button onClick={loadQuestions}>Retry</button>
        <button onClick={logout}>Clear saved login</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container">
        <h1>No questions available</h1>
        <button onClick={loadQuestions}>Retry</button>
        <button onClick={logout}>Clear saved login</button>
      </div>
    );
  }

  /* ===============================
     GAME OVER SCREEN
  =============================== */

  if (currentIndex === questions.length) {
    return (
      <div className="container">
        <h1>Game Over</h1>
        <p>Your Score: {score}/{questions.length}</p>
        <p>Your High Score: {highScore}</p>

        <button onClick={resetGame}>Start New Game</button>
        <button onClick={logout}>Logout</button>

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

  /* ===============================
     GAME PLAY
  =============================== */

  const current = questions[currentIndex];

  return (
    <div className="container">
      <h1>Hello {user.first_name}!</h1>
      <p>High Score: {highScore}</p>

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
          <button onClick={handleNext}>Next</button>
        </>
      )}

      <p>Score: {score}</p>
      <button onClick={goToGameOver}>Quit Game</button>
    </div>
  );
}

export default App;