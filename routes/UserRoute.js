import express, { Router } from "express";
import User from "../models/userModel.js";
import {
  CreateUser,
  findById,
  GetAllUsers,
  upDateUsername,
  userLogin,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({ massage: "hello world" });
});

router.post("/create", CreateUser);
router.get("/get", GetAllUsers);
router.get("/:id", findById);
router.post("/login", userLogin);
router.patch("/:id", upDateUsername);

export default router;
