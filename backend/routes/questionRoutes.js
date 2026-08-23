const express = require("express");

const router = express.Router();

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    createQuestion,
    getQuestionsByQuiz,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} = require("../controllers/questionController");


// Get all questions for a quiz
router.get(
    "/quiz/:quizId",
    protect,
    getQuestionsByQuiz
);


// Get single question
router.get(
    "/:id",
    protect,
    getQuestionById
);


// Create question - Admin only
router.post(
    "/",
    protect,
    authorizeRoles("ADMIN"),
    createQuestion
);


// Update question - Admin only
router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    updateQuestion
);


// Delete question - Admin only
router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    deleteQuestion
);


module.exports = router;