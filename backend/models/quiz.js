const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        difficulty: {
            type: String,
            enum: ["EASY", "MEDIUM", "HARD"],
            required: true
        },

        duration: {
            type: Number,
            required: true,
            min: 1
        },

        passingScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },

        maxAttempts: {
            type: Number,
            required: true,
            min: 1
        },

        status: {
            type: String,
            enum: ["DRAFT", "PUBLISHED", "UNPUBLISHED"],
            default: "DRAFT"
        },

        thumbnail: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Quiz", quizSchema);