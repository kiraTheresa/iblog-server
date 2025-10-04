const express = require("express");
const { addComment, getCommentsByPost } = require("../controllers/commentController");

const router = express.Router();

router.post("/", addComment);                // 添加评论
router.get("/:post_id", getCommentsByPost);  // 获取某篇文章的评论

module.exports = router;
