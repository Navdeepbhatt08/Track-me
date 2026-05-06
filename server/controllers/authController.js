const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw httpError(500, "JWT_SECRET is missing in .env");

  return jwt.sign({ email: user.email, name: user.name }, secret, {
    subject: String(user._id),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

exports.signup = async (req, res) => {
  console.log("Signup request received:", { name: req.body.name, email: req.body.email });
  
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password || "");

  if (!name) throw httpError(400, "name is required");
  if (!email || !email.includes("@"))
    throw httpError(400, "valid email is required");
  if (!password || password.length < 6)
    throw httpError(400, "password must be at least 6 characters");

  try {
    const exists = await User.findOne({ email });
    if (exists) throw httpError(409, "email already exists");

    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Creating user in database...");
    
    const user = await User.create({ name, email, passwordHash });
    console.log("User created successfully:", { id: user._id, email: user.email });

    const token = signToken(user);
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Signup database error:", err.message);
    throw err;
  }
};

exports.login = async (req, res) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password)
    throw httpError(400, "email and password are required");

  const user = await User.findOne({ email });
  if (!user) throw httpError(401, "invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw httpError(401, "invalid credentials");

  const token = signToken(user);
  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({
    user: { id: user._id, name: user.name, email: user.email },
  });
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.logout = async (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ ok: true });
};
