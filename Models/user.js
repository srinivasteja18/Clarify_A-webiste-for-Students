const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v1: uuidv1 } = require("uuid");
const crypto = require("crypto");
const { ObjectId } = require("mongoose");

const followersSchema = Schema({
  user: {
    type: ObjectId,
    ref: "User",
  },
});

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    encry_password: {
      type: String,
      trim: true,
    },
    salt: String,
    collage: {
      type: String,
      trim: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    reputation: {
      type: Number,
      default: 0,
    },
    followers: [followersSchema],
    following: [followersSchema],
    qupvotes: [
      {
        question: {
          type: ObjectId,
          ref: "Question",
        },
      },
    ],
    aupvotes: [
      {
        answer: {
          type: ObjectId,
          ref: "Answer",
        },
      },
    ],
    qdownvotes: [{ question: { type: ObjectId, ref: "Question" } }],
    adownvotes: [
      {
        answer: {
          type: ObjectId,
          ref: "Answer",
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  securePassword: function (plainpassword) {
    if (!plainpassword) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      console.log("SECUREPASSWORD ERROR");
      return "";
    }
  },
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },
};

const User = mongoose.model("User", userSchema);
const Followers = mongoose.model("Followers", followersSchema);

module.exports = { User, Followers };
