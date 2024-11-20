import express from "express";
import User from "../models/userModel.js";
import { CreateUser } from "../controllers/userController.js";
import { GetAllUsers } from "../controllers/userController.js";
import { findById } from "../controllers/userController.js";
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({ massage: "hello world" });
});

router.post("/create", CreateUser);
router.get("/get", GetAllUsers);
router.get("/:id", findById);

export default router;
