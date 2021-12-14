const { User } = require("../Models/user");
const Activity = require("../Models/activity");

exports.getUserById = (req, res, next, id) => {
  User.findById(id)
    .populate([
      "following",
      "followers",
      "followers.user",
      "following.user",
      {
        path: "followers.user",
        populate: { path: "user" },
      },
      {
        path: "following.user",
        populate: { path: "user" },
      },
    ])
    .exec((err, user) => {
      if (err || !user) {
        return res.status(404).json({
          error: "User not found!!",
        });
      }
      req.profile = user;
      next();
    });
};

exports.getFollowerById = (req, res, next, id) => {
  User.findById(id)
    .populate([
      "followers",
      "following",
      {
        path: "followers",
        populate: { path: "user" },
      },
      {
        path: "following",
        populate: { path: "user" },
      },
    ])
    .exec((err, user) => {
      if (err || !user) {
        return res.status(404).json({
          error: "User not found!!",
        });
      }
      req.follower = user;
      next();
    });
};

exports.getFollower = (req, res) => {
  req.follower.salt = undefined;
  req.follower.encry_password = undefined;
  req.follower.createdAt = undefined;
  req.follower.updatedAt = undefined;
  return res.json(req.follower);
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Update Failed!!",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

exports.getUserActivity = (req, res) => {
  Activity.find({ user: req.profile._id })
    .populate("question", "_id text upvotes description")
    .exec((err, activities) => {
      if (err) {
        return res.status(400).json({
          error: "No Activity found for this User",
        });
      }
      res.json(activities);
    });
};

exports.updateUserFollowers = (req, res) => {
  const user = req.profile;
  const newUser = req.follower;
  user.following.push(newUser);
  newUser.followers.push(user);
  user.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "following not saved!!",
      });
    }
    newUser.save((err, newUser) => {
      if (err) {
        return res.status(400).json({
          error: "Follower not saved",
        });
      }
      res.json(user);
    });
  });
};

exports.UnfollowUserFollowers = (req, res) => {
  const user = req.profile;
  const newUser = req.follower;
  const newFollowings = user.following.filter(
    (user) => !user._id.equals(req.follower._id)
  );
  const newFollowers = newUser.followers.filter(
    (follower) => !follower._id.equals(user._id)
  );
  user.following = newFollowings;
  newUser.followers = newFollowers;
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "following not saved!!",
      });
    }
    newUser.save((err, newUser) => {
      if (err) {
        return res.status(400).json({
          error: "Follower not saved",
        });
      }
      res.json(newUser);
    });
  });
};

exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: "No Users Found!!",
      });
    }
    res.json(users);
  });
};
