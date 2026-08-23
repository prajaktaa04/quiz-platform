const Question = require("../models/question");
const Quiz = require("../models/quiz");

// CREATE QUESTION
const createQuestion = async (req, res) => {
    try {
        const {
            quiz,
            questionText,
            options,
            explanation,
            marks,
            difficulty
        } = req.body;

        // Validate required fields
        if (!quiz || !questionText || !options || !difficulty) {
            return res.status(400).json({
                message: "Quiz, question text, options and difficulty are required"
            });
        }

        // Check quiz exists
        const existingQuiz = await Quiz.findById(quiz);

        if (!existingQuiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        // Check options
        if (!Array.isArray(options) || options.length < 2) {
            return res.status(400).json({
                message: "A question must have at least 2 options"
            });
        }

        // Check at least one correct option
        const hasCorrectOption = options.some(
            option => option.isCorrect === true
        );

        if (!hasCorrectOption) {
            return res.status(400).json({
                message: "At least one option must be correct"
            });
        }

        const question = await Question.create({
            quiz,
            questionText,
            options,
            explanation,
            marks: marks || 1,
            difficulty
        });

        res.status(201).json({
            message: "Question created successfully",
            question
        });

    } catch (error) {
        console.error("Create question error:", error.message);

        res.status(500).json({
            message: "Failed to create question",
            error: error.message
        });
    }
};


// GET ALL QUESTIONS FOR A QUIZ
const getQuestionsByQuiz = async (req, res) => {
    try {
        const questions = await Question.find({
            quiz: req.params.quizId
        }).sort({ createdAt: 1 });

        res.status(200).json({
            count: questions.length,
            questions
        });

    } catch (error) {
        console.error("Get questions error:", error.message);

        res.status(500).json({
            message: "Failed to fetch questions"
        });
    }
};


// GET SINGLE QUESTION
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        res.status(200).json({
            question
        });

    } catch (error) {
        console.error("Get question error:", error.message);

        res.status(500).json({
            message: "Invalid question ID"
        });
    }
};


// UPDATE QUESTION
const updateQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        const {
            questionText,
            options,
            explanation,
            marks,
            difficulty
        } = req.body;

        if (questionText !== undefined) {
            question.questionText = questionText;
        }

        if (options !== undefined) {
            if (!Array.isArray(options) || options.length < 2) {
                return res.status(400).json({
                    message: "A question must have at least 2 options"
                });
            }

            const hasCorrectOption = options.some(
                option => option.isCorrect === true
            );

            if (!hasCorrectOption) {
                return res.status(400).json({
                    message: "At least one option must be correct"
                });
            }

            question.options = options;
        }

        if (explanation !== undefined) {
            question.explanation = explanation;
        }

        if (marks !== undefined) {
            question.marks = marks;
        }

        if (difficulty !== undefined) {
            question.difficulty = difficulty;
        }

        await question.save();

        res.status(200).json({
            message: "Question updated successfully",
            question
        });

    } catch (error) {
        console.error("Update question error:", error.message);

        res.status(500).json({
            message: "Failed to update question",
            error: error.message
        });
    }
};


// DELETE QUESTION
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        await question.deleteOne();

        res.status(200).json({
            message: "Question deleted successfully"
        });

    } catch (error) {
        console.error("Delete question error:", error.message);

        res.status(500).json({
            message: "Failed to delete question"
        });
    }
};


module.exports = {
    createQuestion,
    getQuestionsByQuiz,
    getQuestionById,
    updateQuestion,
    deleteQuestion
};