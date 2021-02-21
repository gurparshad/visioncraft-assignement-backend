const express = require("express");
const router = express.Router();
const UserService = require("./UserService");
const { check, validationResult } = require("express-validator");

// user registration route
router.post(
  "/api/1.0/users/register",

  //  using express-validator for validation
  check("firstName")
    .notEmpty()
    .withMessage("firstName cannot be null")
    .bail()
    .isLength({ min: 4, max: 40 })
    .withMessage("Must have min 3 and max 40 characters"),

  check("lastName")
    .notEmpty()
    .withMessage("lastName cannot be null")
    .bail()
    .isLength({ min: 4, max: 40 })
    .withMessage("Must have min 3 and max 40 characters"),

  check("email")
    .notEmpty()
    .withMessage("email cannot be null")
    .bail()
    .isEmail()
    .withMessage("email not valid")
    .bail()
    .custom(async (email) => {
      const user = await UserService.findByEmail(email);
      if (user) {
        throw new Error("email already in use");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("password cannot be null")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must have atleast 8 characters")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage("password_pattern"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = {};
      errors
        .array()
        .forEach((error) => (validationErrors[error.param] = error.msg));
      return res.status(400).send({ validationErrors: validationErrors });
    }
    await UserService.save(req.body);
    return res.send({ message: "user created" });
  },
);

// user login route
router.post(
  "/api/1.0/users/login",

  check("email")
    .notEmpty()
    .withMessage("email cannot be null")
    .bail()
    .isEmail()
    .withMessage("email not valid"),

  check("password")
    .notEmpty()
    .withMessage("password cannot be null")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must have atleast 8 characters")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage("password_pattern"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = {};
      errors
        .array()
        .forEach((error) => (validationErrors[error.param] = error.msg));
      return res.status(400).send({ validationErrors: validationErrors });
    }
    const user = await UserService.findByEmail(req.body.email);
    if (!user) {
      return res.status(400).send({ message: "invalid user" });
    }
    return res.status(200).send({ message: "login Success" });
  },
);

module.exports = router;
