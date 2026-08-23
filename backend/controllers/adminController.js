const User = require("../models/user");
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Attempt = require("../models/attempt");



// GET ADMIN DASHBOARD STATISTICS

const getDashboardStats = async (req, res) => {
    try {

        const totalStudents = await User.countDocuments({
            role: "STUDENT"
        });

        const totalQuizzes = await Quiz.countDocuments();

        const publishedQuizzes = await Quiz.countDocuments({
            status: "PUBLISHED"
        });

        const draftQuizzes = await Quiz.countDocuments({
            status: "DRAFT"
        });

        const totalQuestions = await Question.countDocuments();

        const totalAttempts = await Attempt.countDocuments();

        const submittedAttempts = await Attempt.find({
            status: "SUBMITTED"
        });

        const quizzes = await Quiz.find();

        const quizPassingScores = {};

        quizzes.forEach((quiz) => {
            quizPassingScores[quiz._id.toString()] =
                quiz.passingScore;
        });

        let totalScore = 0;
        let totalPassed = 0;
        let totalFailed = 0;

        submittedAttempts.forEach((attempt) => {

            totalScore += attempt.percentage || 0;

            const passingScore =
                quizPassingScores[
                    attempt.quiz.toString()
                ];

            if (
                passingScore !== undefined &&
                attempt.percentage >= passingScore
            ) {
                totalPassed++;
            } else {
                totalFailed++;
            }
        });

        const averageScore =
            submittedAttempts.length > 0
                ? totalScore / submittedAttempts.length
                : 0;


        res.status(200).json({
            message:
                "Admin dashboard statistics fetched successfully",

            statistics: {
                totalStudents,
                totalQuizzes,
                publishedQuizzes,
                draftQuizzes,
                totalQuestions,
                totalAttempts,

                averageScore:
                    Number(averageScore.toFixed(2)),

                totalPassedAttempts:
                    totalPassed,

                totalFailedAttempts:
                    totalFailed
            }
        });

    } catch (error) {

        console.error(
            "Admin dashboard statistics error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching dashboard statistics"
        });
    }
};


// GET ADMIN DASHBOARD ANALYTICS

const getDashboardAnalytics = async (req, res) => {
    try {

        // Quiz attempts over time
        const attemptsOverTime = await Attempt.aggregate([
            {
                $match: {
                    status: "SUBMITTED"
                }
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$completedAt"
                        },
                        month: {
                            $month: "$completedAt"
                        },
                        day: {
                            $dayOfMonth: "$completedAt"
                        }
                    },
                    attempts: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                    "_id.day": 1
                }
            }
        ]);


        // Student registrations
        const studentRegistrations =
            await User.aggregate([
                {
                    $match: {
                        role: "STUDENT"
                    }
                },
                {
                    $group: {
                        _id: {
                            year: {
                                $year: "$createdAt"
                            },
                            month: {
                                $month: "$createdAt"
                            },
                            day: {
                                $dayOfMonth: "$createdAt"
                            }
                        },
                        registrations: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1,
                        "_id.day": 1
                    }
                }
            ]);


        // Average quiz scores
        const averageQuizScores =
            await Attempt.aggregate([
                {
                    $match: {
                        status: "SUBMITTED"
                    }
                },
                {
                    $group: {
                        _id: "$quiz",
                        averageScore: {
                            $avg: "$percentage"
                        },
                        attempts: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        averageScore: -1
                    }
                }
            ]);


        // Pass / Fail ratio
        const submittedAttempts =
            await Attempt.find({
                status: "SUBMITTED"
            });

        const quizzes = await Quiz.find();

        const passingScores = {};

        quizzes.forEach((quiz) => {
            passingScores[quiz._id.toString()] =
                quiz.passingScore;
        });

        let passed = 0;
        let failed = 0;

        submittedAttempts.forEach((attempt) => {

            const passingScore =
                passingScores[
                    attempt.quiz.toString()
                ];

            if (
                passingScore !== undefined &&
                attempt.percentage >= passingScore
            ) {
                passed++;
            } else {
                failed++;
            }
        });


        // Most popular quizzes
        const popularQuizzes =
            await Attempt.aggregate([
                {
                    $group: {
                        _id: "$quiz",
                        attempts: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        attempts: -1
                    }
                },
                {
                    $limit: 10
                }
            ]);


        // Most popular categories
        const popularCategories =
            await Quiz.aggregate([
                {
                    $group: {
                        _id: "$category",
                        quizCount: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        quizCount: -1
                    }
                },
                {
                    $limit: 10
                }
            ]);


        res.status(200).json({
            message:
                "Admin dashboard analytics fetched successfully",

            analytics: {
                attemptsOverTime,
                studentRegistrations,
                averageQuizScores,

                passFailRatio: {
                    passed,
                    failed
                },

                popularQuizzes,
                popularCategories
            }
        });

    } catch (error) {

        console.error(
            "Admin dashboard analytics error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching dashboard analytics"
        });
    }
};


