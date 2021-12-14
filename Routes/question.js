const express = require("express");
const router = express.Router();

const { isAuthenticated, isSignedIn } = require("../Controllers/auth");
const {
  askQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionById,
  getAllQuestions,
  getQuestion,
  updateUpvotes,
  updateDownvotes,
} = require("../Controllers/question");

const { getUserById } = require("../Controllers/user");

router.param("userId", getUserById);
router.param("questionId", getQuestionById);

router.get("/questions", getAllQuestions);

router.post("/askQuestion/:userId", isSignedIn, isAuthenticated, askQuestion);

router.get("/questions/question/:questionId", getQuestion);

router.put(
  "/askQuestion/update/:userId/:questionId",
  isSignedIn,
  isAuthenticated,
  updateQuestion
);

router.put(
  "/question/upvote/:userId/:questionId",
  isSignedIn,
  isAuthenticated,
  updateUpvotes
);

router.put(
  "/question/downvote/:userId/:questionId",
  isSignedIn,
  isAuthenticated,
  updateDownvotes
);

router.delete(
  "/askQuestion/delete/:userId/:questionId",
  isSignedIn,
  isAuthenticated,
  deleteQuestion
);

module.exports = router;
