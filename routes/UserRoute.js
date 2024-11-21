import express, { Router } from "express";
import User from "../models/userModel.js";
import {
  CreateUser,
  findById,
  GetAllUsers,
  updatePasswordById,
  upDateUsernameById,
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
router.patch("/update-Username/:id", upDateUsernameById);
router.patch("/update-password/:id", updatePasswordById);

export default router;
