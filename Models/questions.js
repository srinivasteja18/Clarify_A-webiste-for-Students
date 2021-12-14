const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongoose");

const questionSchema = Schema(
  {
    text: {
      type: String,
      required: true,
      maxLength: 1000,
      trim: true,
    },
    description: {
      type: String,
      maxLength: 5000,
      trim: true,
    },
    upvotes: {
      type: Number,
      trim: true,
      default: 0,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    replies: [{ type: ObjectId, ref: "Answer" }],
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
