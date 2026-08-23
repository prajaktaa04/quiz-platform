const express = require("express");

const router = express.Router();

const {
    startAttempt,
    submitAttempt,
    getMyAttempts,
    getAttemptById,
    getAllAttempts,
    getQuizAnalytics,
    getStudentAttemptDetails
} = require("../controllers/attemptController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");


// ===============================
// STUDENT QUIZ ATTEMPTS
// ===============================

// Start a quiz attempt
router.post(
    "/start",
    protect,
    startAttempt
);


// Get student's attempt details for quiz interface
router.get(
    "/student/:id",
    protect,
    authorizeRoles("STUDENT"),
    getStudentAttemptDetails
);


// Submit quiz attempt
router.post(
    "/:id/submit",
    protect,
    submitAttempt
);


// Get logged-in user's attempts
router.get(
    "/my",
    protect,
    getMyAttempts
);


// ===============================
// ADMIN ATTEMPTS & ANALYTICS
// ===============================

// Admin - Get all attempts
router.get(
    "/all",
    protect,
    authorizeRoles("ADMIN"),
    getAllAttempts
);


// Admin - Quiz analytics
router.get(
    "/analytics/:quizId",
    protect,
    authorizeRoles("ADMIN"),
    getQuizAnalytics
);


// Get single attempt
router.get(
    "/:id",
    protect,
    getAttemptById
);


module.exports = router;