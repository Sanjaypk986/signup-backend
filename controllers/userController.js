const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const saltRounds = 10;

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error); // Pass error to centralized error handler
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error); // Pass error to centralized error handler
  }
};

const addUser = async (req, res, next) => {
  try {
    const { password, ...data } = req.body;
    const hash = await bcrypt.hash(password, saltRounds);
    const user = new User({ ...data, password: hash });
    await user.save();
    res.json(user);
  } catch (error) {
    next(error); // Pass error to centralized error handler
  }
};

const updateUser = async (req, res, next) => {
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
    next(error); // Pass error to centralized error handler
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error); // Pass error to centralized error handler
  }
};

module.exports = { getAllUsers, getUserById, addUser, updateUser, deleteUser };
