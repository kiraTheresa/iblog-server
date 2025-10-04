const pool = require("../config/db");

// 添加评论
exports.addComment = async (req, res) => {
  const { content, user_id, post_id } = req.body;

  try {
    await pool.query("INSERT INTO comments (content, user_id, post_id) VALUES (?, ?, ?)", 
                     [content, user_id, post_id]);
    res.status(201).json({ message: "评论成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 获取某篇文章的评论
exports.getCommentsByPost = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE post_id = ? ORDER BY c.created_at DESC",
      [req.params.post_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
};
