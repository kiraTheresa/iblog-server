const express = require("express");
const { createPost, getPosts, getPostById, updatePost, deletePost } = require("../controllers/postController");

const router = express.Router();

router.post("/", createPost);       // 新建文章
router.get("/", getPosts);          // 获取全部文章
router.get("/:id", getPostById);    // 获取单篇文章
router.put("/:id", updatePost);     // 修改文章
router.delete("/:id", deletePost);  // 删除文章

module.exports = router;
