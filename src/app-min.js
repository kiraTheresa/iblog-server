const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 根路由
app.get("/", (req, res) => {
  res.json({ message: "服务器运行正常" });
});

// 用户路由
app.use("/api/users", require("./routes/userRoutes"));

// 文章路由
app.use("/api/posts", require("./routes/postRoutes"));

// 评论路由
app.use("/api/comments", require("./routes/commentRoutes"));

// 404 处理
app.use((req, res) => {
  res.status(404).json({ message: "路由不存在" });
});

// 错误处理
app.use((error, req, res, next) => {
  res.status(500).json({ message: "服务器错误" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});