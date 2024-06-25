const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

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
        const token = jwt.sign({_id:user._id, email:user.email }, process.env.JWT_TOKEN);
        res.cookie('token',token,{httpOnly:true})
        res.send("Login success");
    } else {
      res.status(401).send("Unauthorized Access! Invalid password");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = login;
