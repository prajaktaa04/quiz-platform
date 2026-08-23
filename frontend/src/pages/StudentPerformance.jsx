import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api";

function StudentPerformance() {

    const [attempts, setAttempts] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [filter, setFilter] =
        useState("ALL");


    // ==========================================
    // FETCH ATTEMPTS
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
                    `${API_URL}/attempts/all`,
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
                    "Failed to fetch attempts"
                );
            }

            setAttempts(
                data.attempts || []
            );

        } catch (error) {

            console.error(
                "Fetch attempts error:",
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
    // BACK TO DASHBOARD
    // ==========================================

    const goBack = () => {

        window.location.href =
            "/";
    };


    // ==========================================
    // FILTER SUBMITTED ATTEMPTS
    // ==========================================

    const submittedAttempts =
        useMemo(() => {

            return attempts.filter(
                attempt =>
                    attempt.status ===
                    "SUBMITTED"
            );

        }, [attempts]);


    // ==========================================
    // SEARCH + FILTER
    // ==========================================

    const filteredAttempts =
        useMemo(() => {

            const searchText =
                search
                    .trim()
                    .toLowerCase();

            return submittedAttempts.filter(
                attempt => {

                    const studentName =
                        attempt.user?.name ||
                        "";

                    const studentEmail =
                        attempt.user?.email ||
                        "";

                    const quizTitle =
                        attempt.quiz?.title ||
                        "";

                    const matchesSearch =
                        !searchText ||
                        studentName
                            .toLowerCase()
                            .includes(searchText) ||
                        studentEmail
                            .toLowerCase()
                            .includes(searchText) ||
                        quizTitle
                            .toLowerCase()
                            .includes(searchText);

                    const matchesFilter =
                        filter === "ALL" ||
                        attempt.status ===
                            "SUBMITTED" &&
                            (
                                filter === "PASSED"
                                    ? attempt.percentage >=
                                      (
                                          attempt.quiz?.passingScore ||
                                          0
                                      )
                                    : attempt.percentage <
                                      (
                                          attempt.quiz?.passingScore ||
                                          0
                                      )
                            );

                    return (
                        matchesSearch &&
                        matchesFilter
                    );
                }
            );

        }, [
            submittedAttempts,
            search,
            filter
        ]);


    // ==========================================
    // STATISTICS
    // ==========================================

    const totalAttempts =
        submittedAttempts.length;

    const passedAttempts =
        submittedAttempts.filter(
            attempt =>
                attempt.percentage >=
                (
                    attempt.quiz?.passingScore ||
                    0
                )
        ).length;

    const failedAttempts =
        totalAttempts -
        passedAttempts;

    const averagePercentage =
        totalAttempts > 0
            ? submittedAttempts.reduce(
                (
                    total,
                    attempt
                ) =>
                    total +
                    (
                        Number(
                            attempt.percentage
                        ) || 0
                    ),
                0
            ) / totalAttempts
            : 0;


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="performance-loading">

                <div className="performance-spinner"></div>

                <h2>
                    Loading Student Performance
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
            <div className="performance-error-page">

                <div className="performance-error-card">

                    <h2>
                        Unable to load performance
                    </h2>

                    <p>
                        {error}
                    </p>

                    <div className="performance-error-actions">

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
        <div className="performance-page">


            {/* ==================================
                HEADER
            ================================== */}

            <header className="performance-header">

                <div>

                    <h1>
                        Student Performance
                    </h1>

                    <p>
                        Monitor student quiz
                        attempts and performance
                    </p>

                </div>


                <div className="performance-header-actions">

                    <button
                        type="button"
                        className="performance-back-button"
                        onClick={
                            goBack
                        }
                    >
                        ← Back to Dashboard
                    </button>

                    <button
                        type="button"
                        className="performance-logout-button"
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

            <main className="performance-container">


                {/* ==================================
                    STATISTICS
                ================================== */}

                <section className="performance-stats">

                    <div className="performance-stat-card">

                        <span>
                            Total Attempts
                        </span>

                        <strong>
                            {totalAttempts}
                        </strong>

                    </div>


                    <div className="performance-stat-card passed">

                        <span>
                            Passed
                        </span>

                        <strong>
                            {passedAttempts}
                        </strong>

                    </div>


                    <div className="performance-stat-card failed">

                        <span>
                            Failed
                        </span>

                        <strong>
                            {failedAttempts}
                        </strong>

                    </div>


                    <div className="performance-stat-card">

                        <span>
                            Average Percentage
                        </span>

                        <strong>
                            {
                                averagePercentage.toFixed(
                                    2
                                )
                            }%
                        </strong>

                    </div>

                </section>


                {/* ==================================
                    FILTERS
                ================================== */}

                <section className="performance-filters">

                    <div className="performance-search">

                        <label>
                            Search
                        </label>

                        <input
                            type="text"
                            placeholder="Search student or quiz..."
                            value={search}
                            onChange={
                                event =>
                                    setSearch(
                                        event.target.value
                                    )
                            }
                        />

                    </div>


                    <div className="performance-filter">

                        <label>
                            Result
                        </label>

                        <select
                            value={filter}
                            onChange={
                                event =>
                                    setFilter(
                                        event.target.value
                                    )
                            }
                        >

                            <option value="ALL">
                                All Results
                            </option>

                            <option value="PASSED">
                                Passed
                            </option>

                            <option value="FAILED">
                                Failed
                            </option>

                        </select>

                    </div>

                </section>


                {/* ==================================
                    TABLE
                ================================== */}

                <section className="performance-section">

                    <div className="performance-section-heading">

                        <div>

                            <h2>
                                Attempt History
                            </h2>

                            <p>
                                {
                                    filteredAttempts.length
                                }{" "}
                                attempt
                                {
                                    filteredAttempts.length !== 1
                                        ? "s"
                                        : ""
                                }{" "}
                                found
                            </p>

                        </div>

                    </div>


                    {filteredAttempts.length === 0 ? (

                        <div className="performance-empty">

                            <h3>
                                No attempts found
                            </h3>

                            <p>
                                Try changing your
                                search or filter.
                            </p>

                        </div>

                    ) : (

                        <div className="performance-table-wrapper">

                            <table className="performance-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Student
                                        </th>

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
                                            Result
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        filteredAttempts.map(
                                            attempt => {

                                                const passed =
                                                    attempt.percentage >=
                                                    (
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

                                                            <div className="performance-student">

                                                                <strong>
                                                                    {
                                                                        attempt.user?.name ||
                                                                        "Unknown Student"
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        attempt.user?.email ||
                                                                        "No email"
                                                                    }
                                                                </span>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <div className="performance-quiz">

                                                                <strong>
                                                                    {
                                                                        attempt.quiz?.title ||
                                                                        "Unknown Quiz"
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        attempt.quiz?.difficulty ||
                                                                        "N/A"
                                                                    }
                                                                </span>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <strong>
                                                                {
                                                                    attempt.score ??
                                                                    0
                                                                }
                                                            </strong>

                                                            {" / "}

                                                            {
                                                                attempt.totalMarks ??
                                                                0
                                                            }

                                                        </td>


                                                        <td>

                                                            <strong>
                                                                {
                                                                    Number(
                                                                        attempt.percentage ||
                                                                        0
                                                                    ).toFixed(
                                                                        2
                                                                    )
                                                                }%
                                                            </strong>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    passed
                                                                        ? "performance-result passed"
                                                                        : "performance-result failed"
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

                                                            {
                                                                attempt.completedAt
                                                                    ? new Date(
                                                                        attempt.completedAt
                                                                    ).toLocaleDateString()
                                                                    : "-"
                                                            }

                                                        </td>

                                                    </tr>

                                                );
                                            }
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default StudentPerformance;