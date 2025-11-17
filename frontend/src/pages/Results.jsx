import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // If user opens /results manually → send them to home
  if (!state) {
    navigate("/home");
    return null;
  }

  const { score, total, timeSpent } = state;

  const percentage = Math.max(0, ((score / total) * 100).toFixed(0));

  let verdict = "";
  if (percentage >= 80) verdict = "Excellent work!";
  else if (percentage >= 50) verdict = "Good job!";
  else verdict = "Keep practicing!";

  // Format time (seconds → MM:SS)
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">

      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Quiz complete 🎉
      </h1>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-lg shadow-lg">
        
        {/* Score */}
        <p className="text-2xl font-semibold mb-4">
          Score: <span className="text-blue-400">{score}</span> / {total}
        </p>

        {/* Percentage */}
        <p className="text-xl mb-4">
          Percentage: <span className="text-blue-400">{percentage}%</span>
        </p>

        {/* Verdict */}
        <p className="text-lg text-gray-300 mb-6">{verdict}</p>

        {/* Time spent */}
        <p className="text-gray-400 mb-8">
          Time spent: {formatTime(timeSpent)}
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">

          <button
            onClick={() => navigate("/quiz")}
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >
            Retry quiz
          </button>

          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Back to home
          </button>

        </div>
      </div>
    </div>
  );
}
