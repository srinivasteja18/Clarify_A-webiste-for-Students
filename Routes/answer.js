const express = require("express");
const router = express.Router();

const { isAuthenticated, isSignedIn } = require("../Controllers/auth");
const { getUserById } = require("../Controllers/user");
const {
  answerQuestion,
  updateAnswer,
  getAnswerById,
  deleteAnswer,
  updateUpvotes,
  updateDownvotes,
} = require("../Controllers/answer");
const { getQuestionById } = require("../Controllers/question");

router.param("userId", getUserById);
router.param("questionId", getQuestionById);
router.param("answerId", getAnswerById);

router.post(
  "/questions/answer/:userId/:questionId",
  isSignedIn,
  isAuthenticated,
  answerQuestion
);

router.put(
  "/questions/answer/update/:userId/:answerId",
  isSignedIn,
  isAuthenticated,
  updateAnswer
);

router.put(
  "/questions/answer/upvote/:userId/:answerId",
  isSignedIn,
  isAuthenticated,
  updateUpvotes
);
router.put(
  "/questions/answer/downvote/:userId/:answerId",
  isSignedIn,
  isAuthenticated,
  updateDownvotes
);

router.delete(
  "/questions/answer/delete/:userId/:answerId",
  isSignedIn,
  isAuthenticated,
  deleteAnswer
);

module.exports = router;
