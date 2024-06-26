import express, { Router } from "express";
import userController from "../controllers/userController";
import authController from "../controllers/authController";

const router: Router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);
// Restrict all routes after this middleware to admin only
router.use(authController.restrictTo("owner"));

// Define routes for the root path '/'
router
	.route("/")
	.get(userController.getAllUsers)
	.post(userController.createUser);

// Define routes for the path with User ID '/:id'
router
	.route("/:id")
	.get(userController.getUserById)
	.patch(userController.updateUser);

// Define routes for soft and hard user delete
router.route("/:id/soft").delete(userController.deleteUserSoft);
router.route("/:id/hard").delete(userController.deleteUserHard);

export default router;