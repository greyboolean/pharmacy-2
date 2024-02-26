import express, { Router } from "express";
import authController from "../controllers/authController";

const router: Router = express.Router();

router
// .post("/signup", authController.signup)
	.post("/login", authController.login)
	.post("/logout", authController.logout);

export default router;