import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface Medicine {
	id: number;
	name: string;
	description: string;
	quantity: number;
}

// Controller functions for medicine routes
const medicineController = {
	// GET all medicines
	getAllMedicines: async (req: Request, res: Response) => {
		try {
			const medicines: Medicine[] = await prisma.medicine.findMany({
				where: {
					deletedAt: null,
				},
				select: {
					id: true,
					name: true,
					description: true,
					quantity: true,
				},
			});
			res.status(200).json({
				success: true,
				data: medicines,
				message: "All medicines fetched successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// CREATE a new medicine
	createMedicine: async (req: Request, res: Response) => {
		try {
			const newMedicine: Medicine = await prisma.medicine.create({
				data: req.body,
			});
			res.status(201).json({
				success: true,
				data: newMedicine,
				message: "Medicine created successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// GET a single medicine by id
	getMedicineById: async (req: Request, res: Response) => {
		try {
			const medicine: Medicine | null = await prisma.medicine.findUnique({
				where: { id: parseInt(req.params.id), deletedAt: null },
				select: {
					id: true,
					name: true,
					description: true,
					quantity: true,
				},
			});
			if (!medicine) {
				return res.status(404).json({
					success: false,
					message: "Medicine not found",
				});
			}
			res.status(200).json({
				success: true,
				data: medicine,
				message: "Medicine fetched successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// UPDATE an existing medicine
	updateMedicine: async (req: Request, res: Response) => {
		try {
			const medicine: Medicine | null = await prisma.medicine.findUnique({
				where: { id: parseInt(req.params.id), deletedAt: null },
			});
			if (!medicine) {
				return res.status(404).json({
					success: false,
					message: "Medicine not found",
				});
			}

			const updatedMedicine = await prisma.medicine.update({
				where: { id: parseInt(req.params.id) },
				data: req.body,
			});
			res.status(200).json({
				success: true,
				data: updatedMedicine,
				message: "Medicine updated successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// Soft DELETE a medicine
	deleteMedicineSoft: async (req: Request, res: Response) => {
		try {
			const medicine: Medicine | null = await prisma.medicine.findUnique({
				where: { id: parseInt(req.params.id), deletedAt: null },
			});
			if (!medicine) {
				return res.status(404).json({
					success: false,
					message: "Medicine not found",
				});
			}

			const deletedMedicine: Medicine = await prisma.medicine.update({
				where: { id: parseInt(req.params.id) },
				data: { deletedAt: new Date() },
			});
			res.status(200).json({
				success: true,
				message: "Medicine soft deleted successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// Hard DELETE a medicine
	deleteMedicineHard: async (req: Request, res: Response) => {
		try {
			const medicine: Medicine | null = await prisma.medicine.findUnique({
				where: { id: parseInt(req.params.id) },
			});
			if (!medicine) {
				return res.status(404).json({
					success: false,
					message: "Medicine not found",
				});
			}

			const deletedMedicine = await prisma.medicine.delete({
				where: { id: parseInt(req.params.id) },
			});
			res.status(200).json({
				success: true,
				message: "Medicine hard deleted successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},
};

export default medicineController;