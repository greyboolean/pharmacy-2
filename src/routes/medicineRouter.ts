import express, { Router } from "express";
import medicineController from "../controllers/medicineController";
import authController from "../controllers/authController";

const router: Router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Define routes for the root path '/'
router.route("/").get(medicineController.getAllMedicines).post(
	authController.restrictTo("owner"),
	medicineController.createMedicine
);

// Define routes for the path with Medicine ID '/:id'
router.route("/:id").get(medicineController.getMedicineById).patch(
	authController.restrictTo("owner", "manager", "cashier"),
	medicineController.updateMedicine
);

// Defie routes for soft and hard medicine delete
router.route("/:id/soft").delete(
	authController.restrictTo("owner", "manager"),
	medicineController.deleteMedicineSoft
);
router.route("/:id/hard").delete(
	authController.restrictTo("owner"),
	medicineController.deleteMedicineHard
);

export default router;
