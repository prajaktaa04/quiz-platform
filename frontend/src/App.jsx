import "./App.css";


// ==========================================
// AUTHENTICATION
// ==========================================

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


// ==========================================
// STUDENT
// ==========================================

import StudentDashboard from "./pages/StudentDashboard";
import StudentProgress from "./pages/StudentProgress";
import Leaderboard from "./pages/Leaderboard";
import QuizDetails from "./pages/QuizDetails";
import QuizAttempt from "./pages/QuizAttempt";
import AttemptDetails from "./pages/AttemptDetails";


// ==========================================
// ADMIN
// ==========================================

import AdminDashboard from "./pages/AdminDashboard";
import CreateQuiz from "./pages/CreateQuiz";
import CategoryManagement from "./pages/CategoryManagement";
import QuestionManagement from "./pages/QuestionManagement";
import QuizAnalytics from "./pages/QuizAnalytics";
import StudentPerformance from "./pages/StudentPerformance";
import StudentManagement from "./pages/StudentManagement";


function App() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    // ==========================================
    // COMMON PARAMETERS
    // ==========================================

    const attemptId =
        params.get("attemptId");

    const review =
        params.get("review") === "true";


    // ==========================================
    // QUIZ DETAILS
    // ==========================================

    const quizId =
        params.get("quizId");


    // ==========================================
    // AUTHENTICATION PARAMETERS
    // ==========================================

    const register =
        params.get("register") === "true";

    const forgotPassword =
        params.get("forgotPassword") === "true";

    const resetPassword =
        params.get("resetPassword");


    // ==========================================
    // ADMIN PARAMETERS
    // ==========================================

    const createQuiz =
        params.get("createQuiz") === "true";

    const manageCategories =
        params.get("categories") === "true";

    const manageQuestions =
        params.get("questions") === "true";

    const analytics =
        params.get("analytics") === "true";

    const performance =
        params.get("performance") === "true";

    const students =
        params.get("students") === "true";


    // ==========================================
    // STUDENT PARAMETERS
    // ==========================================

    const studentPerformance =
        params.get("studentPerformance") === "true";

    const leaderboard =
        params.get("leaderboard") === "true";


    // ==========================================
    // LOGIN CHECK
    // ==========================================

    const token =
        localStorage.getItem("token");

    const storedUser =
        localStorage.getItem("user");


    let user = null;


    if (storedUser) {

        try {

            user =
                JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "Invalid stored user:",
                error
            );

            localStorage.removeItem("user");

        }
    }


    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    if (!token || !user) {


        // --------------------------------------
        // REGISTER
        // --------------------------------------

        if (register) {

            return <Register />;

        }


        // --------------------------------------
        // FORGOT PASSWORD
        // --------------------------------------

        if (forgotPassword) {

            return <ForgotPassword />;

        }


        // --------------------------------------
        // RESET PASSWORD
        // --------------------------------------

        if (resetPassword) {

            return <ResetPassword />;

        }


        // --------------------------------------
        // LOGIN
        // --------------------------------------

        return <Login />;

    }


    // ==========================================
    // STUDENT - QUIZ DETAILS
    // ==========================================

    if (
        quizId &&
        user.role === "STUDENT"
    ) {

        return (
            <QuizDetails
                quizId={quizId}
            />
        );

    }


    // ==========================================
    // ATTEMPT REVIEW
    // ==========================================

    if (
        attemptId &&
        review
    ) {

        return (
            <AttemptDetails
                attemptId={attemptId}
            />
        );

    }


    // ==========================================
    // ACTIVE QUIZ
    // ==========================================

    if (attemptId) {

        return (
            <QuizAttempt
                attemptId={attemptId}
            />
        );

    }


    // ==========================================
    // STUDENT PERFORMANCE
    // ==========================================

    if (
        studentPerformance &&
        user.role === "STUDENT"
    ) {

        return <StudentProgress />;

    }


    // ==========================================
    // STUDENT LEADERBOARD
    // ==========================================

    if (
        leaderboard &&
        user.role === "STUDENT"
    ) {

        return <Leaderboard />;

    }


    // ==========================================
    // ADMIN - CREATE QUIZ
    // ==========================================

    if (
        createQuiz &&
        user.role === "ADMIN"
    ) {

        return <CreateQuiz />;

    }


    // ==========================================
    // ADMIN - CATEGORIES
    // ==========================================

    if (
        manageCategories &&
        user.role === "ADMIN"
    ) {

        return <CategoryManagement />;

    }


    // ==========================================
    // ADMIN - QUESTIONS
    // ==========================================

    if (
        manageQuestions &&
        user.role === "ADMIN"
    ) {

        return <QuestionManagement />;

    }


    // ==========================================
    // ADMIN - ANALYTICS
    // ==========================================

    if (
        analytics &&
        user.role === "ADMIN"
    ) {

        return <QuizAnalytics />;

    }


    // ==========================================
    // ADMIN - STUDENT PERFORMANCE
    // ==========================================

    if (
        performance &&
        user.role === "ADMIN"
    ) {

        return <StudentPerformance />;

    }


    // ==========================================
    // ADMIN - STUDENT MANAGEMENT
    // ==========================================

    if (
        students &&
        user.role === "ADMIN"
    ) {

        return <StudentManagement />;

    }


    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    if (user.role === "ADMIN") {

        return <AdminDashboard />;

    }


    // ==========================================
    // STUDENT DASHBOARD
    // ==========================================

    return <StudentDashboard />;

}


export default App;