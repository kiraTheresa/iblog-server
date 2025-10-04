const pool = require("../config/db");

// 创建文章
exports.createPost = async (req, res) => {
  const { title, content, user_id } = req.body;

  try {
    await pool.query("INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)", 
                     [title, content, user_id]);
    res.status(201).json({ message: "文章发布成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 获取所有文章
exports.getPosts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
};

// 获取单篇文章
exports.getPostById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM posts WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "文章不存在" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
};

// 修改文章
exports.updatePost = async (req, res) => {
  const { title, content } = req.body;
  try {
    await pool.query("UPDATE posts SET title = ?, content = ? WHERE id = ?", [title, content, req.params.id]);
    res.json({ message: "文章更新成功" });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
};

// 删除文章
exports.deletePost = async (req, res) => {
  try {
    await pool.query("DELETE FROM posts WHERE id = ?", [req.params.id]);
    res.json({ message: "文章删除成功" });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
};
