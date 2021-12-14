const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signin, signup, signout } = require("../Controllers/auth");

router.post(
  "/signup",
  [
    check("password", "Password must be min 5 chars").isLength({ min: 5 }),
    check("name", "name must be min 5 chars").isLength({ min: 5 }),
    check("email", "Enter valid Email ID").isEmail(),
  ],
  signup
);
router.post(
  "/signin",
  [
    check("password", "Password must be min 5 chars").isLength({ min: 5 }),
    check("email", "Enter valid Email ID").isEmail(),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
