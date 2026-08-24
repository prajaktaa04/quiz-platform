import { useEffect, useMemo, useState } from "react";

import API_URL from "../config";

function StudentDashboard() {
    const [quizzes, setQuizzes] = useState([]);
    const [attempts, setAttempts] = useState([]);

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // USER
    // ==========================================

    const storedUser = localStorage.getItem("user");

    let user = null;

    if (storedUser) {
        try {
            user = JSON.parse(storedUser);
        } catch (error) {
            console.error("Invalid user:", error);
            localStorage.removeItem("user");
        }
    }


    // ==========================================
    // FETCH DATA
    // ==========================================

    useEffect(() => {
        fetchDashboardData();
    }, []);


    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const headers = {
                Authorization: `Bearer ${token}`
            };


            // ===============================
            // FETCH QUIZZES
            // ===============================

            const quizResponse = await fetch(
                `${API_URL}/student/quizzes`,
                {
                    method: "GET",
                    headers
                }
            );

            const quizData =
                await quizResponse.json();

            if (!quizResponse.ok) {
                throw new Error(
                    quizData.message ||
                    "Failed to fetch quizzes"
                );
            }


            // ===============================
            // FETCH ATTEMPTS
            // ===============================

            const attemptResponse = await fetch(
                `${API_URL}/attempts/my`,
                {
                    method: "GET",
                    headers
                }
            );

            const attemptData =
                await attemptResponse.json();

            if (!attemptResponse.ok) {
                throw new Error(
                    attemptData.message ||
                    "Failed to fetch attempts"
                );
            }


            setQuizzes(
                quizData.quizzes || []
            );

            setAttempts(
                attemptData.attempts || []
            );

        } catch (error) {
            console.error(
                "Student dashboard error:",
                error
            );

            setError(error.message);

        } finally {
            setLoading(false);
        }
    };


    // ==========================================
    // COMPLETED ATTEMPTS
    // ==========================================

    const completedAttempts = useMemo(() => {
        return attempts.filter(
            attempt =>
                attempt.status === "SUBMITTED"
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


    // ==========================================
    // SEARCH + FILTER
    // ==========================================

    const filteredQuizzes = useMemo(() => {
        return quizzes.filter(quiz => {

            const matchesSearch =
                quiz.title
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );


            const matchesDifficulty =
                difficulty === "" ||
                quiz.difficulty
                    ?.toUpperCase() ===
                difficulty.toUpperCase();


            return (
                matchesSearch &&
                matchesDifficulty
            );
        });

    }, [
        quizzes,
        search,
        difficulty
    ]);


    // ==========================================
    // OPEN QUIZ DETAILS
    // ==========================================

    const openQuizDetails = (quizId) => {

        window.location.href =
            `/?quizId=${quizId}`;
    };


    // ==========================================
    // REVIEW ATTEMPT
    // ==========================================

    const reviewAttempt = (attemptId) => {

        window.location.href =
            `/?attemptId=${attemptId}&review=true`;
    };


    // ==========================================
    // PERFORMANCE
    // ==========================================

    const openPerformance = () => {

        window.location.href =
            "?studentPerformance=true";
    };


    // ==========================================
    // LEADERBOARD
    // ==========================================

    const openLeaderboard = () => {

        window.location.href =
            "?leaderboard=true";
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="student-dashboard-loading">

                <div className="student-dashboard-spinner">
                </div>

                <h2>
                    Loading Dashboard...
                </h2>

                <p>
                    Please wait while we load
                    your data.
                </p>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="student-dashboard-error">

                <h2>
                    Unable to load dashboard
                </h2>

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={fetchDashboardData}
                >
                    Try Again
                </button>

            </div>
        );
    }


    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="student-dashboard-page">


            {/* ==================================
                HEADER
            ================================== */}

            <header className="student-dashboard-header">

                <div>

                    <h1>
                        Quiz Platform
                    </h1>

                    <p>
                        Student Dashboard
                    </p>

                </div>


                <div className="student-dashboard-user">

                    <button
                        type="button"
                        className="student-leaderboard-button"
                        onClick={openLeaderboard}
                    >
                        🏆 Leaderboard
                    </button>


                    <button
                        type="button"
                        className="student-performance-button"
                        onClick={openPerformance}
                    >
                        Performance
                    </button>


                    <span>
                        👤{" "}
                        {user?.name || "Student"}
                    </span>


                    <button
                        type="button"
                        className="student-logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            <main className="student-dashboard-container">


                {/* ==================================
                    WELCOME
                ================================== */}

                <section className="student-dashboard-welcome">

                    <h2>
                        Welcome back,{" "}
                        {user?.name || "Student"}!
                    </h2>

                    <p>
                        Test your knowledge,
                        improve your skills,
                        and track your progress.
                    </p>

                </section>


                {/* ==================================
                    STATS
                ================================== */}

                <section className="student-dashboard-stats">

                    <div className="student-stat-card">

                        <span>
                            Total Attempts
                        </span>

                        <strong>
                            {totalAttempts}
                        </strong>

                    </div>


                    <div className="student-stat-card">

                        <span>
                            Average Score
                        </span>

                        <strong>
                            {averageScore}%
                        </strong>

                    </div>


                    <div className="student-stat-card">

                        <span>
                            Passed
                        </span>

                        <strong className="student-stat-passed">
                            {passedAttempts}
                        </strong>

                    </div>


                    <div className="student-stat-card">

                        <span>
                            Available Quizzes
                        </span>

                        <strong>
                            {quizzes.length}
                        </strong>

                    </div>

                </section>


                {/* ==================================
                    AVAILABLE QUIZZES
                ================================== */}

                <section className="student-dashboard-section">

                    <div className="student-dashboard-section-heading">

                        <div>

                            <h2>
                                Available Quizzes
                            </h2>

                            <p>
                                Choose a quiz and
                                test your knowledge.
                            </p>

                        </div>

                    </div>


                    {/* ==================================
                        SEARCH + FILTER
                    ================================== */}

                    <div className="student-dashboard-filters">

                        <input
                            type="text"
                            placeholder="Search quizzes..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />


                        <select
                            value={difficulty}
                            onChange={(event) =>
                                setDifficulty(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                All Difficulties
                            </option>

                            <option value="EASY">
                                Easy
                            </option>

                            <option value="MEDIUM">
                                Medium
                            </option>

                            <option value="HARD">
                                Hard
                            </option>

                        </select>

                    </div>


                    {/* ==================================
                        QUIZ LIST
                    ================================== */}

                    {filteredQuizzes.length === 0 ? (

                        <div className="student-dashboard-empty">

                            <h3>
                                No quizzes found
                            </h3>

                            <p>
                                Try changing your
                                search or filter.
                            </p>

                        </div>

                    ) : (

                        <div className="student-quiz-grid">

                            {filteredQuizzes.map(
                                quiz => (

                                    <div
                                        className="student-quiz-card"
                                        key={quiz._id}
                                    >

                                        <div className="student-quiz-card-content">


                                            {/* DIFFICULTY */}

                                            <div className="student-quiz-badge">
                                                {quiz.difficulty}
                                            </div>


                                            {/* TITLE */}

                                            <h3>
                                                {quiz.title}
                                            </h3>


                                            {/* DESCRIPTION */}

                                            <p>
                                                {quiz.description}
                                            </p>


                                            {/* QUIZ INFORMATION */}

                                            <div className="student-quiz-info">

                                                <span>
                                                    ⏱{" "}
                                                    {quiz.duration}
                                                    {" "}min
                                                </span>

                                                <span>
                                                    🎯 Pass:{" "}
                                                    {quiz.passingScore}%
                                                </span>

                                                <span>
                                                    🔄{" "}
                                                    {quiz.maxAttempts}
                                                    {" "}attempts
                                                </span>

                                            </div>


                                            {/* ==================================
                                                VIEW DETAILS BUTTON
                                            ================================== */}

                                            <button
                                                type="button"
                                                className="start-quiz-button"
                                                onClick={() =>
                                                    openQuizDetails(
                                                        quiz._id
                                                    )
                                                }
                                            >
                                                View Details →
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* ==================================
                    RECENT ATTEMPTS
                ================================== */}

                <section className="student-dashboard-section">

                    <div className="student-dashboard-section-heading">

                        <div>

                            <h2>
                                Recent Attempts
                            </h2>

                            <p>
                                Your latest quiz
                                results.
                            </p>

                        </div>

                    </div>


                    {completedAttempts.length === 0 ? (

                        <div className="student-dashboard-empty">

                            <h3>
                                No attempts yet
                            </h3>

                            <p>
                                Start a quiz to
                                see your results here.
                            </p>

                        </div>

                    ) : (

                        <div className="student-attempt-list">

                            {completedAttempts
                                .slice(0, 10)
                                .map(attempt => {

                                    const passed =
                                        Number(
                                            attempt.percentage || 0
                                        ) >=
                                        Number(
                                            attempt.quiz?.passingScore || 0
                                        );


                                    return (

                                        <div
                                            className="student-attempt-card"
                                            key={attempt._id}
                                        >

                                            {/* ATTEMPT INFO */}

                                            <div>

                                                <h3>
                                                    {
                                                        attempt.quiz
                                                            ?.title ||
                                                        "Quiz"
                                                    }
                                                </h3>

                                                <p>
                                                    Score:{" "}
                                                    {attempt.score}
                                                    {" "} / {" "}
                                                    {attempt.totalMarks}
                                                </p>

                                            </div>


                                            {/* RESULT */}

                                            <div className="student-attempt-result">

                                                <strong>
                                                    {attempt.percentage}%
                                                </strong>


                                                <span
                                                    className={
                                                        passed
                                                            ? "student-passed"
                                                            : "student-failed"
                                                    }
                                                >
                                                    {passed
                                                        ? "PASSED"
                                                        : "FAILED"}
                                                </span>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        reviewAttempt(
                                                            attempt._id
                                                        )
                                                    }
                                                >
                                                    Review
                                                </button>

                                            </div>

                                        </div>

                                    );

                                })}

                        </div>

                    )}

                </section>


            </main>

        </div>
    );
}

export default StudentDashboard;