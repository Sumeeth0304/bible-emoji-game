import { useEffect, useState } from "react";
import "./App.css";

const API_BASE =
  process.env.REACT_APP_API_BASE || "https://bible-emoji-game.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [authMode, setAuthMode] = useState("signup"); // "signup" | "login"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

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
     SIGN UP / LOGIN
  =============================== */

  const handleAuth = async (e) => {
    e?.preventDefault();
    setAuthError("");

    const u = username.trim();
    if (!u) {
      setAuthError("Enter a username.");
      return;
    }
    if (!password) {
      setAuthError("Enter a password.");
      return;
    }
    if (authMode === "signup") {
      if (password.length < 6) {
        setAuthError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }
    }

    setAuthLoading(true);
    try {
      const endpoint = authMode === "signup" ? "/api/register" : "/api/login";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || "Something went wrong.");
        return;
      }

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      fetchHighScore(data.id);
    } catch (err) {
      setAuthError("Network error. Try again.");
    } finally {
      setAuthLoading(false);
    }
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
      <div className="app">
        <div className="card">
          <h1>Bible Emoji Challenge</h1>
          <p className="subtitle">Guess the Bible character from the emojis.</p>

          <div className="auth-tabs">
            <button
              type="button"
              className={"auth-tab " + (authMode === "signup" ? "active" : "")}
              onClick={() => { setAuthMode("signup"); setAuthError(""); }}
            >
              Sign up
            </button>
            <button
              type="button"
              className={"auth-tab " + (authMode === "login" ? "active" : "")}
              onClick={() => { setAuthMode("login"); setAuthError(""); }}
            >
              Log in
            </button>
          </div>

          <form className="form" onSubmit={handleAuth}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={authLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={authMode === "signup" ? "new-password" : "current-password"}
              disabled={authLoading}
            />
            {authMode === "signup" && (
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={authLoading}
              />
            )}
            {authError && <p className="error">{authError}</p>}
            <button
              type="submit"
              className="primary-button"
              disabled={authLoading}
            >
              {authLoading ? "Please wait…" : authMode === "signup" ? "Sign up" : "Log in"}
            </button>
          </form>

          <p className="auth-hint">
            {authMode === "signup"
              ? "Already have an account? Log in above."
              : "No account? Switch to Sign up."}
          </p>
        </div>
      </div>
    );
  }

  if (questionsLoading) {
    return (
      <div className="app">
        <div className="card">
          <p className="loading">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="app">
        <div className="card">
          <h1>Couldn’t load the game</h1>
          <p className="error">{questionsError}</p>
          <div className="actions">
            <button className="primary-button" onClick={loadQuestions}>
              Retry
            </button>
            <button className="secondary-button" onClick={logout}>
              Clear saved login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="app">
        <div className="card">
          <h1>No questions available</h1>
          <div className="actions">
            <button className="primary-button" onClick={loadQuestions}>
              Retry
            </button>
            <button className="secondary-button" onClick={logout}>
              Clear saved login
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===============================
     GAME OVER SCREEN
  =============================== */

  if (currentIndex === questions.length) {
    return (
      <div className="app">
        <div className="card">
          <h1>Game Over</h1>
          <p className="score">
            Your Score: <strong>{score}</strong> / {questions.length}
          </p>
          <p className="score">
            Your High Score: <strong>{highScore}</strong>
          </p>

          <div className="actions">
            <button className="primary-button" onClick={resetGame}>
              Start New Game
            </button>
            <button className="secondary-button" onClick={logout}>
              Logout
            </button>
          </div>

          {leaderboard.length > 0 && (
            <div className="leaderboard">
              <h2>Leaderboard</h2>
              {leaderboard.map((player, index) => (
                <p key={index}>
                  {index + 1}. {player.username || [player.first_name, player.last_name].filter(Boolean).join(" ").trim() || "—"} — {player.score}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ===============================
     GAME PLAY
  =============================== */

  const current = questions[currentIndex];

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <div>
            <h1>Hello {user.username || user.first_name}!</h1>
            <p className="subtitle">High Score: {highScore}</p>
          </div>
          <p className="question-count">
            Question {currentIndex + 1} / {questions.length}
          </p>
        </div>

        <div className="emoji-bubble">
          <div className="emoji">{current.emojis}</div>
        </div>

        <div className="options">
          {current.options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => submitAnswer(index)}
              disabled={selected !== null}
            >
              {option}
            </button>
          ))}
        </div>

        {feedback && (
          <div className="footer">
            <p className="feedback">{feedback}</p>
            <button className="primary-button next" onClick={handleNext}>
              Next
            </button>
          </div>
        )}

        <div className="bottom-bar">
          <p className="score">Score: {score}</p>
          <button className="secondary-button" onClick={goToGameOver}>
            Quit Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;