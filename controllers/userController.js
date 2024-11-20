import User from "../models/userModel.js";

export const CreateUser = async (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(201).send("User Created");
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

export const GetAllUsers = async (req, res) => {
  try {
    const getAllUser = await User.find();
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
