const Attempt = require("../models/attempt");
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Answer = require("../models/answer");


// ==========================================
// START QUIZ ATTEMPT
// ==========================================

const startAttempt = async (req, res) => {
    try {
        const { quizId } = req.body;

        if (!quizId) {
            return res.status(400).json({
                message: "Quiz ID is required"
            });
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (quiz.status !== "PUBLISHED") {
            return res.status(400).json({
                message: "Quiz is not available for attempt"
            });
        }

        const previousAttempts = await Attempt.countDocuments({
            quiz: quizId,
            user: req.user.userId
        });

        if (previousAttempts >= quiz.maxAttempts) {
            return res.status(403).json({
                message: "Maximum attempts reached"
            });
        }

        const questions = await Question.find({
            quiz: quizId
        });

        if (questions.length === 0) {
            return res.status(400).json({
                message: "Quiz has no questions"
            });
        }

        const totalMarks = questions.reduce(
            (total, question) => total + question.marks,
            0
        );

        const attempt = await Attempt.create({
            quiz: quizId,
            user: req.user.userId,
            totalMarks,
            status: "IN_PROGRESS"
        });

        res.status(201).json({
            message: "Quiz attempt started successfully",
            attempt: {
                id: attempt._id,
                quiz: attempt.quiz,
                user: attempt.user,
                startedAt: attempt.startedAt,
                totalMarks: attempt.totalMarks,
                status: attempt.status
            }
        });

    } catch (error) {
        console.error(
            "Start attempt error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while starting quiz attempt"
        });
    }
};


// ==========================================
// SUBMIT QUIZ
// ==========================================

const submitAttempt = async (req, res) => {
    try {
        const { answers } = req.body;

        const attempt = await Attempt.findById(
            req.params.id
        );

        if (!attempt) {
            return res.status(404).json({
                message: "Attempt not found"
            });
        }

        // ==========================================
        // STUDENT OWNERSHIP CHECK
        // ==========================================

        if (
            req.user.role === "STUDENT" &&
            attempt.user.toString() !==
                String(req.user.userId)
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        if (attempt.status === "SUBMITTED") {
            return res.status(400).json({
                message:
                    "Attempt has already been submitted"
            });
        }

        if (!Array.isArray(answers)) {
            return res.status(400).json({
                message: "Answers must be an array"
            });
        }

        const quiz = await Quiz.findById(
            attempt.quiz
        );

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        const completedAt = new Date();

        const timeTaken = Math.floor(
            (completedAt - attempt.startedAt) / 1000
        );

        const durationInSeconds =
            quiz.duration * 60;

        if (timeTaken > durationInSeconds) {
            return res.status(400).json({
                message:
                    "Quiz time has expired. Submission rejected."
            });
        }

        const questions = await Question.find({
            quiz: attempt.quiz
        });

        if (questions.length === 0) {
            return res.status(400).json({
                message: "Quiz has no questions"
            });
        }

        let score = 0;
        let correctAnswers = 0;
        let incorrectAnswers = 0;
        let unanswered = 0;

        const answerDocuments = [];

        for (const question of questions) {

            const submittedAnswer = answers.find(
                answer =>
                    answer.questionId ===
                    question._id.toString()
            );

            if (
                !submittedAnswer ||
                !submittedAnswer.selectedOptionId
            ) {
                unanswered++;

                answerDocuments.push({
                    attempt: attempt._id,
                    question: question._id,
                    selectedOption: null,
                    isCorrect: false,
                    marksObtained: 0
                });

                continue;
            }

            const selectedOption =
                question.options.find(
                    option =>
                        option._id.toString() ===
                        submittedAnswer.selectedOptionId
                );

            if (!selectedOption) {
                return res.status(400).json({
                    message:
                        "Invalid option selected"
                });
            }

            const correctOption =
                question.options.find(
                    option =>
                        option.isCorrect === true
                );

            const isCorrect =
                correctOption &&
                selectedOption._id.toString() ===
                    correctOption._id.toString();

            if (isCorrect) {
                correctAnswers++;
                score += question.marks;
            } else {
                incorrectAnswers++;
            }

            answerDocuments.push({
                attempt: attempt._id,
                question: question._id,
                selectedOption:
                    selectedOption._id,
                isCorrect,
                marksObtained:
                    isCorrect
                        ? question.marks
                        : 0
            });
        }

        const percentage =
            attempt.totalMarks > 0
                ? (score / attempt.totalMarks) * 100
                : 0;

        const status =
            percentage >= quiz.passingScore
                ? "PASSED"
                : "FAILED";

        await Answer.insertMany(
            answerDocuments
        );

        attempt.score = score;

        attempt.percentage =
            Number(
                percentage.toFixed(2)
            );

        attempt.correctAnswers =
            correctAnswers;

        attempt.incorrectAnswers =
            incorrectAnswers;

        attempt.unanswered =
            unanswered;

        attempt.timeTaken =
            timeTaken;

        attempt.status =
            "SUBMITTED";

        attempt.completedAt =
            completedAt;

        await attempt.save();

        res.status(200).json({
            message:
                "Quiz submitted successfully",

            result: {
                attemptId:
                    attempt._id,

                score:
                    attempt.score,

                totalMarks:
                    attempt.totalMarks,

                percentage:
                    attempt.percentage,

                correctAnswers:
                    attempt.correctAnswers,

                incorrectAnswers:
                    attempt.incorrectAnswers,

                unanswered:
                    attempt.unanswered,

                timeTaken:
                    attempt.timeTaken,

                status
            }
        });

    } catch (error) {
        console.error(
            "Submit attempt error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while submitting quiz"
        });
    }
};


