const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const Post = require("../models/post");

router.get("/allpost", requireLogin, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt");
    res.json({ posts });
  } catch (error) {
    console.log(error);
  }
});

router.get("/getsubpost", requireLogin, async (req, res) => {
  // if postedBy in following
  try {
    const posts = await Post.find({ postedBy: { $in: req.user.following } })
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt");
    res.json({ posts });
  } catch (error) {
    console.log(error);
  }
});

router.post("/createpost", requireLogin, async (req, res) => {
  try {
    const { title, body, pic } = req.body;
    if (!title || !body || !pic) {
      return res.status(422).json({ error: "Plase add all the fields" });
    }
    req.user.password = undefined;
    const post = new Post({
      title,
      body,
      photo: pic,
      postedBy: req.user,
    });
    await post.save();
    res.json({ post });
  } catch (error) {
    console.log(error);
  }
});

router.get("/mypost", requireLogin, async (req, res) => {
  try {
    const mypost = await Post.find({ postedBy: req.user._id }).populate("postedBy", "_id name");
    res.json({ mypost });
  } catch (error) {
    console.log(error);
  }
});

router.put("/like", requireLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    if (post.likes.includes(req.user._id)) {
      throw new Error("You already liked the post");
    }

    post.likes.push(req.user._id);
    await post.save();
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: err });
  }
});

router.put("/unlike", requireLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);

    const userLikeIndex = post.likes.findIndex(
      (item) => item._id.toString() === req.user._id.toString()
    );
    if (userLikeIndex === -1) {
      throw new Error("Like not found");
    }
    post.likes.splice(userLikeIndex, 1);

    await post.save();
    console.log(post.likes);
    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: err.message });
  }

  // Post.findByIdAndUpdate(
  //   req.body.postId,
  //   {
  //     $pull: { likes: req.user._id },
  //   },
  //   {
  //     new: true,
  //   }
  // ).exec((err, result) => {
  //   if (err) {
  //     return res.status(422).json({ error: err })
  //   } else {
  //     res.json(result)
  //   }
  // })
});

router.put("/comment", requireLogin, async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id,
    };

    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name");
    return res.json(result);
  } catch (error) {
    return res.status(422).json({ error });
  }
});

router.delete("/deletepost/:postId", requireLogin, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId }).populate("postedBy", "_id");
    if (post.postedBy._id.toString() === req.user._id.toString()) {
      const result = await post.remove();
      res.json(result);
    } else {
      res.status(422).json({ error: "Removing post failed" });
    }
  } catch (error) {
    return res.status(422).json({ error });
  }
});

module.exports = router;
