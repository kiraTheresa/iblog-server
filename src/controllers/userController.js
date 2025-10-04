const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 注册
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 检查用户是否存在
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length > 0) return res.status(400).json({ message: "用户名已存在" });

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入数据库
    await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

    res.status(201).json({ message: "注册成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 登录
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 查找用户
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(400).json({ message: "用户不存在" });

    const user = rows[0];

    // 校验密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "密码错误" });

    // 生成 token
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "登录成功", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
};
