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
import { validateUser } from "../middleware/validateUser.js";
import { validateJWT } from "../middleware/jwtMiddleware.js";

const router = express.Router();


router.post("/create", CreateUser);
router.get("/get",validateJWT, validateUser, GetAllUsers);
router.get("/:id", findById);
router.post("/login", userLogin);
router.patch("/update-Username/:id",validateJWT, upDateUsernameById);
router.patch("/update-password/:id",validateJWT, updatePasswordById);


export default router;
