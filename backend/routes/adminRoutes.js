const express = require("express");

const router = express.Router();

const {
    getDashboardStats,
    getDashboardAnalytics,
    getAllStudents,
    getStudentProfile,
    updateStudentStatus,
    deleteStudent
} = require("../controllers/adminController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");



// ADMIN DASHBOARD

// Dashboard Statistics
router.get(
    "/dashboard/stats",
    protect,
    authorizeRoles("ADMIN"),
    getDashboardStats
);


// Dashboard Analytics
router.get(
    "/dashboard/analytics",
    protect,
    authorizeRoles("ADMIN"),
    getDashboardAnalytics
);



// USER / STUDENT MANAGEMENT

// Get all students / Search students
router.get(
    "/students",
    protect,
    authorizeRoles("ADMIN"),
    getAllStudents
);


// Get student profile and performance
router.get(
    "/students/:id",
    protect,
    authorizeRoles("ADMIN"),
    getStudentProfile
);


// Activate / Deactivate student
router.patch(
    "/students/:id/status",
    protect,
    authorizeRoles("ADMIN"),
    updateStudentStatus
);


// Delete student account
router.delete(
    "/students/:id",
    protect,
    authorizeRoles("ADMIN"),
    deleteStudent
);


module.exports = router;