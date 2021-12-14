const express = require("express");
const router = express.Router();
const {
  getUserById,
  getUser,
  updateUser,
  getUserActivity,
  getFollowerById,
  updateUserFollowers,
  UnfollowUserFollowers,
  getAllUsers,
  getFollower,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserQuestions } = require("../Controllers/question");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

router.put("/user/update/:userId", isSignedIn, isAuthenticated, updateUser);

router.param("followerId", getFollowerById);

router.get("/users", getAllUsers);

router.get(
  "/users/questions/:userId",
  isSignedIn,
  isAuthenticated,
  getUserQuestions
);

router.get(
  "/user/activity/:userId",
  isSignedIn,
  isAuthenticated,
  getUserActivity
);

router.get(
  "/user/:userId/:followerId",
  isSignedIn,
  isAuthenticated,
  getFollower
);

router.put(
  "/users/follow/:userId/:followerId",
  isSignedIn,
  isAuthenticated,
  updateUserFollowers
);

router.put(
  "/users/unfollow/:userId/:followerId",
  isSignedIn,
  isAuthenticated,
  UnfollowUserFollowers
);

module.exports = router;
