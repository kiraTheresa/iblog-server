const express = require("express");
const { createPost, updatePost, deletePost, getPosts, getPostById } = require("../controllers/postController");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

// 需要登录的路由
router.post("/", verifyToken, createPost);           // 创建文章
router.put("/:id", verifyToken, updatePost);         // 更新文章
router.delete("/:id", verifyToken, deletePost);      // 删除文章

// 公开路由（不需要登录）
router.get("/", getPosts);                           // 获取文章列表
router.get("/:id", getPostById);                     // 获取单篇文章

module.exports = router;