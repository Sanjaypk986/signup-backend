const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    // Get the data from req.body
    const data = req.body;

    // Check given email with database email
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return res.status(401).send("Unauthorized Access! Invalid email");
    }

    // Check password with database
    const passwordMatch = bcrypt.compareSync(data.password, user.password);

    if (passwordMatch) {
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_KEY
      );
      res.cookie("token", token, { httpOnly: true });
      res.send("Login success");
    } else {
      res.status(401).send("Unauthorized Access! Invalid password");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const verifyLogin = async (req, res) => {
  if (req.cookies.token) {
    try {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_KEY);
      console.log(payload);
      res.json({ verified: true });
    } catch (error) {
      res.status(401).send("Unauthoraized Access!");
    }
  } else {
    res.json({ verified: false });
  }
};

const logout = async (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  res.send("Logged Out");
};

module.exports = { login, verifyLogin, logout };
