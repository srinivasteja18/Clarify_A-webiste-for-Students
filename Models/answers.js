const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongoose");

const answerSchema = Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: ObjectId,
      ref: "Question",
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Answer", answerSchema);
