import { useEffect, useState } from "react";
import QuizResult from "./QuizResult";

const API_URL = "http://localhost:5000/api";

function QuizAttempt({ attemptId }) {
    const [attempt, setAttempt] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [remainingTime, setRemainingTime] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);


    // ==========================================
    // FETCH ATTEMPT
    // ==========================================

    useEffect(() => {
        const fetchAttempt = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "Authentication token not found"
                    );
                }

                const response = await fetch(
                    `${API_URL}/attempts/student/${attemptId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                // ==========================================
                // DEBUG ERROR INFORMATION
                // ==========================================

                if (!response.ok) {
                    console.error(
                        "======================================"
                    );

                    console.error(
                        "QUIZ LOAD FAILED"
                    );

                    console.error(
                        "Status:",
                        response.status
                    );

                    console.error(
                        "Status Text:",
                        response.statusText
                    );

                    console.error(
                        "Response:",
                        data
                    );

                    console.error(
                        "Attempt ID:",
                        attemptId
                    );

                    console.error(
                        "Token exists:",
                        !!token
                    );

                    console.error(
                        "======================================"
                    );

                    throw new Error(
                        data.message ||
                        "Unable to load quiz"
                    );
                }

                setAttempt(data.attempt);
                setQuestions(data.questions || []);

                if (
                    data.attempt?.remainingTime !== undefined &&
                    data.attempt?.remainingTime !== null
                ) {
                    setRemainingTime(
                        data.attempt.remainingTime
                    );
                }

            } catch (err) {
                console.error(
                    "Fetch attempt error:",
                    err
                );

                setError(
                    err.message
                );

            } finally {
                setLoading(false);
            }
        };

        if (attemptId) {
            fetchAttempt();
        }

    }, [attemptId]);


    // ==========================================
    // TIMER
    // ==========================================

    useEffect(() => {
        if (
            remainingTime === null ||
            submitted
        ) {
            return;
        }

        if (remainingTime <= 0) {
            handleSubmit(true);
            return;
        }

        const timer = setInterval(() => {

            setRemainingTime((previous) => {

                if (
                    previous === null ||
                    previous <= 1
                ) {
                    clearInterval(timer);
                    return 0;
                }

                return previous - 1;
            });

        }, 1000);

        return () => clearInterval(timer);

    }, [remainingTime, submitted]);


    // ==========================================
    // FORMAT TIME
    // ==========================================

    const formatTime = (seconds) => {

        if (
            seconds === null ||
            seconds === undefined
        ) {
            return "--:--";
        }

        const minutes = Math.floor(
            seconds / 60
        );

        const remainingSeconds =
            seconds % 60;

        return `${String(minutes).padStart(
            2,
            "0"
        )}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };


    // ==========================================
    // SELECT ANSWER
    // ==========================================

    const handleAnswer = (
        questionId,
        optionId
    ) => {

        setAnswers((previous) => ({
            ...previous,
            [questionId]: optionId
        }));
    };


    // ==========================================
    // SUBMIT QUIZ
    // ==========================================

    const handleSubmit = async (
        automatic = false
    ) => {

        if (
            submitting ||
            submitted
        ) {
            return;
        }

        try {

            setSubmitting(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "Authentication token not found"
                );
            }

            const formattedAnswers =
                Object.entries(answers).map(
                    ([questionId, optionId]) => ({
                        questionId,
                        selectedOptionId: optionId
                    })
                );

            const response = await fetch(
                `${API_URL}/attempts/${attemptId}/submit`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        answers:
                            formattedAnswers
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to submit quiz"
                );
            }

            console.log(
                automatic
                    ? "Quiz automatically submitted"
                    : "Quiz submitted successfully",
                data
            );

            setSubmitted(true);

        } catch (err) {

            console.error(
                "Submit quiz error:",
                err
            );

            setError(err.message);
            setSubmitting(false);
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="quiz-loading">
                <h2>Loading quiz...</h2>
            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (
        error &&
        !questions.length
    ) {
        return (
            <div className="quiz-error">

                <h2>
                    Unable to load quiz
                </h2>

                <p>
                    {error}
                </p>

            </div>
        );
    }


    // ==========================================
    // NO QUESTIONS
    // ==========================================

    if (questions.length === 0) {
        return (
            <div className="quiz-error">

                <h2>
                    No questions available
                </h2>

            </div>
        );
    }


    // ==========================================
    // SHOW RESULT
    // ==========================================

    if (submitted) {
        return (
            <QuizResult
                attemptId={attemptId}
            />
        );
    }


    // ==========================================
    // CURRENT QUESTION
    // ==========================================

    const question =
        questions[currentQuestion];

    const selectedAnswer =
        answers[question._id];


    // ==========================================
    // NEXT QUESTION
    // ==========================================

    const goToNextQuestion = () => {

        if (
            currentQuestion <
            questions.length - 1
        ) {
            setCurrentQuestion(
                currentQuestion + 1
            );
        }
    };


    // ==========================================
    // PREVIOUS QUESTION
    // ==========================================

    const goToPreviousQuestion = () => {

        if (
            currentQuestion > 0
        ) {
            setCurrentQuestion(
                currentQuestion - 1
            );
        }
    };


    // ==========================================
    // ANSWERED COUNT
    // ==========================================

    const answeredCount =
        Object.keys(answers).length;


    // ==========================================
    // PROGRESS
    // ==========================================

    const progress =
        ((currentQuestion + 1) /
            questions.length) *
        100;


    // ==========================================
    // QUIZ UI
    // ==========================================

    return (
        <div className="quiz-page">

            <div className="quiz-container">

                {/* =================================
                    QUIZ HEADER
                ================================= */}

                <div className="quiz-header">

                    <h1>
                        {attempt?.quiz?.title ||
                            "Quiz"}
                    </h1>

                    <div className="quiz-info">

                        <span>
                            Question{" "}
                            {currentQuestion + 1}{" "}
                            of{" "}
                            {questions.length}
                        </span>

                        <span>
                            Marks:{" "}
                            {question.marks}
                        </span>

                        <span>
                            Answered:{" "}
                            {answeredCount} /{" "}
                            {questions.length}
                        </span>

                    </div>

                </div>


                {/* =================================
                    TIMER
                ================================= */}

                <div
                    className={
                        remainingTime !== null &&
                        remainingTime <= 60
                            ? "timer-card timer-warning"
                            : "timer-card"
                    }
                >

                    <span className="timer-label">
                        Time Remaining
                    </span>

                    <span className="timer-value">
                        {formatTime(
                            remainingTime
                        )}
                    </span>

                </div>


                {/* =================================
                    PROGRESS
                ================================= */}

                <div className="progress-section">

                    <div className="progress-top">

                        <span>
                            Quiz Progress
                        </span>

                        <span>
                            {currentQuestion + 1} /{" "}
                            {questions.length}
                        </span>

                    </div>

                    <div className="progress-bar">

                        <div
                            className="progress-fill"
                            style={{
                                width:
                                    `${progress}%`
                            }}
                        />

                    </div>

                </div>


                {/* =================================
                    EXPIRED MESSAGE
                ================================= */}

                {remainingTime === 0 && (

                    <div className="quiz-error">

                        <h2>
                            Quiz time has expired.
                        </h2>

                        <p>
                            Your attempt is being
                            submitted automatically.
                        </p>

                    </div>

                )}


                {/* =================================
                    QUESTION CARD
                ================================= */}

                <div className="question-card">

                    <div className="question-number">

                        Question{" "}
                        {currentQuestion + 1}

                    </div>

                    <h2 className="question-text">

                        {question.questionText}

                    </h2>


                    {/* =================================
                        OPTIONS
                    ================================= */}

                    <div className="options-container">

                        {question.options.map(
                            (option) => (

                                <button
                                    key={
                                        option._id
                                    }

                                    type="button"

                                    className={
                                        selectedAnswer ===
                                        option._id
                                            ? "option-button selected"
                                            : "option-button"
                                    }

                                    onClick={() =>
                                        handleAnswer(
                                            question._id,
                                            option._id
                                        )
                                    }

                                    disabled={
                                        submitting
                                    }
                                >

                                    {option.optionText}

                                </button>

                            )
                        )}

                    </div>


                    {/* =================================
                        QUESTION NUMBERS
                    ================================= */}

                    <div className="question-numbers">

                        {questions.map(
                            (item, index) => (

                                <button
                                    key={
                                        item._id
                                    }

                                    type="button"

                                    onClick={() =>
                                        setCurrentQuestion(
                                            index
                                        )
                                    }

                                    className={
                                        index ===
                                        currentQuestion
                                            ? "question-number-button active"
                                            : answers[
                                                item._id
                                            ]
                                                ? "question-number-button answered"
                                                : "question-number-button"
                                    }
                                >

                                    {index + 1}

                                </button>

                            )
                        )}

                    </div>


                    {/* =================================
                        NAVIGATION
                    ================================= */}

                    <div className="question-navigation">

                        <button
                            type="button"

                            className="nav-button"

                            onClick={
                                goToPreviousQuestion
                            }

                            disabled={
                                currentQuestion ===
                                    0 ||
                                submitting
                            }
                        >

                            ← Previous

                        </button>


                        {currentQuestion <
                        questions.length - 1 ? (

                            <button
                                type="button"

                                className="submit-button"

                                onClick={
                                    goToNextQuestion
                                }

                                disabled={
                                    submitting
                                }
                            >

                                Next →

                            </button>

                        ) : (

                            <button
                                type="button"

                                className="submit-button"

                                onClick={() =>
                                    handleSubmit(
                                        false
                                    )
                                }

                                disabled={
                                    submitting
                                }
                            >

                                {submitting
                                    ? "Submitting..."
                                    : "Submit Quiz"}

                            </button>

                        )}

                    </div>


                    {/* =================================
                        SUBMISSION ERROR
                    ================================= */}

                    {error && (

                        <p className="submit-error">
                            {error}
                        </p>

                    )}

                </div>

            </div>

        </div>
    );
}

export default QuizAttempt;