import { useEffect, useState } from "react";

import API_URL from "../config";

function QuizDetails({ quizId }) {

    const [quiz, setQuiz] = useState(null);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [totalMarks, setTotalMarks] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH QUIZ DETAILS
    // ==========================================

    useEffect(() => {
        fetchQuizDetails();
    }, [quizId]);


    const fetchQuizDetails = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/student/quizzes/${quizId}`,
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
                    "Failed to fetch quiz details"
                );
            }

            setQuiz(data.quiz);
            setTotalQuestions(
                data.totalQuestions || 0
            );
            setTotalMarks(
                data.totalMarks || 0
            );

        } catch (error) {

            console.error(
                "Quiz details error:",
                error
            );

            setError(
                error.message ||
                "Unable to load quiz details"
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // START QUIZ
    // ==========================================

    const startQuiz = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/attempts/start`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        quizId
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to start quiz"
                );

                return;
            }

            const attemptId =
                data.attempt?._id ||
                data.attempt?.id ||
                data._id;

            if (!attemptId) {

                alert(
                    "Attempt ID not received"
                );

                return;
            }

            window.location.href =
                `/?attemptId=${attemptId}`;

        } catch (error) {

            console.error(
                "Start quiz error:",
                error
            );

            alert(
                "Unable to start quiz"
            );
        }
    };


    // ==========================================
    // BACK TO DASHBOARD
    // ==========================================

    const goBack = () => {

        window.location.href = "/";
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="quiz-details-loading">

                <div className="student-dashboard-spinner">
                </div>

                <h2>
                    Loading Quiz Details...
                </h2>

                <p>
                    Please wait.
                </p>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="quiz-details-error">

                <h2>
                    Unable to load quiz
                </h2>

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={goBack}
                >
                    Back to Dashboard
                </button>

            </div>
        );
    }


    // ==========================================
    // NO QUIZ
    // ==========================================

    if (!quiz) {

        return (
            <div className="quiz-details-error">

                <h2>
                    Quiz not found
                </h2>

                <button
                    type="button"
                    onClick={goBack}
                >
                    Back to Dashboard
                </button>

            </div>
        );
    }


    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="quiz-details-page">

            {/* ==================================
                HEADER
            ================================== */}

            <header className="quiz-details-header">

                <button
                    type="button"
                    className="quiz-details-back-button"
                    onClick={goBack}
                >
                    ← Back to Dashboard
                </button>

            </header>


            {/* ==================================
                MAIN CONTENT
            ================================== */}

            <main className="quiz-details-container">

                <section className="quiz-details-card">

                    {/* DIFFICULTY */}

                    <div className="quiz-details-badge">
                        {quiz.difficulty}
                    </div>


                    {/* TITLE */}

                    <h1>
                        {quiz.title}
                    </h1>


                    {/* DESCRIPTION */}

                    <p className="quiz-details-description">
                        {quiz.description}
                    </p>


                    {/* QUIZ INFORMATION */}

                    <div className="quiz-details-info-grid">

                        <div className="quiz-details-info-item">

                            <span>
                                Category
                            </span>

                            <strong>
                                {quiz.category?.name ||
                                    "N/A"}
                            </strong>

                        </div>


                        <div className="quiz-details-info-item">

                            <span>
                                Difficulty
                            </span>

                            <strong>
                                {quiz.difficulty}
                            </strong>

                        </div>


                        <div className="quiz-details-info-item">

                            <span>
                                Questions
                            </span>

                            <strong>
                                {totalQuestions}
                            </strong>

                        </div>


                        <div className="quiz-details-info-item">

                            <span>
                                Total Marks
                            </span>

                            <strong>
                                {totalMarks}
                            </strong>

                        </div>


                        <div className="quiz-details-info-item">

                            <span>
                                Duration
                            </span>

                            <strong>
                                {quiz.duration} Minutes
                            </strong>

                        </div>


                        <div className="quiz-details-info-item">

                            <span>
                                Passing Score
                            </span>

                            <strong>
                                {quiz.passingScore}%
                            </strong>

                        </div>


                        <div className="quiz-details-info-item">

                            <span>
                                Maximum Attempts
                            </span>

                            <strong>
                                {quiz.maxAttempts}
                            </strong>

                        </div>


                        <div className="quiz-details-info-item">

                            <span>
                                Status
                            </span>

                            <strong className="quiz-details-published">
                                {quiz.status}
                            </strong>

                        </div>

                    </div>


                    {/* INFORMATION */}

                    <div className="quiz-details-notice">

                        <strong>
                            Before you start
                        </strong>

                        <p>
                            Make sure you have enough
                            time to complete the quiz.
                            The timer will start as soon
                            as your attempt begins.
                        </p>

                    </div>


                    {/* ACTIONS */}

                    <div className="quiz-details-actions">

                        <button
                            type="button"
                            className="quiz-details-cancel-button"
                            onClick={goBack}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="quiz-details-start-button"
                            onClick={startQuiz}
                        >
                            Start Quiz →
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default QuizDetails;