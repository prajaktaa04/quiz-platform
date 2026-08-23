const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
    {
        attempt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attempt",
            required: true
        },

        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true
        },

        selectedOption: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            default: null
        },

        isCorrect: {
            type: Boolean,
            default: false
        },

        marksObtained: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Answer", answerSchema);