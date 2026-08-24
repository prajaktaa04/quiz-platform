import { useEffect, useState } from "react";

import API_URL from "../config";

function QuestionManagement() {

    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] =
        useState("");

    const [questions, setQuestions] =
        useState([]);

    const [loadingQuizzes, setLoadingQuizzes] =
        useState(true);

    const [loadingQuestions, setLoadingQuestions] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [editingId, setEditingId] =
        useState(null);

    const [questionText, setQuestionText] =
        useState("");

    const [explanation, setExplanation] =
        useState("");

    const [marks, setMarks] =
        useState(1);

    const [difficulty, setDifficulty] =
        useState("MEDIUM");

    const [options, setOptions] = useState([
        {
            optionText: "",
            isCorrect: false
        },
        {
            optionText: "",
            isCorrect: false
        }
    ]);


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

        } catch (err) {

            console.error(
                "Fetch quizzes error:",
                err
            );

            setError(
                err.message
            );

        } finally {

            setLoadingQuizzes(false);
        }
    };


    // ==========================================
    // FETCH QUESTIONS
    // ==========================================

    const fetchQuestions = async (
        quizId
    ) => {

        if (!quizId) {
            setQuestions([]);
            return;
        }

        try {

            setLoadingQuestions(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${API_URL}/questions/quiz/${quizId}`,
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
                    "Failed to fetch questions"
                );
            }

            setQuestions(
                data.questions || []
            );

        } catch (err) {

            console.error(
                "Fetch questions error:",
                err
            );

            setError(
                err.message
            );

        } finally {

            setLoadingQuestions(false);
        }
    };


    // ==========================================
    // SELECT QUIZ
    // ==========================================

    const handleQuizChange = (event) => {

        const quizId =
            event.target.value;

        setSelectedQuiz(
            quizId
        );

        resetForm();

        fetchQuestions(
            quizId
        );
    };


    // ==========================================
    // OPTION CHANGE
    // ==========================================

    const handleOptionChange = (
        index,
        value
    ) => {

        setOptions(
            previous =>
                previous.map(
                    (option, optionIndex) =>
                        optionIndex === index
                            ? {
                                ...option,
                                optionText:
                                    value
                            }
                            : option
                )
        );
    };


    // ==========================================
    // CORRECT OPTION
    // ==========================================

    const handleCorrectOption = (
        index
    ) => {

        setOptions(
            previous =>
                previous.map(
                    (option, optionIndex) => ({
                        ...option,
                        isCorrect:
                            optionIndex ===
                            index
                    })
                )
        );
    };


    // ==========================================
    // ADD OPTION
    // ==========================================

    const addOption = () => {

        setOptions(
            previous => [
                ...previous,
                {
                    optionText: "",
                    isCorrect: false
                }
            ]
        );
    };


    // ==========================================
    // REMOVE OPTION
    // ==========================================

    const removeOption = (index) => {

        if (options.length <= 2) {
            return;
        }

        const removingCorrect =
            options[index].isCorrect;

        setOptions(
            previous =>
                previous.filter(
                    (_, optionIndex) =>
                        optionIndex !== index
                )
        );

        if (removingCorrect) {

            setOptions(
                previous => {

                    if (
                        previous.length > 0 &&
                        !previous.some(
                            option =>
                                option.isCorrect
                        )
                    ) {

                        return previous.map(
                            (
                                option,
                                optionIndex
                            ) =>
                                optionIndex === 0
                                    ? {
                                        ...option,
                                        isCorrect:
                                            true
                                    }
                                    : option
                        );
                    }

                    return previous;
                }
            );
        }
    };


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {

        setEditingId(null);

        setQuestionText("");

        setExplanation("");

        setMarks(1);

        setDifficulty("MEDIUM");

        setOptions([
            {
                optionText: "",
                isCorrect: false
            },
            {
                optionText: "",
                isCorrect: false
            }
        ]);
    };


    // ==========================================
    // SAVE QUESTION
    // ==========================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");


        if (!selectedQuiz) {

            setError(
                "Please select a quiz"
            );

            return;
        }


        if (!questionText.trim()) {

            setError(
                "Question text is required"
            );

            return;
        }


        if (options.length < 2) {

            setError(
                "At least 2 options are required"
            );

            return;
        }


        const cleanedOptions =
            options.map(
                option => ({
                    optionText:
                        option.optionText.trim(),
                    isCorrect:
                        option.isCorrect
                })
            );


        if (
            cleanedOptions.some(
                option =>
                    !option.optionText
            )
        ) {

            setError(
                "All options must have text"
            );

            return;
        }


        if (
            !cleanedOptions.some(
                option =>
                    option.isCorrect
            )
        ) {

            setError(
                "Please select the correct option"
            );

            return;
        }


        try {

            setSaving(true);

            const token =
                localStorage.getItem("token");


            const payload = {

                quiz:
                    selectedQuiz,

                questionText:
                    questionText.trim(),

                options:
                    cleanedOptions,

                explanation:
                    explanation.trim(),

                marks:
                    Number(marks),

                difficulty
            };


            const url = editingId
                ? `${API_URL}/questions/${editingId}`
                : `${API_URL}/questions`;


            const method = editingId
                ? "PUT"
                : "POST";


            const response =
                await fetch(
                    url,
                    {
                        method,

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to save question"
                );
            }


            if (editingId) {

                setQuestions(
                    previous =>
                        previous.map(
                            question =>
                                question._id ===
                                editingId
                                    ? data.question
                                    : question
                        )
                );

            } else {

                setQuestions(
                    previous => [
                        ...previous,
                        data.question
                    ]
                );
            }


            resetForm();

        } catch (err) {

            console.error(
                "Save question error:",
                err
            );

            setError(
                err.message
            );

        } finally {

            setSaving(false);
        }
    };


    // ==========================================
    // EDIT QUESTION
    // ==========================================

    const editQuestion = (
        question
    ) => {

        setEditingId(
            question._id
        );

        setQuestionText(
            question.questionText
        );

        setExplanation(
            question.explanation ||
            ""
        );

        setMarks(
            question.marks
        );

        setDifficulty(
            question.difficulty
        );

        setOptions(
            question.options.map(
                option => ({
                    optionText:
                        option.optionText,
                    isCorrect:
                        option.isCorrect
                })
            )
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // ==========================================
    // DELETE QUESTION
    // ==========================================

    const deleteQuestion = async (
        questionId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this question?"
            );

        if (!confirmed) {
            return;
        }


        try {

            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${API_URL}/questions/${questionId}`,
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
                    "Failed to delete question"
                );
            }


            setQuestions(
                previous =>
                    previous.filter(
                        question =>
                            question._id !==
                            questionId
                    )
            );


            if (
                editingId ===
                questionId
            ) {
                resetForm();
            }


        } catch (err) {

            console.error(
                "Delete question error:",
                err
            );

            setError(
                err.message
            );
        }
    };


    // ==========================================
    // BACK
    // ==========================================

    const backToDashboard = () => {

        window.location.href =
            "/";
    };


    // ==========================================
    // LOADING QUIZZES
    // ==========================================

    if (loadingQuizzes) {

        return (
            <div className="admin-loading">

                <h2>
                    Loading quizzes...
                </h2>

            </div>
        );
    }


    return (
        <div className="question-page">


            {/* ==================================
                HEADER
            ================================== */}

            <header className="question-header">

                <div>

                    <h1>
                        Question Management
                    </h1>

                    <p>
                        Add and manage questions
                        for your quizzes
                    </p>

                </div>


                <button
                    type="button"
                    className="question-back-button"
                    onClick={
                        backToDashboard
                    }
                >
                    ← Back to Dashboard
                </button>

            </header>


            <main className="question-container">


                {/* ==================================
                    QUIZ SELECT
                ================================== */}

                <section className="question-select-card">

                    <label htmlFor="quiz-select">
                        Select Quiz
                    </label>

                    <select
                        id="quiz-select"
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
                                    {
                                        quiz.title
                                    }
                                    {" "}
                                    (
                                    {
                                        quiz.status
                                    }
                                    )
                                </option>

                            )
                        )}

                    </select>

                </section>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (
                    <div className="question-error">
                        {error}
                    </div>
                )}


                {selectedQuiz && (

                    <>


                        {/* ==================================
                            QUESTION FORM
                        ================================== */}

                        <section className="question-form-card">

                            <div className="question-form-heading">

                                <h2>
                                    {editingId
                                        ? "Edit Question"
                                        : "Add Question"}
                                </h2>

                                <p>
                                    Create a question
                                    with multiple
                                    answer options.
                                </p>

                            </div>


                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >


                                {/* QUESTION */}

                                <div className="question-form-group">

                                    <label>
                                        Question
                                    </label>

                                    <textarea
                                        value={
                                            questionText
                                        }
                                        onChange={
                                            event =>
                                                setQuestionText(
                                                    event.target.value
                                                )
                                        }
                                        placeholder="Enter your question..."
                                        rows="4"
                                        disabled={
                                            saving
                                        }
                                    />

                                </div>


                                {/* OPTIONS */}

                                <div className="question-options-section">

                                    <div className="question-options-heading">

                                        <div>

                                            <h3>
                                                Answer Options
                                            </h3>

                                            <p>
                                                Select the
                                                correct
                                                answer.
                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            className="add-option-button"
                                            onClick={
                                                addOption
                                            }
                                            disabled={
                                                saving
                                            }
                                        >
                                            + Add Option
                                        </button>

                                    </div>


                                    <div className="question-options-list">

                                        {options.map(
                                            (
                                                option,
                                                index
                                            ) => (

                                                <div
                                                    className={
                                                        option.isCorrect
                                                            ? "question-option-row correct"
                                                            : "question-option-row"
                                                    }
                                                    key={
                                                        index
                                                    }
                                                >

                                                    <input
                                                        type="radio"
                                                        name="correctOption"
                                                        checked={
                                                            option.isCorrect
                                                        }
                                                        onChange={() =>
                                                            handleCorrectOption(
                                                                index
                                                            )
                                                        }
                                                    />


                                                    <span className="option-letter">
                                                        {
                                                            String.fromCharCode(
                                                                65 +
                                                                index
                                                            )
                                                        }
                                                    </span>


                                                    <input
                                                        type="text"
                                                        value={
                                                            option.optionText
                                                        }
                                                        onChange={
                                                            event =>
                                                                handleOptionChange(
                                                                    index,
                                                                    event.target.value
                                                                )
                                                        }
                                                        placeholder={`Option ${
                                                            index +
                                                            1
                                                        }`}
                                                        disabled={
                                                            saving
                                                        }
                                                    />


                                                    {options.length >
                                                        2 && (

                                                        <button
                                                            type="button"
                                                            className="remove-option-button"
                                                            onClick={() =>
                                                                removeOption(
                                                                    index
                                                                )
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                        >
                                                            ×
                                                        </button>

                                                    )}

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* SETTINGS */}

                                <div className="question-settings-grid">


                                    <div className="question-form-group">

                                        <label>
                                            Marks
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            value={
                                                marks
                                            }
                                            onChange={
                                                event =>
                                                    setMarks(
                                                        event.target.value
                                                    )
                                            }
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>


                                    <div className="question-form-group">

                                        <label>
                                            Difficulty
                                        </label>

                                        <select
                                            value={
                                                difficulty
                                            }
                                            onChange={
                                                event =>
                                                    setDifficulty(
                                                        event.target.value
                                                    )
                                            }
                                            disabled={
                                                saving
                                            }
                                        >

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

                                </div>


                                {/* EXPLANATION */}

                                <div className="question-form-group">

                                    <label>
                                        Explanation
                                        <span className="optional-label">
                                            Optional
                                        </span>
                                    </label>

                                    <textarea
                                        value={
                                            explanation
                                        }
                                        onChange={
                                            event =>
                                                setExplanation(
                                                    event.target.value
                                                )
                                        }
                                        placeholder="Explain why the correct answer is correct..."
                                        rows="3"
                                        disabled={
                                            saving
                                        }
                                    />

                                </div>


                                {/* ACTIONS */}

                                <div className="question-form-actions">

                                    <button
                                        type="submit"
                                        className="question-save-button"
                                        disabled={
                                            saving
                                        }
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingId
                                            ? "Update Question"
                                            : "Add Question"}
                                    </button>


                                    {editingId && (

                                        <button
                                            type="button"
                                            className="question-cancel-button"
                                            onClick={
                                                resetForm
                                            }
                                            disabled={
                                                saving
                                            }
                                        >
                                            Cancel
                                        </button>

                                    )}

                                </div>

                            </form>

                        </section>


                        {/* ==================================
                            EXISTING QUESTIONS
                        ================================== */}

                        <section className="questions-list-section">

                            <div className="questions-list-heading">

                                <div>

                                    <h2>
                                        Questions
                                    </h2>

                                    <p>
                                        {
                                            questions.length
                                        }{" "}
                                        {
                                            questions.length ===
                                            1
                                                ? "question"
                                                : "questions"
                                        }
                                    </p>

                                </div>

                            </div>


                            {loadingQuestions ? (

                                <div className="questions-loading">
                                    Loading questions...
                                </div>

                            ) : questions.length === 0 ? (

                                <div className="questions-empty">

                                    <h3>
                                        No questions yet
                                    </h3>

                                    <p>
                                        Add the first
                                        question for
                                        this quiz above.
                                    </p>

                                </div>

                            ) : (

                                <div className="questions-list">

                                    {questions.map(
                                        (
                                            question,
                                            index
                                        ) => (

                                            <div
                                                className="question-card-admin"
                                                key={
                                                    question._id
                                                }
                                            >

                                                <div className="question-card-top">

                                                    <span className="question-card-number">
                                                        Q
                                                        {index +
                                                            1}
                                                    </span>

                                                    <span
                                                        className={
                                                            question.difficulty ===
                                                            "EASY"
                                                                ? "question-difficulty easy"
                                                                : question.difficulty ===
                                                                  "HARD"
                                                                ? "question-difficulty hard"
                                                                : "question-difficulty medium"
                                                        }
                                                    >
                                                        {
                                                            question.difficulty
                                                        }
                                                    </span>

                                                </div>


                                                <h3>
                                                    {
                                                        question.questionText
                                                    }
                                                </h3>


                                                <div className="admin-question-options">

                                                    {question.options.map(
                                                        (
                                                            option,
                                                            optionIndex
                                                        ) => (

                                                            <div
                                                                className={
                                                                    option.isCorrect
                                                                        ? "admin-option correct"
                                                                        : "admin-option"
                                                                }
                                                                key={
                                                                    option._id ||
                                                                    optionIndex
                                                                }
                                                            >

                                                                <span>
                                                                    {
                                                                        String.fromCharCode(
                                                                            65 +
                                                                            optionIndex
                                                                        )
                                                                    }
                                                                </span>

                                                                <p>
                                                                    {
                                                                        option.optionText
                                                                    }
                                                                </p>

                                                                {option.isCorrect && (
                                                                    <strong>
                                                                        Correct
                                                                    </strong>
                                                                )}

                                                            </div>

                                                        )
                                                    )}

                                                </div>


                                                <div className="question-card-footer">

                                                    <span>
                                                        Marks:{" "}
                                                        {
                                                            question.marks
                                                        }
                                                    </span>


                                                    <div>

                                                        <button
                                                            type="button"
                                                            className="question-edit-button"
                                                            onClick={() =>
                                                                editQuestion(
                                                                    question
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="question-delete-button"
                                                            onClick={() =>
                                                                deleteQuestion(
                                                                    question._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </section>

                    </>

                )}

            </main>

        </div>
    );
}

export default QuestionManagement;