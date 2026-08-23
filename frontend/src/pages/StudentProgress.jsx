import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api";

function StudentProgress() {

    const [attempts, setAttempts] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // FETCH STUDENT ATTEMPTS
    // ==========================================

    useEffect(() => {
        fetchAttempts();
    }, []);


    const fetchAttempts = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${API_URL}/attempts/my`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch performance"
                );
            }

            setAttempts(
                data.attempts || []
            );

        } catch (error) {

            console.error(
                "Student performance error:",
                error
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // ONLY COMPLETED ATTEMPTS
    // ==========================================

    const completedAttempts =
        useMemo(() => {

            return attempts.filter(
                attempt =>
                    attempt.status ===
                    "SUBMITTED"
            );

        }, [attempts]);


    // ==========================================
    // STATISTICS
    // ==========================================

    const totalAttempts =
        completedAttempts.length;


    const averageScore =
        totalAttempts > 0
            ? (
                completedAttempts.reduce(
                    (sum, attempt) =>
                        sum +
                        Number(
                            attempt.percentage || 0
                        ),
                    0
                ) / totalAttempts
            ).toFixed(1)
            : "0.0";


    const highestScore =
        totalAttempts > 0
            ? Math.max(
                ...completedAttempts.map(
                    attempt =>
                        Number(
                            attempt.percentage || 0
                        )
                )
            )
            : 0;


    const passedAttempts =
        completedAttempts.filter(
            attempt =>
                Number(
                    attempt.percentage || 0
                ) >=
                Number(
                    attempt.quiz?.passingScore || 0
                )
        ).length;


    const failedAttempts =
        totalAttempts -
        passedAttempts;


    const passRate =
        totalAttempts > 0
            ? (
                (passedAttempts /
                    totalAttempts) *
                100
            ).toFixed(1)
            : "0.0";


    // ==========================================
    // AVERAGE CORRECT ANSWERS
    // ==========================================

    const averageCorrect =
        totalAttempts > 0
            ? (
                completedAttempts.reduce(
                    (sum, attempt) =>
                        sum +
                        Number(
                            attempt.correctAnswers || 0
                        ),
                    0
                ) / totalAttempts
            ).toFixed(1)
            : "0.0";


    // ==========================================
    // TOTAL TIME
    // ==========================================

    const totalTime =
        completedAttempts.reduce(
            (sum, attempt) =>
                sum +
                Number(
                    attempt.timeTaken || 0
                ),
            0
        );


    const formatTime = (seconds) => {

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;

        return `${minutes}m ${remainingSeconds}s`;
    };


    // ==========================================
    // QUIZ PERFORMANCE
    // ==========================================

    const quizPerformance =
        useMemo(() => {

            const grouped = {};

            completedAttempts.forEach(
                attempt => {

                    const quizId =
                        attempt.quiz?._id ||
                        attempt.quiz?.id ||
                        "unknown";

                    const quizTitle =
                        attempt.quiz?.title ||
                        "Unknown Quiz";


                    if (!grouped[quizId]) {

                        grouped[quizId] = {
                            id: quizId,
                            title: quizTitle,
                            attempts: 0,
                            passed: 0,
                            failed: 0,
                            totalPercentage: 0,
                            bestScore: 0
                        };
                    }


                    grouped[quizId].attempts++;

                    grouped[quizId].totalPercentage +=
                        Number(
                            attempt.percentage || 0
                        );


                    grouped[quizId].bestScore =
                        Math.max(
                            grouped[quizId].bestScore,
                            Number(
                                attempt.percentage || 0
                            )
                        );


                    if (
                        Number(
                            attempt.percentage || 0
                        ) >=
                        Number(
                            attempt.quiz?.passingScore ||
                            0
                        )
                    ) {

                        grouped[quizId].passed++;

                    } else {

                        grouped[quizId].failed++;
                    }

                }
            );


            return Object.values(
                grouped
            ).map(quiz => ({
                ...quiz,

                averageScore:
                    quiz.attempts > 0
                        ? (
                            quiz.totalPercentage /
                            quiz.attempts
                        ).toFixed(1)
                        : "0.0"
            }));

        }, [completedAttempts]);


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        window.location.href = "/";
    };


    // ==========================================
    // BACK
    // ==========================================

    const goBack = () => {

        window.location.href = "/";
    };


    // ==========================================
    // REVIEW ATTEMPT
    // ==========================================

    const reviewAttempt = (
        attemptId
    ) => {

        window.location.href =
            `/?attemptId=${attemptId}&review=true`;
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="student-progress-loading">

                <div className="student-progress-spinner"></div>

                <h2>
                    Loading Performance
                </h2>

                <p>
                    Please wait...
                </p>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="student-progress-error-page">

                <div className="student-progress-error-card">

                    <h2>
                        Unable to load performance
                    </h2>

                    <p>
                        {error}
                    </p>

                    <div>

                        <button
                            type="button"
                            onClick={
                                fetchAttempts
                            }
                        >
                            Try Again
                        </button>

                        <button
                            type="button"
                            onClick={
                                goBack
                            }
                        >
                            Back to Dashboard
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    return (
        <div className="student-progress-page">


            {/* ==================================
                HEADER
            ================================== */}

            <header className="student-progress-header">

                <div>

                    <h1>
                        Student Performance
                    </h1>

                    <p>
                        Track your quiz performance
                        and progress
                    </p>

                </div>


                <div className="student-progress-header-actions">

                    <button
                        type="button"
                        className="student-progress-back-button"
                        onClick={
                            goBack
                        }
                    >
                        ← Back to Dashboard
                    </button>

                    <button
                        type="button"
                        className="student-progress-logout-button"
                        onClick={
                            logout
                        }
                    >
                        Logout
                    </button>

                </div>

            </header>


            <main className="student-progress-container">


                {/* ==================================
                    OVERVIEW
                ================================== */}

                <section className="student-progress-stats">

                    <div className="student-progress-stat-card">

                        <span>
                            Total Attempts
                        </span>

                        <strong>
                            {totalAttempts}
                        </strong>

                    </div>


                    <div className="student-progress-stat-card">

                        <span>
                            Average Score
                        </span>

                        <strong>
                            {averageScore}%
                        </strong>

                    </div>


                    <div className="student-progress-stat-card">

                        <span>
                            Pass Rate
                        </span>

                        <strong>
                            {passRate}%
                        </strong>

                    </div>


                    <div className="student-progress-stat-card">

                        <span>
                            Highest Score
                        </span>

                        <strong>
                            {highestScore}%
                        </strong>

                    </div>

                </section>


                {/* ==================================
                    ADDITIONAL STATS
                ================================== */}

                <section className="student-progress-secondary-stats">

                    <div>

                        <span>
                            Passed
                        </span>

                        <strong className="student-progress-passed">
                            {passedAttempts}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Failed
                        </span>

                        <strong className="student-progress-failed">
                            {failedAttempts}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Avg. Correct Answers
                        </span>

                        <strong>
                            {averageCorrect}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Total Time
                        </span>

                        <strong>
                            {formatTime(
                                totalTime
                            )}
                        </strong>

                    </div>

                </section>


                {/* ==================================
                    QUIZ PERFORMANCE
                ================================== */}

                <section className="student-progress-section">

                    <div className="student-progress-section-heading">

                        <div>

                            <h2>
                                Quiz Performance
                            </h2>

                            <p>
                                Performance grouped by quiz
                            </p>

                        </div>

                    </div>


                    {quizPerformance.length === 0 ? (

                        <div className="student-progress-empty">

                            <h3>
                                No completed quizzes yet
                            </h3>

                            <p>
                                Complete a quiz to start
                                tracking your performance.
                            </p>

                            <button
                                type="button"
                                onClick={
                                    goBack
                                }
                            >
                                Browse Quizzes
                            </button>

                        </div>

                    ) : (

                        <div className="student-progress-quiz-list">

                            {quizPerformance.map(
                                quiz => (

                                    <div
                                        className="student-progress-quiz-card"
                                        key={
                                            quiz.id
                                        }
                                    >

                                        <div className="student-progress-quiz-info">

                                            <h3>
                                                {
                                                    quiz.title
                                                }
                                            </h3>

                                            <div>

                                                <span>
                                                    Attempts:{" "}
                                                    <strong>
                                                        {
                                                            quiz.attempts
                                                        }
                                                    </strong>
                                                </span>

                                                <span>
                                                    Passed:{" "}
                                                    <strong>
                                                        {
                                                            quiz.passed
                                                        }
                                                    </strong>
                                                </span>

                                                <span>
                                                    Failed:{" "}
                                                    <strong>
                                                        {
                                                            quiz.failed
                                                        }
                                                    </strong>
                                                </span>

                                            </div>

                                        </div>


                                        <div className="student-progress-quiz-score">

                                            <span>
                                                Average
                                            </span>

                                            <strong>
                                                {
                                                    quiz.averageScore
                                                }%
                                            </strong>

                                            <small>
                                                Best:{" "}
                                                {
                                                    quiz.bestScore
                                                }%
                                            </small>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* ==================================
                    ATTEMPT HISTORY
                ================================== */}

                <section className="student-progress-section">

                    <div className="student-progress-section-heading">

                        <div>

                            <h2>
                                Attempt History
                            </h2>

                            <p>
                                Review your previous quiz attempts
                            </p>

                        </div>

                    </div>


                    {completedAttempts.length === 0 ? (

                        <div className="student-progress-empty">

                            <h3>
                                No attempt history
                            </h3>

                        </div>

                    ) : (

                        <div className="student-progress-table-wrapper">

                            <table className="student-progress-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Quiz
                                        </th>

                                        <th>
                                            Score
                                        </th>

                                        <th>
                                            Percentage
                                        </th>

                                        <th>
                                            Correct
                                        </th>

                                        <th>
                                            Incorrect
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {completedAttempts.map(
                                        attempt => {

                                            const passed =
                                                Number(
                                                    attempt.percentage ||
                                                    0
                                                ) >=
                                                Number(
                                                    attempt.quiz?.passingScore ||
                                                    0
                                                );

                                            return (

                                                <tr
                                                    key={
                                                        attempt._id
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            {
                                                                attempt.quiz?.title ||
                                                                "Quiz"
                                                            }
                                                        </strong>

                                                        <small>
                                                            {
                                                                attempt.quiz?.difficulty ||
                                                                ""
                                                            }
                                                        </small>

                                                    </td>


                                                    <td>

                                                        {
                                                            attempt.score
                                                        }
                                                        /
                                                        {
                                                            attempt.totalMarks
                                                        }

                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {
                                                                attempt.percentage
                                                            }%
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        {
                                                            attempt.correctAnswers ??
                                                            0
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            attempt.incorrectAnswers ??
                                                            0
                                                        }

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                passed
                                                                    ? "student-progress-status passed"
                                                                    : "student-progress-status failed"
                                                            }
                                                        >
                                                            {
                                                                passed
                                                                    ? "PASSED"
                                                                    : "FAILED"
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="student-progress-review-button"
                                                            onClick={() =>
                                                                reviewAttempt(
                                                                    attempt._id
                                                                )
                                                            }
                                                        >
                                                            Review
                                                        </button>

                                                    </td>

                                                </tr>

                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default StudentProgress;