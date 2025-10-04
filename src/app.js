const express = require("express");
const cors = require("cors");
require("dotenv").config();

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
      login: "POST /api/users/login"
    }
  });
});

// 动态导入路由，便于捕获导入错误
let userRoutes;
try {
  userRoutes = require("./routes/userRoutes");
  app.use("/api/users", userRoutes);
  console.log("用户路由加载成功");
} catch (error) {
  console.error("路由加载失败:", error);
}

// 404 处理
app.use((req, res) => {
  res.status(404).json({ 
    message: "路由不存在",
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      "GET /",
      "POST /api/users/register", 
      "POST /api/users/login"
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
});