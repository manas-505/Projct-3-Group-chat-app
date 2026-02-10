const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// SIGNUP API
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { phone }] },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful",
      token: generateToken(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN API
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // res.json({
    //   message: "Login successful",
    //   token: generateToken(user),
    // });
    res.json({
  message: "Login successful",
  token: generateToken(user),
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getUserByEmail = async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne({
    where: { email },
    attributes: ["id", "name", "email"],
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "name", "email"],
  });

  res.json(users);
};
