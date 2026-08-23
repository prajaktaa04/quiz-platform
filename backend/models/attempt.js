const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
    {
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        score: {
            type: Number,
            default: 0,
            min: 0
        },

        totalMarks: {
            type: Number,
            required: true,
            min: 0
        },

        percentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        correctAnswers: {
            type: Number,
            default: 0,
            min: 0
        },

        incorrectAnswers: {
            type: Number,
            default: 0,
            min: 0
        },

        unanswered: {
            type: Number,
            default: 0,
            min: 0
        },

        timeTaken: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: ["IN_PROGRESS", "SUBMITTED"],
            default: "IN_PROGRESS"
        },

        startedAt: {
            type: Date,
            default: Date.now
        },

        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Attempt", attemptSchema);