// ======================================================
// GET ALL STUDENTS / SEARCH STUDENTS
// ======================================================

const getAllStudents = async (req, res) => {
    try {

        const { search } = req.query;

        const filter = {
            role: "STUDENT"
        };

        // Search by name or email
        if (search && search.trim() !== "") {

            filter.$or = [
                {
                    name: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                }
            ];
        }

        const students = await User.find(filter)
            .select("-password")
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            message: "Students fetched successfully",
            count: students.length,
            students
        });

    } catch (error) {

        console.error(
            "Get students error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching students"
        });
    }
};



// GET STUDENT PROFILE AND PERFORMANCE

const getStudentProfile = async (req, res) => {
    try {

        const { id } = req.params;

        // Find student
        const student = await User.findOne({
            _id: id,
            role: "STUDENT"
        }).select("-password");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Get student's attempts
        const attempts = await Attempt.find({
            user: id
        })
            .populate(
                "quiz",
                "title difficulty passingScore"
            )
            .sort({
                createdAt: -1
            });

        // Only submitted attempts count for performance
        const submittedAttempts = attempts.filter(
            attempt =>
                attempt.status === "SUBMITTED"
        );

        const totalAttempts = attempts.length;

        const completedAttempts =
            submittedAttempts.length;

        let totalPercentage = 0;
        let passedAttempts = 0;
        let failedAttempts = 0;

        submittedAttempts.forEach((attempt) => {

            totalPercentage +=
                attempt.percentage || 0;

            const passingScore =
                attempt.quiz?.passingScore;

            if (
                passingScore !== undefined &&
                attempt.percentage >= passingScore
            ) {
                passedAttempts++;
            } else {
                failedAttempts++;
            }
        });

        const averageScore =
            completedAttempts > 0
                ? totalPercentage / completedAttempts
                : 0;


        res.status(200).json({
            message:
                "Student profile fetched successfully",

            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
                status: student.status,
                createdAt: student.createdAt
            },

            performance: {
                totalAttempts,
                completedAttempts,

                averageScore:
                    Number(averageScore.toFixed(2)),

                passedAttempts,
                failedAttempts
            },

            attempts
        });

    } catch (error) {

        console.error(
            "Get student profile error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching student profile"
        });
    }
};


// ======================================================
// ACTIVATE / DEACTIVATE STUDENT
// ======================================================

const updateStudentStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (
            !status ||
            !["ACTIVE", "INACTIVE"].includes(status)
        ) {
            return res.status(400).json({
                message:
                    "Status must be either ACTIVE or INACTIVE"
            });
        }

        // Find only students
        const student = await User.findOne({
            _id: id,
            role: "STUDENT"
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Update status
        student.status = status;

        await student.save();

        res.status(200).json({
            message:
                `Student account ${status.toLowerCase()} successfully`,

            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
                status: student.status
            }
        });

    } catch (error) {

        console.error(
            "Update student status error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while updating student status"
        });
    }
};


// DELETE STUDENT ACCOUNT

const deleteStudent = async (req, res) => {
    try {

        const { id } = req.params;

        // Find only students
        const student = await User.findOne({
            _id: id,
            role: "STUDENT"
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Delete student account
        await User.deleteOne({
            _id: id
        });

        res.status(200).json({
            message: "Student account deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete student error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while deleting student account"
        });
    }
};

// EXPORTS

module.exports = {
    getDashboardStats,
    getDashboardAnalytics,
    getAllStudents,
    getStudentProfile,
    updateStudentStatus,
    deleteStudent
};