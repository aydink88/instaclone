const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const Post = require("../models/post");
const User = require("../models/user");

router.get("/user/:id", requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const posts = await Post.find({ postedBy: req.params.id })
      .populate("postedBy", "_id name")
      .exec();
    res.json({ user, posts });
  } catch (err) {
    return res.status(422).json({ error: err });
  }
});

router.put("/follow", requireLogin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.user._id } },
      { new: true }
    );
    const follower = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.body.followId } },
      { new: true }
    ).select("-password");
    res.json(follower);
  } catch (error) {
    return res.status(422).json({ error });
  }
});

router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.unfollowId,
      { $pull: { followers: req.user._id } },
      { new: true }
    );
    const result = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.body.unfollowId } },
      { new: true }
    ).select("-password");
    res.json(result);
  } catch (error) {
    return res.status(422).json({ error });
  }
});

router.put("/updatepic", requireLogin, async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { pic: req.body.pic } },
      { new: true }
    );
    res.json(result);
  } catch (error) {
    return res.status(422).json({ error });
  }
});

router.post("/search-users", async (req, res) => {
  try {
    let userPattern = new RegExp("^" + req.body.query);
    const user = await User.find({ email: { $regex: userPattern } }).select("_id email");
    res.json({ user });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
