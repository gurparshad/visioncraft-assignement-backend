const express = require("express");
const router = express.Router();
const UserService = require("./UserService");

router.post("/api/1.0/users", async (req, res) => {
  const user = req.body;
  if (user.firstName === null) {
    return res.status(400).send({
      validationErrors: {
        firstName: "firstName cannot be null",
      },
    });
  }
  await UserService.save(req.body);
  return res.send({ message: "user created" });
});

module.exports = router;
