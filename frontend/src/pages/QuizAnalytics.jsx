import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function QuizAnalytics() {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState("");
    const [analytics, setAnalytics] = useState(null);

    const [loadingQuizzes, setLoadingQuizzes] = useState(true);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH QUIZZES
    // ==========================================

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoadingQuizzes(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/quizzes`,
                {
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
                    "Failed to fetch quizzes"
                );
            }

            setQuizzes(data.quizzes || []);
        } catch (err) {
            console.error(
                "Fetch quizzes error:",
                err
            );

            setError(err.message);
        } finally {
            setLoadingQuizzes(false);
        }
    };

    // ==========================================
    // FETCH ANALYTICS
    // ==========================================

    const fetchAnalytics = async (quizId) => {
        if (!quizId) {
            setAnalytics(null);
            return;
        }

        try {
            setLoadingAnalytics(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/attempts/analytics/${quizId}`,
                {
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
                    "Failed to fetch analytics"
                );
            }

            setAnalytics(
                data.analytics || null
            );
        } catch (err) {
            console.error(
                "Fetch analytics error:",
                err
            );

            setAnalytics(null);
            setError(err.message);
        } finally {
            setLoadingAnalytics(false);
        }
    };

    // ==========================================
    // QUIZ CHANGE
    // ==========================================

    const handleQuizChange = (event) => {
        const quizId = event.target.value;

        setSelectedQuiz(quizId);

        fetchAnalytics(quizId);
    };

    // ==========================================
    // BACK
    // ==========================================

    const backToDashboard = () => {
        window.location.href = "/";
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loadingQuizzes) {
        return (
            <div className="admin-loading">
                <h2>
                    Loading analytics...
                </h2>
            </div>
        );
    }

    return (
        <div className="analytics-page">

            {/* HEADER */}

            <header className="analytics-header">

                <div>
                    <h1>
                        Quiz Analytics
                    </h1>

                    <p>
                        View performance statistics
                        for your quizzes
                    </p>
                </div>

                <button
                    type="button"
                    className="analytics-back-button"
                    onClick={backToDashboard}
                >
                    ← Back to Dashboard
                </button>

            </header>


            <main className="analytics-container">

                {/* QUIZ SELECT */}

                <section className="analytics-select-card">

                    <label htmlFor="analytics-quiz">
                        Select Quiz
                    </label>

                    <select
                        id="analytics-quiz"
                        value={selectedQuiz}
                        onChange={
                            handleQuizChange
                        }
                    >

                        <option value="">
                            Select a quiz
                        </option>

                        {quizzes.map(
                            quiz => (
                                <option
                                    key={
                                        quiz._id
                                    }
                                    value={
                                        quiz._id
                                    }
                                >
                                    {quiz.title}
                                </option>
                            )
                        )}

                    </select>

                </section>


                {/* ERROR */}

                {error && (
                    <div className="analytics-error">
                        {error}
                    </div>
                )}


                {/* NO QUIZ */}

                {!selectedQuiz && (
                    <div className="analytics-empty">

                        <h2>
                            Select a quiz
                        </h2>

                        <p>
                            Choose a quiz above to
                            view its analytics.
                        </p>

                    </div>
                )}


                {/* LOADING */}

                {selectedQuiz &&
                    loadingAnalytics && (
                        <div className="analytics-loading">

                            <div className="analytics-spinner"></div>

                            <p>
                                Loading analytics...
                            </p>

                        </div>
                    )}


                {/* ANALYTICS */}

                {selectedQuiz &&
                    !loadingAnalytics &&
                    analytics && (

                        <>

                            {/* QUIZ INFO */}

                            <section className="analytics-quiz-card">

                                <div>

                                    <h2>
                                        {
                                            analytics.quiz
                                                ?.title
                                        }
                                    </h2>

                                    <p>
                                        Difficulty:{" "}
                                        {
                                            analytics.quiz
                                                ?.difficulty
                                        }
                                    </p>

                                </div>

                            </section>


                            {/* STATISTICS */}

                            <section className="analytics-stats">

                                <div className="analytics-stat-card">

                                    <span>
                                        Total Attempts
                                    </span>

                                    <strong>
                                        {
                                            analytics.totalAttempts
                                        }
                                    </strong>

                                </div>


                                <div className="analytics-stat-card passed-card">

                                    <span>
                                        Passed
                                    </span>

                                    <strong>
                                        {
                                            analytics.passed
                                        }
                                    </strong>

                                </div>


                                <div className="analytics-stat-card failed-card">

                                    <span>
                                        Failed
                                    </span>

                                    <strong>
                                        {
                                            analytics.failed
                                        }
                                    </strong>

                                </div>


                                <div className="analytics-stat-card">

                                    <span>
                                        Average Score
                                    </span>

                                    <strong>
                                        {
                                            analytics.averageScore
                                        }
                                    </strong>

                                </div>


                                <div className="analytics-stat-card">

                                    <span>
                                        Average Percentage
                                    </span>

                                    <strong>
                                        {
                                            analytics.averagePercentage
                                        }%
                                    </strong>

                                </div>


                                <div className="analytics-stat-card">

                                    <span>
                                        Highest Score
                                    </span>

                                    <strong>
                                        {
                                            analytics.highestScore
                                        }
                                    </strong>

                                </div>


                                <div className="analytics-stat-card">

                                    <span>
                                        Lowest Score
                                    </span>

                                    <strong>
                                        {
                                            analytics.lowestScore
                                        }
                                    </strong>

                                </div>

                            </section>


                            {/* PERFORMANCE SUMMARY */}

                            <section className="analytics-summary">

                                <h2>
                                    Performance Summary
                                </h2>

                                <div className="analytics-summary-content">

                                    <div className="analytics-summary-item">

                                        <span>
                                            Pass Rate
                                        </span>

                                        <strong>
                                            {
                                                analytics.totalAttempts >
                                                0
                                                    ? (
                                                        (
                                                            analytics.passed /
                                                            analytics.totalAttempts
                                                        ) *
                                                        100
                                                    ).toFixed(2)
                                                    : 0
                                            }%
                                        </strong>

                                    </div>


                                    <div className="analytics-summary-item">

                                        <span>
                                            Failure Rate
                                        </span>

                                        <strong>
                                            {
                                                analytics.totalAttempts >
                                                0
                                                    ? (
                                                        (
                                                            analytics.failed /
                                                            analytics.totalAttempts
                                                        ) *
                                                        100
                                                    ).toFixed(2)
                                                    : 0
                                            }%
                                        </strong>

                                    </div>

                                </div>

                            </section>

                        </>

                    )}

            </main>

        </div>
    );
}

export default QuizAnalytics;