// ==========================================
// GET MY ATTEMPTS
// ==========================================

const getMyAttempts = async (req, res) => {
    try {

        const attempts = await Attempt.find({
            user: req.user.userId
        })
            .populate(
                "quiz",
                "title description difficulty passingScore duration maxAttempts"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            count: attempts.length,
            attempts
        });

    } catch (error) {

        console.error(
            "Get attempts error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching attempts"
        });
    }
};


// ==========================================
// GET SINGLE ATTEMPT
// ==========================================

const getAttemptById = async (req, res) => {
    try {

        const attempt =
            await Attempt.findById(
                req.params.id
            )
                .populate(
                    "quiz",
                    "title description difficulty passingScore duration maxAttempts"
                )
                .populate(
                    "user",
                    "name email"
                );

        if (!attempt) {
            return res.status(404).json({
                message:
                    "Attempt not found"
            });
        }

        // ==========================================
        // STUDENT OWNERSHIP CHECK
        // ==========================================

        if (
            req.user.role === "STUDENT" &&
            attempt.user._id.toString() !==
                String(req.user.userId)
        ) {
            return res.status(403).json({
                message:
                    "Access denied"
            });
        }

        const answers =
            await Answer.find({
                attempt:
                    attempt._id
            }).populate(
                "question",
                "questionText options explanation marks difficulty"
            );

        const safeAnswers =
            answers.map(
                answer => {

                    const question =
                        answer.question;

                    const safeOptions =
                        question.options.map(
                            option => ({
                                _id:
                                    option._id,

                                optionText:
                                    option.optionText
                            })
                        );

                    return {
                        _id:
                            answer._id,

                        question: {
                            _id:
                                question._id,

                            questionText:
                                question.questionText,

                            options:
                                safeOptions,

                            explanation:
                                question.explanation,

                            marks:
                                question.marks,

                            difficulty:
                                question.difficulty
                        },

                        selectedOption:
                            answer.selectedOption,

                        isCorrect:
                            answer.isCorrect,

                        marksObtained:
                            answer.marksObtained
                    };
                }
            );

        res.status(200).json({
            message:
                "Attempt details fetched successfully",

            result: {

                attemptId:
                    attempt._id,

                quiz:
                    attempt.quiz,

                user:
                    attempt.user,

                score:
                    attempt.score,

                totalMarks:
                    attempt.totalMarks,

                percentage:
                    attempt.percentage,

                correctAnswers:
                    attempt.correctAnswers,

                incorrectAnswers:
                    attempt.incorrectAnswers,

                unanswered:
                    attempt.unanswered,

                timeTaken:
                    attempt.timeTaken,

                status:
                    attempt.status,

                startedAt:
                    attempt.startedAt,

                completedAt:
                    attempt.completedAt,

                answers:
                    safeAnswers
            }
        });

    } catch (error) {

        console.error(
            "Get attempt error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching attempt"
        });
    }
};


// ==========================================
// GET ALL ATTEMPTS - ADMIN ONLY
// ==========================================

const getAllAttempts = async (req, res) => {
    try {

        const attempts =
            await Attempt.find()
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "quiz",
                    "title difficulty passingScore"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            count:
                attempts.length,

            attempts
        });

    } catch (error) {

        console.error(
            "Get all attempts error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching attempts"
        });
    }
};


// ==========================================
// GET QUIZ ANALYTICS - ADMIN ONLY
// ==========================================

