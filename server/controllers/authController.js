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

exports.signup = async (req, res) => {
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

  const exists = await User.findOne({ email });
  if (exists) throw httpError(409, "email already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken(user);
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
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
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};
