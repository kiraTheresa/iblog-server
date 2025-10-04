const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

// 环境变量配置
require("dotenv").config({ path: path.join(__dirname, '.env') });

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 自定义请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// 根路由
app.get("/", (req, res) => {
  res.json({ 
    message: "服务器运行正常",
    timestamp: new Date().toISOString(),
    endpoints: {
      register: "POST /api/users/register",
      login: "POST /api/users/login",
      posts: "GET/POST /api/posts",
      comments: "GET/POST /api/comments"
    }
  });
});

// 健康检查端点
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 路由加载函数
const loadRoutes = (routePath, routeName) => {
  try {
    const routes = require(routePath);
    return routes;
  } catch (error) {
    console.error(`${routeName}路由加载失败:`, error.message);
    return null;
  }
};

// 路由配置
const routes = [
  { path: "./routes/userRoutes", name: "用户", basePath: "/api/users" },
  { path: "./routes/postRoutes", name: "文章", basePath: "/api/posts" },
  { path: "./routes/commentRoutes", name: "评论", basePath: "/api/comments" }
];

// 动态加载路由
routes.forEach(route => {
  const routeModule = loadRoutes(route.path, route.name);
  if (routeModule) {
    app.use(route.basePath, routeModule);
    console.log(`✅ ${route.name}路由加载成功`);
  } else {
    console.warn(`⚠️  ${route.name}路由未加载`);
    
    // 为未加载的路由提供基础响应
    app.use(route.basePath, (req, res) => {
      res.status(503).json({ 
        message: `${route.name}功能暂不可用`,
        error: "路由模块加载失败"
      });
    });
  }
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ 
    message: "路由不存在",
    requestedUrl: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      "GET /",
      "GET /health",
      "POST /api/users/register", 
      "POST /api/users/login",
      "GET/POST /api/posts",
      "GET/POST /api/comments"
    ]
  });
});

// 统一错误处理中间件
app.use((error, req, res, next) => {
  console.error("服务器错误:", {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  // 生产环境不返回错误堆栈
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(error.status || 500).json({
    message: "内部服务器错误",
    ...(isProduction ? {} : { error: error.message })
  });
});

// 未捕获异常处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
});

// 服务器启动
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 服务器运行在端口 ${PORT}
📍 访问地址: http://localhost:${PORT}
📊 环境: ${process.env.NODE_ENV || 'development'}
⏰ 启动时间: ${new Date().toISOString()}

✅ 已加载路由:
  - /api/users
  - /api/posts
  - /api/comments
  - /health (健康检查)
`);
});

// 优雅关闭
const gracefulShutdown = () => {
  console.log('\n🛑 收到关闭信号，正在优雅关闭服务器...');
  
  server.close((err) => {
    if (err) {
      console.error('关闭服务器时发生错误:', err);
      process.exit(1);
    }
    
    console.log('✅ 服务器已成功关闭');
    process.exit(0);
  });
  
  // 如果10秒后仍未关闭，强制退出
  setTimeout(() => {
    console.error('⏰ 强制关闭服务器');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;