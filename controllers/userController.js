const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).exec();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error finding user", error });
  }
};
const addUser = (req, res) => {
  // get data from body
  const data = req.body;
  // get password
  const password = data.password;
  // enrypt password
  const hash = bcrypt.hashSync(password, saltRounds);
  // create document using req.body, pass as object and change password from data
  //using spred operator to get all data and we want to write changable value and set that hash.
  const user = new User({
    ...data,
    password: hash,
  });
  // save user
  user.save();
  // send response
  res.json(user);
};
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};
const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.userId);
  res.send("user deleted");
};

module.exports = { getAllUsers, getUserById, addUser, updateUser, deleteUser };
