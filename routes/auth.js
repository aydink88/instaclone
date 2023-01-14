const express = require("express");
const router = express.Router();
const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
// const requireLogin = require('../middleware/requireLogin');
const nodemailer = require("nodemailer");
const { EMAIL } = require("../config/keys");
//

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0fc058d69f4509",
    pass: "09a98a09b2def9",
  },
});

router.post("/signup", async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  try {
    const savedUser = await User.findOne({ email });
    if (savedUser) {
      return res.status(422).json({ error: "user already exists with that email" });
    }
    const hashedpassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedpassword,
      name,
      pic,
    });
    await user.save();
    res.json({ message: "saved successfully" });
  } catch (error) {
    res.status(500).send({ error: "request failed" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  try {
    const savedUser = await User.findOne({ email });
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email or password" });
    }
    const doMatch = await bcrypt.compare(password, savedUser.password);
    if (doMatch) {
      // res.json({message:"successfully signed in"})
      const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
      const { _id, name, email, followers, following, pic } = savedUser;
      res.json({
        token,
        user: { _id, name, email, followers, following, pic },
      });
    } else {
      return res.status(422).json({ error: "Invalid Email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "request failed" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const buffer = await crypto.randomBytes(32);
    const token = buffer.toString("hex");
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(422).json({ error: "User dont exists with that email" });
    }
    user.resetToken = token;
    user.expireToken = Date.now() + 3600000;
    await user.save();
    transporter.sendMail({
      to: user.email,
      from: "no-replay@insta.com",
      subject: "password reset",
      html: `
                 <p>You requested for password reset</p>
                 <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                 `,
    });
    res.json({ message: "check your email" });
  } catch (error) {
    res.status(500).send({ error: "Request failed" });
  }
});

router.post("/new-password", async (req, res) => {
  try {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    const user = await User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } });
    if (!user) {
      return res.status(422).json({ error: "Try again session expired" });
    }
    const hashedpassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedpassword;
    user.resetToken = undefined;
    user.expireToken = undefined;
    await user.save();
    res.json({ message: "password updated success" });
  } catch (error) {
    res.status(500).json({ error: "Request failed" });
  }
});

module.exports = router;
