import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function CreateQuiz() {

    const [categories, setCategories] =
        useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        difficulty: "MEDIUM",
        duration: 20,
        passingScore: 60,
        maxAttempts: 2,
        status: "DRAFT",
        thumbnail: ""
    });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // FETCH CATEGORIES
    // ==========================================

    useEffect(() => {
        fetchCategories();
    }, []);


    const fetchCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${API_URL}/categories`,
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
                    "Failed to fetch categories"
                );
            }

            setCategories(
                data.categories || []
            );

        } catch (err) {

            console.error(
                "Fetch categories error:",
                err
            );

            setError(
                err.message
            );

        } finally {
            setLoading(false);
        }
    };


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };


    // ==========================================
    // CREATE QUIZ
    // ==========================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("token");


            // ==================================
            // BASIC VALIDATION
            // ==================================

            if (
                !formData.title.trim()
            ) {
                throw new Error(
                    "Quiz title is required"
                );
            }

            if (
                !formData.description.trim()
            ) {
                throw new Error(
                    "Quiz description is required"
                );
            }

            if (
                !formData.category
            ) {
                throw new Error(
                    "Please select a category"
                );
            }


            // ==================================
            // PREPARE DATA
            // ==================================

            const quizData = {

                title:
                    formData.title.trim(),

                description:
                    formData.description.trim(),

                category:
                    formData.category,

                difficulty:
                    formData.difficulty,

                duration:
                    Number(
                        formData.duration
                    ),

                passingScore:
                    Number(
                        formData.passingScore
                    ),

                maxAttempts:
                    Number(
                        formData.maxAttempts
                    ),

                status:
                    formData.status,

                thumbnail:
                    formData.thumbnail.trim() ||
                    null
            };


            // ==================================
            // SEND REQUEST
            // ==================================

            const response =
                await fetch(
                    `${API_URL}/quizzes`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify(
                                quizData
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to create quiz"
                );
            }


            // ==================================
            // SUCCESS
            // ==================================

            setSuccess(
                "Quiz created successfully!"
            );


            // Reset form
            setFormData({
                title: "",
                description: "",
                category: "",
                difficulty: "MEDIUM",
                duration: 20,
                passingScore: 60,
                maxAttempts: 2,
                status: "DRAFT",
                thumbnail: ""
            });


            // Give user time to see success
            setTimeout(() => {

                window.location.href =
                    "/";

            }, 1000);

        } catch (err) {

            console.error(
                "Create quiz error:",
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
    // BACK
    // ==========================================

    const goBack = () => {
        window.location.href = "/";
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="create-quiz-loading">

                <h2>
                    Loading quiz form...
                </h2>

            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="create-quiz-page">

            <div className="create-quiz-container">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="create-quiz-header">

                    <button
                        type="button"
                        className="back-button"
                        onClick={goBack}
                    >
                        ← Back to Dashboard
                    </button>

                    <h1>
                        Create New Quiz
                    </h1>

                    <p>
                        Create a quiz for students
                        to attempt.
                    </p>

                </div>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (
                    <div className="create-quiz-error">
                        {error}
                    </div>
                )}


                {/* ==================================
                    SUCCESS
                ================================== */}

                {success && (
                    <div className="create-quiz-success">
                        {success}
                    </div>
                )}


                {/* ==================================
                    FORM
                ================================== */}

                <form
                    className="create-quiz-form"
                    onSubmit={
                        handleSubmit
                    }
                >


                    {/* ==================================
                        BASIC INFORMATION
                    ================================== */}

                    <section className="create-quiz-section">

                        <h2>
                            Basic Information
                        </h2>


                        <div className="create-quiz-field">

                            <label htmlFor="title">
                                Quiz Title
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={
                                    formData.title
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter quiz title"
                                required
                            />

                        </div>


                        <div className="create-quiz-field">

                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter quiz description"
                                rows="4"
                                required
                            />

                        </div>


                        <div className="create-quiz-field">

                            <label htmlFor="category">
                                Category
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={
                                    formData.category
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {categories.map(
                                    category => (

                                        <option
                                            key={
                                                category._id
                                            }
                                            value={
                                                category._id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </section>


                    {/* ==================================
                        QUIZ SETTINGS
                    ================================== */}

                    <section className="create-quiz-section">

                        <h2>
                            Quiz Settings
                        </h2>


                        <div className="create-quiz-grid">


                            <div className="create-quiz-field">

                                <label htmlFor="difficulty">
                                    Difficulty
                                </label>

                                <select
                                    id="difficulty"
                                    name="difficulty"
                                    value={
                                        formData.difficulty
                                    }
                                    onChange={
                                        handleChange
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


                            <div className="create-quiz-field">

                                <label htmlFor="duration">
                                    Duration (minutes)
                                </label>

                                <input
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    min="1"
                                    value={
                                        formData.duration
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="create-quiz-field">

                                <label htmlFor="passingScore">
                                    Passing Score (%)
                                </label>

                                <input
                                    id="passingScore"
                                    name="passingScore"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={
                                        formData.passingScore
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="create-quiz-field">

                                <label htmlFor="maxAttempts">
                                    Maximum Attempts
                                </label>

                                <input
                                    id="maxAttempts"
                                    name="maxAttempts"
                                    type="number"
                                    min="1"
                                    value={
                                        formData.maxAttempts
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                        </div>

                    </section>


                    {/* ==================================
                        PUBLISHING
                    ================================== */}

                    <section className="create-quiz-section">

                        <h2>
                            Publishing
                        </h2>


                        <div className="create-quiz-field">

                            <label htmlFor="status">
                                Quiz Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="DRAFT">
                                    Draft
                                </option>

                                <option value="PUBLISHED">
                                    Published
                                </option>

                                <option value="UNPUBLISHED">
                                    Unpublished
                                </option>

                            </select>

                            <small>
                                Draft quizzes are not
                                available to students.
                            </small>

                        </div>


                        <div className="create-quiz-field">

                            <label htmlFor="thumbnail">
                                Thumbnail URL
                            </label>

                            <input
                                id="thumbnail"
                                name="thumbnail"
                                type="text"
                                value={
                                    formData.thumbnail
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Optional thumbnail URL"
                            />

                        </div>

                    </section>


                    {/* ==================================
                        ACTIONS
                    ================================== */}

                    <div className="create-quiz-actions">

                        <button
                            type="button"
                            className="create-quiz-cancel"
                            onClick={goBack}
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="create-quiz-submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Creating..."
                                : "Create Quiz"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CreateQuiz;