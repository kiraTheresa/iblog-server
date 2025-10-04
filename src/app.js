const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// 根路由
app.get("/", (req, res) => {
  res.json({ 
    message: "服务器运行正常",
    endpoints: {
      register: "POST /api/users/register",
      login: "POST /api/users/login",
      posts: "GET/POST /api/posts",
      comments: "GET/POST /api/comments"
    }
  });
});

// 第一阶段：用户路由
let userRoutes;
try {
  userRoutes = require("./routes/userRoutes");
  app.use("/api/users", userRoutes);
  console.log("用户路由加载成功");
} catch (error) {
  console.error("用户路由加载失败:", error);
}

// 第二阶段：文章和评论路由
let postRoutes, commentRoutes;
try {
  postRoutes = require("./routes/postRoutes");
  app.use("/api/posts", postRoutes);
  console.log("文章路由加载成功");
} catch (error) {
  console.error("文章路由加载失败:", error);
}

try {
  commentRoutes = require("./routes/commentRoutes");
  app.use("/api/comments", commentRoutes);
  console.log("评论路由加载成功");
} catch (error) {
  console.error("评论路由加载失败:", error);
}

// 404 处理
app.use((req, res) => {
  res.status(404).json({ 
    message: "路由不存在",
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      "GET /",
      "POST /api/users/register", 
      "POST /api/users/login",
      "GET/POST /api/posts",
      "GET/POST /api/comments"
    ]
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error("服务器错误:", error);
  res.status(500).json({ message: "内部服务器错误" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`访问: http://localhost:${PORT}`);
  console.log("已加载路由:");
  console.log("  - /api/users");
  console.log("  - /api/posts"); 
  console.log("  - /api/comments");
});