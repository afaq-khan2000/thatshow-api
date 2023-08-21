const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(201).json({ message: "User doesn't exist" });
    const existingPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!existingPassword)
      return res.status(201).json({ message: "Invalid password" });
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "360d" }
    );
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const userData = { ...req.body };
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser)
      return res
        .status(201)
        .json({ message: "User with this email already exists!" });
    else {
      let salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
      const user = await User.create(userData);
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "360d",
        }
      );
      res.status(200).json({ token: token });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    var user = await User.getById(req.token.id);
    if (!user) return res.json({ error: "User is not registered" });
    res.status(200).json({ user: user });
  } catch (e) {
    res.json({ error: e.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  const user = req.body;
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(201).json({ message: "Email already exists." });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...user, password: hashPassword });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const user = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with  that id");
  const updateUser = await User.findByIdAndUpdate(id, user, { new: true });
  res.status(200).json(updateUser);
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");
  await User.findByIdAndRemove(id);
  res.status(200).json({ message: "User deleted successfully" });
};
