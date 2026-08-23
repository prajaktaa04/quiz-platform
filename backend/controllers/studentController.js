const Quiz = require("../models/quiz");
const Question = require("../models/question");
const User = require("../models/user");


// =====================================================
// GET AVAILABLE QUIZZES
// STUDENT ONLY
// SEARCH + FILTER
// =====================================================

const getAvailableQuizzes = async (req, res) => {
    try {

        const {
            search,
            category,
            difficulty
        } = req.query;

        const filter = {
            status: "PUBLISHED"
        };


        // Search by quiz title
        if (
            search &&
            search.trim() !== ""
        ) {
            filter.title = {
                $regex: search.trim(),
                $options: "i"
            };
        }


        // Filter by category
        if (
            category &&
            category.trim() !== ""
        ) {
            filter.category =
                category.trim();
        }


        // Filter by difficulty
        if (
            difficulty &&
            difficulty.trim() !== ""
        ) {
            filter.difficulty =
                difficulty
                    .trim()
                    .toUpperCase();
        }


        const quizzes =
            await Quiz.find(filter)
                .populate(
                    "category",
                    "name description"
                )
                .select("-__v")
                .sort({
                    createdAt: -1
                });


        res.status(200).json({
            message:
                "Available quizzes fetched successfully",

            count:
                quizzes.length,

            quizzes
        });

    } catch (error) {

        console.error(
            "Get available quizzes error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching available quizzes"
        });
    }
};


// =====================================================
// GET QUIZ DETAILS
// STUDENT ONLY
// =====================================================

const getQuizDetails = async (req, res) => {
    try {

        const { id } =
            req.params;


        // Find only published quiz
        const quiz =
            await Quiz.findOne({
                _id: id,
                status: "PUBLISHED"
            })
                .populate(
                    "category",
                    "name description"
                );


        if (!quiz) {
            return res.status(404).json({
                message:
                    "Quiz not found or unavailable"
            });
        }


        // Get questions
        const questions =
            await Question.find({
                quiz: quiz._id
            })
                .select(
                    "questionText options marks difficulty explanation"
                );


        // Remove correct-answer information
        const safeQuestions =
            questions.map(
                (question) => {

                    const safeOptions =
                        question.options.map(
                            (option) => ({
                                _id:
                                    option._id,

                                optionText:
                                    option.optionText
                            })
                        );

                    return {
                        _id:
                            question._id,

                        questionText:
                            question.questionText,

                        options:
                            safeOptions,

                        marks:
                            question.marks,

                        difficulty:
                            question.difficulty
                    };
                }
            );


        res.status(200).json({

            message:
                "Quiz details fetched successfully",

            quiz: {
                _id:
                    quiz._id,

                title:
                    quiz.title,

                description:
                    quiz.description,

                category:
                    quiz.category,

                difficulty:
                    quiz.difficulty,

                duration:
                    quiz.duration,

                passingScore:
                    quiz.passingScore,

                maxAttempts:
                    quiz.maxAttempts,

                status:
                    quiz.status,

                createdAt:
                    quiz.createdAt
            },

            totalQuestions:
                safeQuestions.length,

            totalMarks:
                safeQuestions.reduce(
                    (
                        total,
                        question
                    ) =>
                        total +
                        question.marks,
                    0
                ),

            questions:
                safeQuestions
        });

    } catch (error) {

        console.error(
            "Get quiz details error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching quiz details"
        });
    }
};


// =====================================================
// ADMIN - GET ALL STUDENTS
// =====================================================

const getAllStudents = async (
    req,
    res
) => {

    try {

        const students =
            await User.find({
                role: "STUDENT"
            })
                .select(
                    "-password"
                )
                .sort({
                    createdAt: -1
                });


        res.status(200).json({

            message:
                "Students fetched successfully",

            count:
                students.length,

            students
        });

    } catch (error) {

        console.error(
            "Get students error:",
            error.message
        );

        res.status(500).json({
            message:
                "Failed to fetch students"
        });
    }
};


// =====================================================
// ADMIN - GET SINGLE STUDENT
// =====================================================

const getStudentById = async (
    req,
    res
) => {

    try {

        const student =
            await User.findOne({
                _id: req.params.id,
                role: "STUDENT"
            })
                .select(
                    "-password"
                );


        if (!student) {

            return res.status(404).json({
                message:
                    "Student not found"
            });
        }


        res.status(200).json({

            message:
                "Student fetched successfully",

            student
        });

    } catch (error) {

        console.error(
            "Get student error:",
            error.message
        );

        res.status(500).json({
            message:
                "Invalid student ID"
        });
    }
};


// =====================================================
// ADMIN - UPDATE STUDENT STATUS
// =====================================================

const updateStudentStatus = async (
    req,
    res
) => {

    try {

        const {
            status
        } = req.body;


        if (
            !status ||
            ![
                "ACTIVE",
                "INACTIVE"
            ].includes(status)
        ) {

            return res.status(400).json({
                message:
                    "Valid status is required"
            });
        }


        const student =
            await User.findOne({
                _id: req.params.id,
                role: "STUDENT"
            });


        if (!student) {

            return res.status(404).json({
                message:
                    "Student not found"
            });
        }


        student.status =
            status;


        await student.save();


        res.status(200).json({

            message:
                "Student status updated successfully",

            student: {
                id:
                    student._id,

                name:
                    student.name,

                email:
                    student.email,

                role:
                    student.role,

                status:
                    student.status,

                createdAt:
                    student.createdAt
            }
        });

    } catch (error) {

        console.error(
            "Update student status error:",
            error.message
        );

        res.status(500).json({
            message:
                "Failed to update student status"
        });
    }
};


// =====================================================
// ADMIN - DELETE STUDENT
// =====================================================

const deleteStudent = async (
    req,
    res
) => {

    try {

        const student =
            await User.findOne({
                _id: req.params.id,
                role: "STUDENT"
            });


        if (!student) {

            return res.status(404).json({
                message:
                    "Student not found"
            });
        }


        await student.deleteOne();


        res.status(200).json({

            message:
                "Student deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete student error:",
            error.message
        );

        res.status(500).json({
            message:
                "Failed to delete student"
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    // Student quiz functionality
    getAvailableQuizzes,
    getQuizDetails,

    // Admin student management
    getAllStudents,
    getStudentById,
    updateStudentStatus,
    deleteStudent
};