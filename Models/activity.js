const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongoose");

const activitySchema = Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    question: {
      type: ObjectId,
      ref: "Question",
    },
    status: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
