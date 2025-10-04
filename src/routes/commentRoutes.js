const express = require("express");
const { addComment, getCommentsByPost } = require("../controllers/commentController");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

// 需要登录的路由
router.post("/", verifyToken, addComment);           // 添加评论

// 公开路由（不需要登录）
router.get("/:post_id", getCommentsByPost);          // 获取某篇文章的评论

module.exports = router;