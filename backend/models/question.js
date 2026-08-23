const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
    {
        optionText: {
            type: String,
            required: true,
            trim: true
        },

        isCorrect: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: true
    }
);

const questionSchema = new mongoose.Schema(
    {
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true
        },

        questionText: {
            type: String,
            required: true,
            trim: true
        },

        options: {
            type: [optionSchema],
            required: true,
            validate: {
                validator: function (options) {
                    return options.length >= 2;
                },
                message: "A question must have at least 2 options."
            }
        },

        explanation: {
            type: String,
            trim: true
        },

        marks: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },

        difficulty: {
            type: String,
            enum: ["EASY", "MEDIUM", "HARD"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;