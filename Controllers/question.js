const Question = require("../Models/questions");
const Activity = require("../Models/activity");
const Answer = require("../Models/answers");

exports.getQuestionById = (req, res, next, Id) => {
  Question.findById(Id)
    .populate([
      "replies",
      "user",
      {
        path: "replies",
        populate: { path: "user" },
      },
    ])
    .exec((err, question) => {
      if (err) {
        return res.status(400).json({
          error: "No question found with this Id",
        });
      } else {
        req.question = question;
        next();
      }
    });
};

exports.getQuestion = (req, res) => {
  return res.json(req.question);
};

exports.askQuestion = (req, res) => {
  console.log(req.body);
  const question = new Question(req.body);
  const activity = new Activity();
  question.user = req.profile;
  question.save((err, question) => {
    if (err) {
      return res.status(400).json({
        error: "Something went Wrong",
      });
    }
    activity.question = question;
    activity.status = "asked";
    activity.user = req.profile;
    activity.save((err, activity) => {
      if (err) {
        return res.status(400).json({
          error: "Activity not saved",
        });
      }
    });
    res.json(question);
  });
};

exports.getUserQuestions = (req, res) => {
  Question.find({ user: req.profile }).exec((err, question) => {
    if (err) {
      return res.status(400).json({
        error: "No questions Found",
      });
    }
    res.json(question);
  });
};

exports.updateQuestion = (req, res) => {
  if (req.profile._id !== req.question.user._id) {
    return res.status(400).json({
      error: "You cannot Edit this question",
    });
  }
  const question = req.question;
  question.text = req.body.text;
  question.description = req.body.description;
  question.upvotes = req.body.upvotes;
  question.save((err, updatedQuestion) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "Failed to update question",
      });
    }
    res.json(updatedQuestion);
  });
};

exports.deleteQuestion = (req, res) => {
  if (req.profile._id !== req.question.user._id) {
    return res.status(400).json({
      error: "You cannot delete this question",
    });
  }
  const question = req.question;
  question.remove((err, question) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "Failed to delete this question",
      });
    }
    res.json({
      message: `question is succesfully deleted`,
    });
  });
};

exports.getAllQuestions = (req, res) => {
  Question.find()
    .sort({ createdAt: "desc" })
    .populate("user", "_id name")
    .exec((err, questions) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: "No Questions found",
        });
      }
      res.json(questions);
    });
};

exports.updateUpvotes = (req, res) => {
  const user = req.profile;
  const question = req.question;
  let flag = false;
  if (user.qupvotes.length) {
    user.qupvotes.map((obj) => {
      if (obj.question._id.equals(question._id)) {
        flag = true;
        return res.status(400).json({
          error: "You have already upvotes this Post",
        });
      }
    });
  }
  if (flag) return;
  let downvotes = [];
  if (user.qdownvotes.length)
    downvotes = user.qdownvotes.filter(
      (vote) => !vote.question._id.equals(question._id)
    );
  user.qupvotes.push({ question: req.question._id });
  user.qdownvotes = downvotes;
  question.upvotes = req.body.upvotes + 1;
  question.save((err, updatedQuestion) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update upvotes",
      });
    } else {
      user.save((err, updatedUser) => {
        if (err) {
          return res.status(400).json({
            error: "Failed to update User",
          });
        }
        res.json(updatedQuestion);
      });
    }
  });
};

exports.updateDownvotes = (req, res) => {
  const user = req.profile;
  const question = req.question;
  if (user.qdownvotes.length) {
    user.qdownvotes.map((obj) => {
      // console.log(obj.question._id, question._id);
      if (obj.question._id.equals(question._id)) {
        return res.status(400).json({
          error: "You have already downvoted this Post",
        });
      }
    });
  }
  let upvotes = [];
  if (user.qupvotes.length)
    upvotes = user.qupvotes.filter(
      (vote) => !vote.question._id.equals(question._id)
    );

  user.qdownvotes.push({ question: req.question._id });
  user.qupvotes = upvotes;
  question.upvotes = req.body.upvotes - 1;
  question.save((err, updatedQuestion) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update upvotes",
      });
    } else {
      user.save((err, updatedUser) => {
        if (err) {
          return res.status(400).json({
            error: "Failed to update User",
          });
        }
        res.json(updatedQuestion);
      });
    }
  });
};
