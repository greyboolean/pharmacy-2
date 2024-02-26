import express, { Router } from "express";
import customerController from "../controllers/customerController";
import authController from "../controllers/authController";

const router: Router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Define routes for the root path '/'
router
	.route("/")
	.get(customerController.getAllCustomers)
	.post(
		authController.restrictTo("owner"),
		customerController.createCustomer
	);

// Define routes for the path with Customer ID '/:id'
router
	.route("/:id")
	.get(customerController.getCustomerById)
	.patch(
		authController.restrictTo("owner", "manager", "cashier"),
		customerController.updateCustomer
	);

// Define routes for soft and hard customer delete
router
	.route("/:id/soft")
	.delete(
		authController.restrictTo("owner", "manager"),
		customerController.deleteCustomerSoft
	);
router
	.route("/:id/hard")
	.delete(
		authController.restrictTo("owner"),
		customerController.deleteCustomerHard
	);

export default router;