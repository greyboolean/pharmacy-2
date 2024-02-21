const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const customerController = {
	getAllCustomers: async (req, res) => {
		try {
			const customers = await prisma.customer.findMany({
				where: {
					deletedAt: null,
				},
			});
			res.status(200).json({
				success: true,
				data: customers,
				message: "All customers fetched successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	createCustomer: async (req, res) => {
		try {
			const newCustomer = await prisma.customer.create({
				data: req.body,
			});
			res.status(201).json({
				success: true,
				data: newCustomer,
				message: "Customer created successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	getCustomerById: async (req, res) => {
		try {
			const customer = await prisma.customer.findUnique({
				where: { id: parseInt(req.params.id) },
			});
			if (!customer) {
				return res.status(404).json({
					success: false,
					message: "Customer not found",
				});
			}
			res.status(200).json({
				success: true,
				data: customer,
				message: "Customer fetched successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	updateCustomer: async (req, res) => {
		try {
			const customer = await prisma.customer.findUnique({
				where: { id: parseInt(req.params.id) },
			});
			if (!customer) {
				return res.status(404).json({
					success: false,
					message: "Customer not found",
				});
			}

			const updatedCustomer = await prisma.customer.update({
				where: { id: parseInt(req.params.id) },
				data: req.body,
			});
			res.status(200).json({
				success: true,
				data: updatedCustomer,
				message: "Customer updated successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	deleteCustomerSoft: async (req, res) => {
		try {
			const customer = await prisma.customer.findUnique({
				where: { id: parseInt(req.params.id) },
			});
			if (!customer) {
				return res.status(404).json({
					success: false,
					message: "Customer not found",
				});
			}

			const deletedCustomer = await prisma.customer.update({
				where: { id: parseInt(req.params.id) },
				data: { deletedAt: new Date() },
			});
			res.status(200).json({
				success: true,
				message: "Customer soft deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	deleteCustomerHard: async (req, res) => {
		try {
			const customer = await prisma.customer.findUnique({
				where: { id: parseInt(req.params.id) },
			});
			if (!customer) {
				return res.status(404).json({
					success: false,
					message: "Customer not found",
				});
			}

			const deletedCustomer = await prisma.customer.delete({
				where: { id: parseInt(req.params.id) },
			});
			res.status(200).json({
				success: true,
				message: "Customer hard deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},
};

module.exports = customerController;
