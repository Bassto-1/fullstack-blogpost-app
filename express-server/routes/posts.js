const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      user: req.userId,
    });
    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find({

      user: req.userId,
    });

    res.json({
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get posts",
      error: error.message,
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get post",
      error: error.message,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
        title,
        content,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    });
  }
});

module.exports = router;

//POST      /api/posts      - create a post
//GET       /api/posts      - get your posts

//GET:id    /api/posts/:id   - read one
//PUT       /api/posts/:id   - update
//DELETE    /api/posts/:id   - delete


