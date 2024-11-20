import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const CreateUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const exitingUser = await User.findOne({ username });
    if (exitingUser) {
      return res.status(400).send("user already exists");
    }
    const user = new User(req.body)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    user.password = hashedPassword
    await user.save();
    res.status(201).send("User created")
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const GetAllUsers = async (req, res) => {
  try {
    const getAllUser = await User.find({} ,{password:0});
    res.status(200).send(getAllUser);
  } catch {
    res.status(500).send({ message: "err User not found" });
  }
};

export const findById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.massage });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(401).send("please provide username and password");
    }
    const user = await User.findOne({ username });
    if (!user) return res.status(401).send("username dose not exist");
    const isCorrectPassword = await bcrypt.compare(password, user.password)
    if (!isCorrectPassword) {
      return res.status(401).send("invalid password");
    }
    res.status(200).send("logged in successfully");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
