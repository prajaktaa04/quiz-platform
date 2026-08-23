const Attempt = require("../models/attempt");

// ==========================================
// GET LEADERBOARD
// ==========================================

const getLeaderboard = async (req, res) => {
    try {

        // Get all submitted attempts
        const attempts = await Attempt.find({
            status: "SUBMITTED"
        })
            .populate(
                "user",
                "name email"
            )
            .populate(
                "quiz",
                "title passingScore"
            )
            .sort({
                percentage: -1,
                score: -1,
                completedAt: 1
            });


        // ==========================================
        // GROUP ATTEMPTS BY STUDENT
        // ==========================================

        const studentMap = new Map();


        attempts.forEach((attempt) => {

            if (!attempt.user) {
                return;
            }


            const userId =
                attempt.user._id.toString();


            if (!studentMap.has(userId)) {

                studentMap.set(
                    userId,
                    {
                        user: {
                            _id:
                                attempt.user._id,

                            name:
                                attempt.user.name,

                            email:
                                attempt.user.email
                        },

                        totalAttempts: 0,

                        bestScore: 0,

                        averagePercentage: 0,

                        totalPercentage: 0,

                        passed: 0
                    }
                );

            }


            const student =
                studentMap.get(userId);


            student.totalAttempts++;


            const percentage =
                Number(
                    attempt.percentage || 0
                );


            const score =
                Number(
                    attempt.score || 0
                );


            student.totalPercentage +=
                percentage;


            if (
                percentage >
                student.bestScore
            ) {

                student.bestScore =
                    percentage;

            }


            if (
                percentage >=
                Number(
                    attempt.quiz?.passingScore ||
                    0
                )
            ) {

                student.passed++;

            }

        });


        // ==========================================
        // CREATE LEADERBOARD
        // ==========================================

        let leaderboard =
            Array.from(
                studentMap.values()
            );


        leaderboard =
            leaderboard.map(
                (student) => {

                    return {

                        user:
                            student.user,

                        totalAttempts:
                            student.totalAttempts,

                        bestScore:
                            student.bestScore,

                        averagePercentage:
                            student.totalAttempts > 0
                                ? Number(
                                    (
                                        student.totalPercentage /
                                        student.totalAttempts
                                    ).toFixed(2)
                                )
                                : 0,

                        passed:
                            student.passed
                    };

                }
            );


        // ==========================================
        // SORT
        // ==========================================

        leaderboard.sort(
            (a, b) => {

                // First priority:
                // Best score

                if (
                    b.bestScore !==
                    a.bestScore
                ) {

                    return (
                        b.bestScore -
                        a.bestScore
                    );

                }


                // Second priority:
                // Average percentage

                if (
                    b.averagePercentage !==
                    a.averagePercentage
                ) {

                    return (
                        b.averagePercentage -
                        a.averagePercentage
                    );

                }


                // Third priority:
                // Number of attempts

                return (
                    b.totalAttempts -
                    a.totalAttempts
                );

            }
        );


        // ==========================================
        // ADD RANK
        // ==========================================

        leaderboard =
            leaderboard.map(
                (student, index) => ({

                    rank:
                        index + 1,

                    ...student

                })
            );


        // ==========================================
        // CURRENT USER RANK
        // ==========================================

        let currentUserRank = null;


        if (req.user?.userId) {

            const currentUser =
                leaderboard.find(
                    student =>
                        student.user._id.toString() ===
                        req.user.userId.toString()
                );


            if (currentUser) {

                currentUserRank =
                    currentUser.rank;

            }

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(200).json({

            message:
                "Leaderboard fetched successfully",

            count:
                leaderboard.length,

            currentUserRank,

            leaderboard

        });


    } catch (error) {

        console.error(
            "Get leaderboard error:",
            error.message
        );


        res.status(500).json({

            message:
                "Server error while fetching leaderboard"

        });

    }
};


module.exports = {
    getLeaderboard
};