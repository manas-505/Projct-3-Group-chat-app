const bcrypt = require("bcryptjs");
const User = require("../models/User");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) return res.send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.send("Signup error");
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { email: identifier },
          { phone: identifier },
        ],
      },
    });

    if (!user) return res.send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Invalid password");

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Login error");
  }
};
