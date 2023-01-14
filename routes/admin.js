const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/getusers", async (req, res) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
