const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized Access! Invalid email" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'None' });
      res.json({ message: "Login success" });
    } else {
      res.status(401).json({ message: "Unauthorized Access! Invalid password" });
    }
  } catch (error) {
    next(error); // Pass error to centralized error handler
  }
};

const verifyLogin = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.json({ verified: false });
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);
    res.json({ verified: true });
  } catch (error) {
    next(error); // Pass error to centralized error handler
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'None' });
    res.json({ message: "Logged Out" });
  } catch (error) {
    next(error); // Pass error to centralized error handler
  }
};

module.exports = { login, verifyLogin, logout };
