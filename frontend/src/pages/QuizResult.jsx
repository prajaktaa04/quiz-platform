import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function QuizResult({ attemptId }) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResult = async () => {
            try {
                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "Authentication token not found"
                    );
                }

                /*
                 * IMPORTANT:
                 * This endpoint uses getAttemptById()
                 * which returns the complete result.
                 */
                const response = await fetch(
                    `${API_URL}/attempts/${attemptId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch quiz result"
                    );
                }

                // Backend returns result inside data.result
                setResult(data.result);

            } catch (err) {
                console.error(
                    "Fetch result error:",
                    err
                );

                setError(err.message);

            } finally {
                setLoading(false);
            }
        };

        if (attemptId) {
            fetchResult();
        }
    }, [attemptId]);


    // Loading
    if (loading) {
        return (
            <div className="result-page">
                <h2>Loading result...</h2>
            </div>
        );
    }


    // Error
    if (error) {
        return (
            <div className="result-page">
                <h2>Unable to load result</h2>
                <p>{error}</p>
            </div>
        );
    }


    // No result
    if (!result) {
        return (
            <div className="result-page">
                <h2>No result available</h2>
            </div>
        );
    }


    // Pass / Fail
    const passingScore =
        result.quiz?.passingScore ?? 0;

    const passed =
        result.percentage >= passingScore;


    // Format time
    const formatTime = (seconds) => {
        if (
            seconds === null ||
            seconds === undefined
        ) {
            return "N/A";
        }

        const minutes = Math.floor(
            seconds / 60
        );

        const remainingSeconds =
            seconds % 60;

        return `${minutes}m ${remainingSeconds}s`;
    };


    return (
        <div className="result-page">

            <div className="result-card">

                {/* Header */}
                <div className="result-header">

                    <h1>
                        Quiz Completed
                    </h1>

                    <p>
                        {result.quiz?.title ||
                            "Quiz"}
                    </p>

                </div>


                {/* Pass / Fail */}
                <div className="result-status">

                    <h2>
                        {passed
                            ? "PASSED"
                            : "FAILED"}
                    </h2>

                    <p>
                        Passing Score:{" "}
                        {passingScore}%
                    </p>

                </div>


                {/* Score */}
                <div className="score-section">

                    <h2>
                        {result.score} /{" "}
                        {result.totalMarks}
                    </h2>

                    <p>
                        {result.percentage}%
                    </p>

                </div>


                {/* Statistics */}
                <div className="result-grid">

                    <div className="result-item">

                        <span>
                            Correct Answers
                        </span>

                        <strong>
                            {result.correctAnswers}
                        </strong>

                    </div>


                    <div className="result-item">

                        <span>
                            Incorrect Answers
                        </span>

                        <strong>
                            {result.incorrectAnswers}
                        </strong>

                    </div>


                    <div className="result-item">

                        <span>
                            Unanswered
                        </span>

                        <strong>
                            {result.unanswered}
                        </strong>

                    </div>


                    <div className="result-item">

                        <span>
                            Time Taken
                        </span>

                        <strong>
                            {formatTime(
                                result.timeTaken
                            )}
                        </strong>

                    </div>

                </div>


                {/* Back button */}
                <div className="result-actions">

                    <button
                        type="button"
                        onClick={() =>
                            window.location.href = "/"
                        }
                    >
                        Back to Home
                    </button>

                </div>

            </div>

        </div>
    );
}

export default QuizResult;