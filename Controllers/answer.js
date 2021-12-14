const Activity = require("../Models/activity");
const Answer = require("../Models/answers");

exports.getAnswerById = (req, res, next, id) => {
  Answer.findById(id)
    .populate("user")
    .populate("question")
    .exec((err, answer) => {
      if (err) {
        return res.status(400).json({
          error: "Answer Not Found!!",
        });
      }
      req.answer = answer;
      next();
    });
};

exports.answerQuestion = (req, res) => {
  const activity = new Activity();
  const answer = new Answer(req.body);
  const question = req.question;
  answer.user = req.profile;
  answer.question = req.question;
  answer.save((err, answer) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "Answer Not saved!",
      });
    }
    question.replies.unshift(answer._id);
    question.save((err, question) => {
      if (err) {
        return res.status(400).json({
          error: "Question not updated with answer!!",
        });
      }
      activity.question = question;
      activity.status = "answered";
      activity.user = req.profile;
      activity.save((err, activity) => {
        if (err) {
          return res.status(400).json({
            error: "Activity not saved!!",
          });
        }
        res.json(answer);
      });
    });
  });
};

exports.updateAnswer = (req, res) => {
  const answer = req.answer;
  answer.text = req.body.text;
  answer.save((err, updatedanswer) => {
    if (err) {
      return res.status(400).json({
        error: "Answer Not saved!",
      });
    }
    res.json(updatedanswer);
  });
};

exports.deleteAnswer = (req, res) => {
  const answer = req.answer;
  answer.remove((err, deletedAnswer) => {
    if (err) {
      return res.status(400).json({
        error: "Deletion failed",
      });
    }
    const question = deletedAnswer.question;
    const replies = question.replies.filter(
      (reply) => !reply._id.equals(answer._id)
    );
    question.replies = replies;
    question.save((err, updatedQuestion) => {
      if (err) {
        return res.status(400).json({
          error: "Replies updation failed",
        });
      }
      res.json(deletedAnswer);
    });
  });
};

exports.updateUpvotes = (req, res) => {
  const user = req.profile;
  const answer = req.answer;
  let flag = false;
  if (user.aupvotes.length) {
    user.aupvotes.map((obj) => {
      if (flag) return;
      if (obj.answer._id.equals(answer._id)) {
        flag = true;
        return res.status(400).json({
          error: "You have already upvoted this Post",
        });
      }
    });
  }
  if (flag) return;
  let downvotes = [];
  if (user.adownvotes.length)
    downvotes = user.adownvotes.filter(
      (vote) => !vote.answer._id.equals(answer._id)
    );
  user.aupvotes.push({ answer: req.answer._id });
  user.adownvotes = downvotes;
  answer.upvotes = req.body.upvotes + 1;
  answer.save((err, updatedAnswer) => {
    if (err) {
      console.log(err);
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
        res.json(updatedAnswer);
      });
    }
  });
};

exports.updateDownvotes = (req, res) => {
  const user = req.profile;
  const answer = req.answer;
  let flag = false;
  if (user.adownvotes.length) {
    user.adownvotes.map((obj) => {
      if (flag) return;
      if (obj.answer._id.equals(answer._id)) {
        flag = true;
        return res.status(400).json({
          error: "You have already downvoted this Post",
        });
      }
    });
  }
  if (flag) return;
  let upvotes = [];
  if (user.qupvotes.length)
    upvotes = user.qupvotes.filter(
      (vote) => !vote.answer._id.equals(answer._id)
    );

  user.adownvotes.push({ answer: req.answer._id });
  user.aupvotes = upvotes;
  answer.upvotes = req.body.upvotes - 1;
  answer.save((err, updatedAnswer) => {
    if (err) {
      console.log(err);
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
        res.json(updatedAnswer);
      });
    }
  });
};