const getQuizAnalytics = async (req, res) => {
    try {

        const { quizId } =
            req.params;

        const quiz =
            await Quiz.findById(
                quizId
            );

        if (!quiz) {
            return res.status(404).json({
                message:
                    "Quiz not found"
            });
        }

        const attempts =
            await Attempt.find({
                quiz: quizId,
                status: "SUBMITTED"
            });

        const totalAttempts =
            attempts.length;

        if (totalAttempts === 0) {

            return res.status(200).json({

                message:
                    "Quiz analytics fetched successfully",

                analytics: {

                    quiz: {
                        id:
                            quiz._id,

                        title:
                            quiz.title,

                        difficulty:
                            quiz.difficulty
                    },

                    totalAttempts: 0,
                    passed: 0,
                    failed: 0,
                    averageScore: 0,
                    averagePercentage: 0,
                    highestScore: 0,
                    lowestScore: 0
                }
            });
        }

        const passed =
            attempts.filter(
                attempt =>
                    attempt.percentage >=
                    quiz.passingScore
            ).length;

        const failed =
            totalAttempts -
            passed;

        const totalScore =
            attempts.reduce(
                (sum, attempt) =>
                    sum + attempt.score,
                0
            );

        const averageScore =
            totalScore /
            totalAttempts;

        const totalPercentage =
            attempts.reduce(
                (sum, attempt) =>
                    sum + attempt.percentage,
                0
            );

        const averagePercentage =
            totalPercentage /
            totalAttempts;

        const scores =
            attempts.map(
                attempt =>
                    attempt.score
            );

        const highestScore =
            Math.max(...scores);

        const lowestScore =
            Math.min(...scores);

        res.status(200).json({

            message:
                "Quiz analytics fetched successfully",

            analytics: {

                quiz: {

                    id:
                        quiz._id,

                    title:
                        quiz.title,

                    difficulty:
                        quiz.difficulty
                },

                totalAttempts,

                passed,

                failed,

                averageScore:
                    Number(
                        averageScore.toFixed(2)
                    ),

                averagePercentage:
                    Number(
                        averagePercentage.toFixed(2)
                    ),

                highestScore,

                lowestScore
            }
        });

    } catch (error) {

        console.error(
            "Quiz analytics error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching quiz analytics"
        });
    }
};


// ==========================================
// GET STUDENT ATTEMPT DETAILS
// ==========================================

const getStudentAttemptDetails = async (
    req,
    res
) => {
    try {

        const { id } =
            req.params;

        const attempt =
            await Attempt.findById(id)
                .populate(
                    "quiz",
                    "title description difficulty duration passingScore maxAttempts status"
                );

        if (!attempt) {
            return res.status(404).json({
                message:
                    "Attempt not found"
            });
        }


        if (
            req.user.role === "STUDENT" &&
            attempt.user.toString() !==
                String(req.user.userId)
        ) {
            return res.status(403).json({
                message:
                    "Access denied"
            });
        }


        // ==========================================
        // CHECK QUIZ
        // ==========================================

        if (!attempt.quiz) {
            return res.status(404).json({
                message:
                    "Quiz not found"
            });
        }


        // ==========================================
        // CHECK ATTEMPT EXPIRY
        // ==========================================

        if (
            attempt.status ===
            "IN_PROGRESS"
        ) {

            const currentTime =
                new Date();

            const elapsedTime =
                Math.floor(
                    (
                        currentTime -
                        attempt.startedAt
                    ) / 1000
                );

            const durationInSeconds =
                attempt.quiz.duration *
                60;


            if (
                elapsedTime >=
                durationInSeconds
            ) {

                attempt.status =
                    "SUBMITTED";

                attempt.completedAt =
                    currentTime;

                attempt.timeTaken =
                    durationInSeconds;

                await attempt.save();

                return res.status(400).json({

                    message:
                        "Quiz time has expired. Attempt is no longer available.",

                    attemptId:
                        attempt._id,

                    status:
                        attempt.status,

                    timeTaken:
                        attempt.timeTaken
                });
            }
        }


        // ==========================================
        // GET QUIZ QUESTIONS
        // ==========================================

        const questions =
            await Question.find({
                quiz:
                    attempt.quiz._id
            }).select(
                "questionText options marks difficulty"
            );


        // ==========================================
        // REMOVE CORRECT ANSWERS
        // ==========================================

        const safeQuestions =
            questions.map(
                question => {

                    const safeOptions =
                        question.options.map(
                            option => ({
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


        // ==========================================
        // CALCULATE REMAINING TIME
        // ==========================================

        let remainingTime =
            null;

        if (
            attempt.status ===
            "IN_PROGRESS"
        ) {

            const currentTime =
                new Date();

            const elapsedTime =
                Math.floor(
                    (
                        currentTime -
                        attempt.startedAt
                    ) / 1000
                );

            const durationInSeconds =
                attempt.quiz.duration *
                60;

            remainingTime =
                Math.max(
                    durationInSeconds -
                    elapsedTime,
                    0
                );
        }


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(200).json({

            message:
                "Student attempt details fetched successfully",

            attempt: {

                id:
                    attempt._id,

                status:
                    attempt.status,

                startedAt:
                    attempt.startedAt,

                totalMarks:
                    attempt.totalMarks,

                remainingTime,

                quiz:
                    attempt.quiz
            },

            totalQuestions:
                safeQuestions.length,

            questions:
                safeQuestions
        });

    } catch (error) {

        console.error(
            "Get student attempt details error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching attempt details"
        });
    }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    startAttempt,
    submitAttempt,
    getMyAttempts,
    getAttemptById,
    getAllAttempts,
    getQuizAnalytics,
    getStudentAttemptDetails
};