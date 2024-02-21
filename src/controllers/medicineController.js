const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const medicineController = {
	getAllMedicines: async (req, res) => {
		try {
			const medicines = await prisma.medicine.findMany({
				where: {
					deletedAt: null,
				},
			});
			res.status(200).json({
				success: true,
				data: medicines,
				message: "All medicines fetched successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	createMedicine: async (req, res) => {
		try {
			const newMedicine = await prisma.medicine.create({
				data: req.body,
			});
			res.status(201).json({
				success: true,
				data: newMedicine,
				message: "Medicine created successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	getMedicineById: async (req, res) => {
		try {
			const medicine = await prisma.medicine.findUnique({
				where: { id: parseInt(req.params.id) },
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
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	updateMedicine: async (req, res) => {
		try {
			const medicine = await prisma.medicine.findUnique({
				where: { id: parseInt(req.params.id) },
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
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	deleteMedicineSoft: async (req, res) => {
		try {
			const medicine = await prisma.medicine.findUnique({
				where: { id: parseInt(req.params.id) },
			});
			if (!medicine) {
				return res.status(404).json({
					success: false,
					message: "Medicine not found",
				});
			}

			const deletedMedicine = await prisma.medicine.update({
				where: { id: parseInt(req.params.id) },
				data: { deletedAt: new Date() },
			});
			res.status(200).json({
				success: true,
				message: "Medicine soft deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	deleteMedicineHard: async (req, res) => {
		try {
			const medicine = await prisma.medicine.findUnique({
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
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},
};

module.exports = medicineController;
