const express = require("express");

const router =
    express.Router();

const {

    getAvailableQuizzes,

    getQuizDetails,

    getAllStudents,

    getStudentById,

    updateStudentStatus,

    deleteStudent

} = require(
    "../controllers/studentController"
);

const {

    protect,

    authorizeRoles

} = require(
    "../middleware/authMiddleware"
);


// =====================================================
// STUDENT QUIZ BROWSING
// =====================================================

// Get available published quizzes
// Supports search and filtering

router.get(
    "/quizzes",
    protect,
    authorizeRoles("STUDENT"),
    getAvailableQuizzes
);


// Get quiz details

router.get(
    "/quizzes/:id",
    protect,
    authorizeRoles("STUDENT"),
    getQuizDetails
);


// =====================================================
// ADMIN STUDENT MANAGEMENT
// =====================================================

// Get all students

router.get(
    "/admin/all",
    protect,
    authorizeRoles("ADMIN"),
    getAllStudents
);


// Get single student

router.get(
    "/admin/:id",
    protect,
    authorizeRoles("ADMIN"),
    getStudentById
);


// Activate / Deactivate student

router.patch(
    "/admin/:id/status",
    protect,
    authorizeRoles("ADMIN"),
    updateStudentStatus
);


// Delete student

router.delete(
    "/admin/:id",
    protect,
    authorizeRoles("ADMIN"),
    deleteStudent
);


module.exports = router;