import { useEffect, useState } from "react";

import API_URL from "../config";

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [myPosition, setMyPosition] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    const storedUser = localStorage.getItem("user");

    let user = null;

    try {
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (error) {
        console.error("Invalid stored user:", error);
    }

    // ==========================================
    // FETCH LEADERBOARD
    // ==========================================

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
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
                `${API_URL}/leaderboard`,
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
                    "Failed to fetch leaderboard"
                );
            }

            const leaderboardData =
                data.leaderboard || [];

            setLeaderboard(
                leaderboardData
            );

            // ==========================================
            // FIND CURRENT STUDENT
            // ==========================================

            const currentUserId =
                user?.id ||
                user?._id;

            const currentStudent =
                leaderboardData.find(
                    (student) => {

                        const studentId =
                            student.user?._id ||
                            student.studentId ||
                            student.userId ||
                            student._id;

                        return (
                            String(studentId) ===
                            String(currentUserId)
                        );
                    }
                );

            // ==========================================
            // CURRENT STUDENT POSITION
            // ==========================================

            if (currentStudent) {

                const studentIndex =
                    leaderboardData.indexOf(
                        currentStudent
                    );

                setMyPosition({

                    rank:
                        currentStudent.rank ||
                        studentIndex + 1,

                    averagePercentage:
                        currentStudent.averagePercentage ||
                        0,

                    totalAttempts:
                        currentStudent.totalAttempts ||
                        0,

                    highestPercentage:
                        currentStudent.bestScore ||
                        0,

                    passed:
                        currentStudent.passed ||
                        0

                });

            } else {

                setMyPosition(null);

            }

        } catch (error) {

            console.error(
                "Leaderboard error:",
                error
            );

            setError(
                error.message ||
                "Unable to load leaderboard"
            );

        } finally {

            setLoading(false);

        }
    };

    // ==========================================
    // DASHBOARD
    // ==========================================

    const goToDashboard = () => {
        window.location.href = "/";
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
            <div className="leaderboard-loading">

                <div className="leaderboard-spinner"></div>

                <h2>
                    Loading Leaderboard
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
            <div className="leaderboard-error">

                <h2>
                    Unable to load leaderboard
                </h2>

                <p>
                    {error}
                </p>

                <div className="leaderboard-error-actions">

                    <button
                        type="button"
                        onClick={fetchLeaderboard}
                    >
                        Try Again
                    </button>

                    <button
                        type="button"
                        onClick={goToDashboard}
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }

    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (
        <div className="leaderboard-page">

            {/* ==========================================
                HEADER
            ========================================== */}

            <header className="leaderboard-header">

                <div>

                    <h1>
                        Quiz Platform
                    </h1>

                    <p>
                        Student Leaderboard
                    </p>

                </div>

                <div className="leaderboard-header-actions">

                    <span>
                        👤{" "}
                        {user?.name || "Student"}
                    </span>

                    <button
                        type="button"
                        className="leaderboard-back-button"
                        onClick={goToDashboard}
                    >
                        ← Dashboard
                    </button>

                    <button
                        type="button"
                        className="student-logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>

            {/* ==========================================
                CONTENT
            ========================================== */}

            <main className="leaderboard-container">

                {/* TITLE */}

                <section className="leaderboard-title-section">

                    <h2>
                        🏆 Leaderboard
                    </h2>

                    <p>
                        See how you rank against
                        other students.
                    </p>

                </section>


                {/* ==========================================
                    MY POSITION
                ========================================== */}

                {myPosition && (

                    <section className="my-leaderboard-card">

                        <div>

                            <span>
                                Your Rank
                            </span>

                            <strong>
                                #{myPosition.rank}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Average Score
                            </span>

                            <strong>
                                {Number(
                                    myPosition.averagePercentage
                                ).toFixed(1)}
                                %
                            </strong>

                        </div>

                        <div>

                            <span>
                                Attempts
                            </span>

                            <strong>
                                {myPosition.totalAttempts}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Highest Score
                            </span>

                            <strong>
                                {Number(
                                    myPosition.highestPercentage
                                ).toFixed(1)}
                                %
                            </strong>

                        </div>

                    </section>

                )}


                {/* ==========================================
                    LEADERBOARD TABLE
                ========================================== */}

                <section className="leaderboard-card">

                    {leaderboard.length === 0 ? (

                        <div className="leaderboard-empty">

                            <h3>
                                No leaderboard data
                            </h3>

                            <p>
                                Complete a quiz to
                                appear on the leaderboard.
                            </p>

                        </div>

                    ) : (

                        <div className="leaderboard-table-wrapper">

                            <table className="leaderboard-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Rank
                                        </th>

                                        <th>
                                            Student
                                        </th>

                                        <th>
                                            Attempts
                                        </th>

                                        <th>
                                            Average Score
                                        </th>

                                        <th>
                                            Highest Score
                                        </th>

                                        <th>
                                            Passed
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {leaderboard.map(
                                        (student, index) => {

                                            // Backend structure:
                                            //
                                            // student.user.name
                                            // student.user._id
                                            // student.totalAttempts
                                            // student.bestScore
                                            // student.averagePercentage
                                            // student.passed

                                            const studentId =
                                                student.user?._id ||
                                                student.studentId ||
                                                student.userId ||
                                                student._id;

                                            const studentName =
                                                student.user?.name ||
                                                student.name ||
                                                "Student";

                                            const currentUserId =
                                                user?.id ||
                                                user?._id;

                                            const isCurrentUser =
                                                String(
                                                    studentId
                                                ) ===
                                                String(
                                                    currentUserId
                                                );

                                            const rank =
                                                student.rank ||
                                                index + 1;

                                            const attempts =
                                                student.totalAttempts ||
                                                0;

                                            const averageScore =
                                                student.averagePercentage ||
                                                0;

                                            const highestScore =
                                                student.bestScore ||
                                                student.highestPercentage ||
                                                0;

                                            const passed =
                                                student.passed ||
                                                student.passedAttempts ||
                                                0;

                                            return (

                                                <tr
                                                    key={
                                                        studentId ||
                                                        index
                                                    }

                                                    className={
                                                        isCurrentUser
                                                            ? "current-student"
                                                            : ""
                                                    }
                                                >

                                                    {/* RANK */}

                                                    <td>

                                                        <span
                                                            className={
                                                                index < 3
                                                                    ? "leaderboard-rank top-rank"
                                                                    : "leaderboard-rank"
                                                            }
                                                        >

                                                            {index === 0
                                                                ? "🥇"
                                                                : index === 1
                                                                    ? "🥈"
                                                                    : index === 2
                                                                        ? "🥉"
                                                                        : rank}

                                                        </span>

                                                    </td>


                                                    {/* STUDENT */}

                                                    <td>

                                                        <div className="leaderboard-student-name">

                                                            <strong>
                                                                {
                                                                    studentName
                                                                }
                                                            </strong>

                                                            {isCurrentUser && (

                                                                <span className="you-badge">
                                                                    YOU
                                                                </span>

                                                            )}

                                                        </div>

                                                    </td>


                                                    {/* ATTEMPTS */}

                                                    <td>
                                                        {attempts}
                                                    </td>


                                                    {/* AVERAGE SCORE */}

                                                    <td>

                                                        <strong>
                                                            {Number(
                                                                averageScore
                                                            ).toFixed(1)}
                                                            %
                                                        </strong>

                                                    </td>


                                                    {/* HIGHEST SCORE */}

                                                    <td>

                                                        {Number(
                                                            highestScore
                                                        ).toFixed(1)}
                                                        %

                                                    </td>


                                                    {/* PASSED */}

                                                    <td>

                                                        {passed}

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

export default Leaderboard;