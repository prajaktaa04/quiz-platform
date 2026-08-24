import { useEffect, useState } from "react";

import API_URL from "../config";

function AdminDashboard() {

    const [quizzes, setQuizzes] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // USER
    // ==========================================

    const storedUser =
        localStorage.getItem("user");

    let user = null;

    try {

        user = storedUser
            ? JSON.parse(storedUser)
            : null;

    } catch (error) {

        console.error(
            "Invalid stored user:",
            error
        );
    }


    // ==========================================
    // FETCH QUIZZES
    // ==========================================

    useEffect(() => {

        fetchQuizzes();

    }, []);


    const fetchQuizzes = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${API_URL}/quizzes`,
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
                    "Failed to fetch quizzes"
                );
            }

            setQuizzes(
                data.quizzes || []
            );

        } catch (error) {

            console.error(
                "Fetch quizzes error:",
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
    // NAVIGATION
    // ==========================================

    const openCategories = () => {

        window.location.href =
            "/?categories=true";
    };


    const openQuestions = () => {

        window.location.href =
            "/?questions=true";
    };


    const openAnalytics = () => {

        window.location.href =
            "/?analytics=true";
    };


    const openPerformance = () => {

        window.location.href =
            "/?performance=true";
    };


    const openStudents = () => {

        window.location.href =
            "/?students=true";
    };


    const createQuiz = () => {

        window.location.href =
            "/?createQuiz=true";
    };


    // ==========================================
    // EDIT QUIZ
    // ==========================================

    const editQuiz = (quizId) => {

        window.location.href =
            `/?createQuiz=true&editQuiz=${quizId}`;
    };


    // ==========================================
    // QUIZ ANALYTICS
    // ==========================================

    const quizAnalytics = (quizId) => {

        window.location.href =
            `/?analytics=true&quizId=${quizId}`;
    };


    // ==========================================
    // PUBLISH / UNPUBLISH
    // ==========================================

    const togglePublish = async (
        quizId
    ) => {

        try {

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${API_URL}/quizzes/${quizId}/publish`,
                    {
                        method: "PATCH",

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
                    "Failed to update quiz status"
                );
            }

            setQuizzes(
                previous =>
                    previous.map(
                        quiz =>
                            quiz._id === quizId
                                ? data.quiz
                                : quiz
                    )
            );

        } catch (error) {

            console.error(
                "Publish quiz error:",
                error
            );

            alert(
                error.message
            );
        }
    };


    // ==========================================
    // DELETE QUIZ
    // ==========================================

    const deleteQuiz = async (
        quizId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this quiz?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${API_URL}/quizzes/${quizId}`,
                    {
                        method: "DELETE",

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
                    "Failed to delete quiz"
                );
            }

            setQuizzes(
                previous =>
                    previous.filter(
                        quiz =>
                            quiz._id !== quizId
                    )
            );

        } catch (error) {

            console.error(
                "Delete quiz error:",
                error
            );

            alert(
                error.message
            );
        }
    };


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

        window.location.href =
            "/";
    };


    // ==========================================
    // STATISTICS
    // ==========================================

    const totalQuizzes =
        quizzes.length;

    const publishedQuizzes =
        quizzes.filter(
            quiz =>
                quiz.status ===
                "PUBLISHED"
        ).length;

    const draftQuizzes =
        quizzes.filter(
            quiz =>
                quiz.status ===
                "DRAFT"
        ).length;

    const unpublishedQuizzes =
        quizzes.filter(
            quiz =>
                quiz.status ===
                "UNPUBLISHED"
        ).length;


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="admin-loading">

                <div className="admin-loading-card">

                    <div className="admin-spinner"></div>

                    <h2>
                        Loading Admin Dashboard
                    </h2>

                    <p>
                        Please wait...
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="admin-error-page">

                <div className="admin-error-card">

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        className="admin-retry-button"
                        onClick={
                            fetchQuizzes
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="admin-page">


            {/* ==================================
                HEADER
            ================================== */}

            <header className="admin-header">

                <div className="admin-header-left">

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Manage quizzes, categories,
                        questions and analytics
                    </p>

                </div>


                <div className="admin-header-actions">


                    {/* ADMIN */}

                    <span className="admin-user-name">
                        👤{" "}
                        {
                            user?.name ||
                            "Admin"
                        }
                    </span>


                    {/* CATEGORIES */}

                    <button
                        type="button"
                        className="admin-category-button"
                        onClick={
                            openCategories
                        }
                    >
                        Categories
                    </button>


                    {/* QUESTIONS */}

                    <button
                        type="button"
                        className="admin-question-button"
                        onClick={
                            openQuestions
                        }
                    >
                        Questions
                    </button>


                    {/* ANALYTICS */}

                    <button
                        type="button"
                        className="admin-analytics-header-button"
                        onClick={
                            openAnalytics
                        }
                    >
                        Analytics
                    </button>


                    {/* PERFORMANCE */}

                    <button
                        type="button"
                        className="admin-performance-header-button"
                        onClick={
                            openPerformance
                        }
                    >
                        Performance
                    </button>


                    {/* STUDENTS */}

                    <button
                        type="button"
                        className="admin-students-header-button"
                        onClick={
                            openStudents
                        }
                    >
                        Students
                    </button>


                    {/* CREATE QUIZ */}

                    <button
                        type="button"
                        className="admin-create-button"
                        onClick={
                            createQuiz
                        }
                    >
                        + Create Quiz
                    </button>


                    {/* LOGOUT */}

                    <button
                        type="button"
                        className="logout-button"
                        onClick={
                            logout
                        }
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ==================================
                MAIN
            ================================== */}

            <main className="admin-container">


                {/* ==================================
                    STATISTICS
                ================================== */}

                <section className="admin-stats">


                    <div className="admin-stat-card">

                        <span>
                            Total Quizzes
                        </span>

                        <strong>
                            {totalQuizzes}
                        </strong>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            Published
                        </span>

                        <strong>
                            {publishedQuizzes}
                        </strong>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            Drafts
                        </span>

                        <strong>
                            {draftQuizzes}
                        </strong>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            Unpublished
                        </span>

                        <strong>
                            {unpublishedQuizzes}
                        </strong>

                    </div>

                </section>


                {/* ==================================
                    QUIZ MANAGEMENT
                ================================== */}

                <section className="admin-section">

                    <div className="admin-section-heading">

                        <div>

                            <h2>
                                Quiz Management
                            </h2>

                            <p>
                                Manage all quizzes
                                on the platform.
                            </p>

                        </div>


                        <span>
                            {totalQuizzes}{" "}
                            {
                                totalQuizzes === 1
                                    ? "quiz"
                                    : "quizzes"
                            }
                        </span>

                    </div>


                    {quizzes.length === 0 ? (

                        <div className="admin-empty">

                            <h3>
                                No quizzes yet
                            </h3>

                            <p>
                                Create your first
                                quiz to get started.
                            </p>

                            <button
                                type="button"
                                onClick={
                                    createQuiz
                                }
                            >
                                + Create Quiz
                            </button>

                        </div>

                    ) : (

                        <div className="admin-quiz-list">

                            {quizzes.map(
                                quiz => (

                                    <div
                                        className="admin-quiz-card"
                                        key={
                                            quiz._id
                                        }
                                    >

                                        <div className="admin-quiz-content">

                                            <div className="admin-quiz-title-row">

                                                <h3>
                                                    {
                                                        quiz.title
                                                    }
                                                </h3>

                                                <span
                                                    className={
                                                        quiz.status ===
                                                        "PUBLISHED"
                                                            ? "admin-status published"
                                                            : quiz.status ===
                                                              "UNPUBLISHED"
                                                            ? "admin-status unpublished"
                                                            : "admin-status draft"
                                                    }
                                                >
                                                    {
                                                        quiz.status
                                                    }
                                                </span>

                                            </div>


                                            <p className="admin-quiz-description">
                                                {
                                                    quiz.description
                                                }
                                            </p>


                                            <div className="admin-quiz-meta">

                                                <span>
                                                    Category:{" "}
                                                    {
                                                        quiz.category?.name ||
                                                        "N/A"
                                                    }
                                                </span>

                                                <span>
                                                    Difficulty:{" "}
                                                    {
                                                        quiz.difficulty
                                                    }
                                                </span>

                                                <span>
                                                    Duration:{" "}
                                                    {
                                                        quiz.duration
                                                    }{" "}
                                                    min
                                                </span>

                                                <span>
                                                    Passing:{" "}
                                                    {
                                                        quiz.passingScore
                                                    }%
                                                </span>

                                                <span>
                                                    Max Attempts:{" "}
                                                    {
                                                        quiz.maxAttempts
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        <div className="admin-quiz-actions">

                                            <button
                                                type="button"
                                                className="admin-analytics-button"
                                                onClick={() =>
                                                    quizAnalytics(
                                                        quiz._id
                                                    )
                                                }
                                            >
                                                Analytics
                                            </button>


                                            <button
                                                type="button"
                                                className="admin-edit-button"
                                                onClick={() =>
                                                    editQuiz(
                                                        quiz._id
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                type="button"
                                                className="admin-publish-button"
                                                onClick={() =>
                                                    togglePublish(
                                                        quiz._id
                                                    )
                                                }
                                            >
                                                {
                                                    quiz.status ===
                                                    "PUBLISHED"
                                                        ? "Unpublish"
                                                        : "Publish"
                                                }
                                            </button>


                                            <button
                                                type="button"
                                                className="admin-delete-button"
                                                onClick={() =>
                                                    deleteQuiz(
                                                        quiz._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;