const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer xxx"
  if (!token) return res.status(401).json({ message: "缺少token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (error) {
    return res.status(401).json({ message: "token无效或已过期" });
  }
};
