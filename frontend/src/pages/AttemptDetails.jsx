import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function AttemptDetails({ attemptId }) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAttemptDetails = async () => {
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

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch attempt details"
                    );
                }

                setResult(data.result);

            } catch (err) {
                console.error(
                    "Attempt details error:",
                    err
                );

                setError(err.message);

            } finally {
                setLoading(false);
            }
        };

        if (attemptId) {
            fetchAttemptDetails();
        }

    }, [attemptId]);


    // ==========================================
    // FORMAT TIME
    // ==========================================

    const formatTime = (seconds) => {

        if (
            seconds === null ||
            seconds === undefined
        ) {
            return "N/A";
        }

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;

        return `${minutes}m ${remainingSeconds}s`;
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="attempt-details-loading">
                <h2>
                    Loading attempt details...
                </h2>
            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {
        return (
            <div className="attempt-details-error">

                <h2>
                    Unable to load attempt
                </h2>

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        window.location.href = "/"
                    }
                >
                    Back to Dashboard
                </button>

            </div>
        );
    }


    if (!result) {
        return (
            <div className="attempt-details-error">

                <h2>
                    No attempt details found
                </h2>

            </div>
        );
    }


    const passed =
        result.status === "PASSED" ||
        (
            result.percentage >=
            (result.quiz?.passingScore ?? 60)
        );


    return (
        <div className="attempt-details-page">

            <div className="attempt-details-container">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="attempt-details-header">

                    <button
                        type="button"
                        className="back-button"
                        onClick={() =>
                            window.location.href = "/"
                        }
                    >
                        ← Back to Dashboard
                    </button>

                    <h1>
                        Attempt Review
                    </h1>

                    <p>
                        {result.quiz?.title}
                    </p>

                </div>


                {/* ==================================
                    RESULT SUMMARY
                ================================== */}

                <div className="attempt-summary-card">

                    <div className="attempt-summary-status">

                        <span
                            className={
                                passed
                                    ? "passed"
                                    : "failed"
                            }
                        >
                            {passed
                                ? "PASSED"
                                : "FAILED"}
                        </span>

                    </div>


                    <div className="attempt-summary-score">

                        <strong>
                            {result.score} /{" "}
                            {result.totalMarks}
                        </strong>

                        <span>
                            {result.percentage}%
                        </span>

                    </div>


                    <div className="attempt-summary-grid">

                        <div>

                            <span>
                                Correct
                            </span>

                            <strong>
                                {
                                    result.correctAnswers
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Incorrect
                            </span>

                            <strong>
                                {
                                    result.incorrectAnswers
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Unanswered
                            </span>

                            <strong>
                                {
                                    result.unanswered
                                }
                            </strong>

                        </div>


                        <div>

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

                </div>


                {/* ==================================
                    QUESTIONS REVIEW
                ================================== */}

                <section className="review-section">

                    <div className="review-heading">

                        <h2>
                            Question Review
                        </h2>

                        <span>
                            {
                                result.answers?.length ||
                                0
                            }{" "}
                            questions
                        </span>

                    </div>


                    <div className="review-list">

                        {(
                            result.answers || []
                        ).map(
                            (answer, index) => {

                                const selectedOption =
                                    answer.question?.options?.find(
                                        (option) =>
                                            option._id ===
                                            answer.selectedOption
                                    );


                                return (
                                    <div
                                        className="review-question-card"
                                        key={
                                            answer._id
                                        }
                                    >

                                        <div className="review-question-header">

                                            <span>
                                                Question{" "}
                                                {index + 1}
                                            </span>

                                            <span
                                                className={
                                                    answer.isCorrect
                                                        ? "review-correct"
                                                        : answer.selectedOption
                                                            ? "review-incorrect"
                                                            : "review-unanswered"
                                                }
                                            >
                                                {answer.isCorrect
                                                    ? "Correct"
                                                    : answer.selectedOption
                                                        ? "Incorrect"
                                                        : "Unanswered"}
                                            </span>

                                        </div>


                                        <h3>
                                            {
                                                answer
                                                    .question
                                                    ?.questionText
                                            }
                                        </h3>


                                        <div className="review-options">

                                            {(
                                                answer
                                                    .question
                                                    ?.options || []
                                            ).map(
                                                (option) => {

                                                    const isSelected =
                                                        option._id ===
                                                        answer.selectedOption;


                                                    return (
                                                        <div
                                                            key={
                                                                option._id
                                                            }
                                                            className={
                                                                isSelected
                                                                    ? answer.isCorrect
                                                                        ? "review-option selected-correct"
                                                                        : "review-option selected-incorrect"
                                                                    : "review-option"
                                                            }
                                                        >

                                                            <span>
                                                                {option.optionText}
                                                            </span>

                                                            {isSelected && (
                                                                <strong>
                                                                    Your Answer
                                                                </strong>
                                                            )}

                                                        </div>
                                                    );
                                                }
                                            )}

                                        </div>


                                        <div className="review-question-footer">

                                            <span>
                                                Marks:{" "}
                                                {
                                                    answer.marksObtained
                                                } /{" "}
                                                {
                                                    answer
                                                        .question
                                                        ?.marks
                                                }
                                            </span>

                                            <span>
                                                Difficulty:{" "}
                                                {
                                                    answer
                                                        .question
                                                        ?.difficulty
                                            }
                                            </span>

                                        </div>


                                        {answer.question
                                            ?.explanation && (

                                            <div className="explanation">

                                                <strong>
                                                    Explanation
                                                </strong>

                                                <p>
                                                    {
                                                        answer
                                                            .question
                                                            .explanation
                                                    }
                                                </p>

                                            </div>

                                        )}

                                    </div>
                                );
                            }
                        )}

                    </div>

                </section>


                {/* ==================================
                    BOTTOM BUTTON
                ================================== */}

                <div className="attempt-details-actions">

                    <button
                        type="button"
                        onClick={() =>
                            window.location.href = "/"
                        }
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>

        </div>
    );
}

export default AttemptDetails;