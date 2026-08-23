const Quiz = require("../models/quiz");
const Category = require("../models/category");

// Create Quiz - Admin only
const createQuiz = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            difficulty,
            duration,
            passingScore,
            maxAttempts,
            status,
            thumbnail
        } = req.body;

        // Validate category
        const existingCategory = await Category.findById(category);

        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        const quiz = await Quiz.create({
            title,
            description,
            category,
            difficulty,
            duration,
            passingScore,
            maxAttempts,
            status,
            thumbnail
        });

        res.status(201).json({
            message: "Quiz created successfully",
            quiz
        });

    } catch (error) {
        console.error("Create quiz error:", error);

        res.status(500).json({
            message: "Failed to create quiz",
            error: error.message
        });
    }
};


// Get All Quizzes
const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find()
            .populate("category", "name description")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: quizzes.length,
            quizzes
        });

    } catch (error) {
        console.error("Get quizzes error:", error);

        res.status(500).json({
            message: "Failed to fetch quizzes",
            error: error.message
        });
    }
};


// Get Single Quiz
const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate("category", "name description");

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.status(200).json({
            quiz
        });

    } catch (error) {
        console.error("Get quiz error:", error);

        res.status(500).json({
            message: "Failed to fetch quiz",
            error: error.message
        });
    }
};


// Update Quiz - Admin only
const updateQuiz = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            difficulty,
            duration,
            passingScore,
            maxAttempts,
            status,
            thumbnail
        } = req.body;

        // Validate category if provided
        if (category) {
            const existingCategory = await Category.findById(category);

            if (!existingCategory) {
                return res.status(404).json({
                    message: "Category not found"
                });
            }
        }

        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                category,
                difficulty,
                duration,
                passingScore,
                maxAttempts,
                status,
                thumbnail
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("category", "name description");

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.status(200).json({
            message: "Quiz updated successfully",
            quiz
        });

    } catch (error) {
        console.error("Update quiz error:", error);

        res.status(500).json({
            message: "Failed to update quiz",
            error: error.message
        });
    }
};


// Delete Quiz - Admin only
const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.status(200).json({
            message: "Quiz deleted successfully"
        });

    } catch (error) {
        console.error("Delete quiz error:", error);

        res.status(500).json({
            message: "Failed to delete quiz",
            error: error.message
        });
    }
};


// Publish / Unpublish Quiz - Admin only
const publishQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (quiz.status === "PUBLISHED") {
            quiz.status = "UNPUBLISHED";
        } else {
            quiz.status = "PUBLISHED";
        }

        await quiz.save();

        res.status(200).json({
            message: `Quiz ${quiz.status.toLowerCase()} successfully`,
            quiz
        });

    } catch (error) {
        console.error("Publish quiz error:", error);

        res.status(500).json({
            message: "Failed to update quiz status",
            error: error.message
        });
    }
};


module.exports = {
    createQuiz,
    getQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    publishQuiz
};