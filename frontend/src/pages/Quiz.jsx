import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import quizData from "../../../quiz/linux1.json"; 

export default function Quiz() {
  const navigate = useNavigate();

  // All questions loaded from JSON
  const [questions, setQuestions] = useState([]);

  // Index of the current question
  const [current, setCurrent] = useState(0);

  // Selected answers:
  // For radio: a single option id (e.g. "b")
  // For checkbox: an array of selected option ids
  const [selected, setSelected] = useState([]);

  // Scoring
  const [score, setScore] = useState(0);

  // Timer 5 minutes = 300 seconds
  const [timeLeft, setTimeLeft] = useState(300);

  // ------------------------------
  // Load questions once on mount
  // ------------------------------
  useEffect(() => {
    const list = quizData.questions;

    // Shuffle and take up to 30 questions if there are more
    const shuffled = [...list].sort(() => Math.random() - 0.5).slice(0, 30);

    setQuestions(shuffled);
  }, []);

  // ------------------------------
  // Countdown timer
  // ------------------------------
  useEffect(() => {
    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }

    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  // If questions not ready yet
  if (!questions.length) return null;

  const q = questions[current];

  // ------------------------------
  // Select answer (radio)
  // ------------------------------
  function selectRadio(optionId) {
    setSelected([optionId]);
  }

  // ------------------------------
  // Toggle answer (checkbox)
  // ------------------------------
  function toggleCheckbox(optionId) {
    if (selected.includes(optionId)) {
      setSelected(selected.filter((id) => id !== optionId));
    } else {
      setSelected([...selected, optionId]);
    }
  }

  // ------------------------------
  // Move to next question
  // ------------------------------
  function nextQuestion() {
    calculateScore(q);

    setSelected([]);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      finishQuiz();
    }
  }

  // ------------------------------
  // Skip question (no score change)
  // ------------------------------
  function skipQuestion() {
    setSelected([]);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      finishQuiz();
    }
  }

  // ------------------------------
  // Score calculation
  // Wrong = -2 points (for any mistake)
  // Correct = +1 point
  // For checkbox: must match *all* correct answers and *only* them
  // ------------------------------
  function calculateScore(question) {
    const correctOptions = question.options
      .filter((o) => o.isCorrect)
      .map((o) => o.id);

    if (question.mode === "radio") {
      // If selected the only correct option → +1
      if (selected[0] && correctOptions.includes(selected[0])) {
        setScore((prev) => prev + 1);
      } else {
        setScore((prev) => prev - 2);
      }
    }

    if (question.mode === "check") {
      const correctSet = new Set(correctOptions);
      const selectedSet = new Set(selected);

      const isCorrect =
        correctSet.size === selectedSet.size &&
        [...correctSet].every((opt) => selectedSet.has(opt));

      if (isCorrect) {
        setScore((prev) => prev + 1);
      } else {
        setScore((prev) => prev - 2);
      }
    }
  }

  // ------------------------------
  // End quiz
  // ------------------------------
  function finishQuiz() {
    navigate("/results", {
      state: {
        score,
        total: questions.length,
        timeSpent: 300 - timeLeft,
      },
    });
  }

  // ------------------------------
  // Format timer MM:SS
  // ------------------------------
  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  // ------------------------------
  // Render UI
  // ------------------------------
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">

      {/* Header: question number + timer */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Question {current + 1} / {questions.length}
        </h2>

        <div className="text-lg font-mono bg-gray-800 px-4 py-2 rounded">
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded h-3 mb-8">
        <div
          className="bg-blue-500 h-3 rounded transition-all"
          style={{
            width: `${((current + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Question text */}
      <h3 className="text-2xl font-bold mb-6">{q.question}</h3>

      {/* Answer options */}
      <div className="flex flex-col gap-4 mb-8">
        {q.options.map((opt) => {
          const isSelected = selected.includes(opt.id);

          return (
            <button
              key={opt.id}
              onClick={() =>
                q.mode === "radio"
                  ? selectRadio(opt.id)
                  : toggleCheckbox(opt.id)
              }
              className={`
                text-left px-4 py-3 rounded-lg border transition
                ${
                  isSelected
                    ? "bg-blue-500 border-blue-400 text-white"
                    : "bg-gray-900 border-gray-700 hover:bg-gray-800"
                }
              `}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={skipQuestion}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          Skip
        </button>

        <button
          onClick={nextQuestion}
          className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-400 transition"
        >
          {current + 1 === questions.length ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
