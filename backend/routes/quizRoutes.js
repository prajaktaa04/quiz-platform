const express = require("express");

const router = express.Router();

const {
    createQuiz,
    getQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    publishQuiz
} = require("../controllers/quizController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");


// Get all quizzes
router.get("/", protect, getQuizzes);


// Get single quiz
router.get("/:id", protect, getQuizById);


// Create quiz - Admin only
router.post("/", protect, authorizeRoles("ADMIN"), createQuiz);


// Update quiz - Admin only
router.put("/:id", protect, authorizeRoles("ADMIN"), updateQuiz);


// Delete quiz - Admin only
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteQuiz);


// Publish / Unpublish quiz - Admin only
router.patch(
    "/:id/publish",
    protect,
    authorizeRoles("ADMIN"),
    publishQuiz
);


module.exports = router;