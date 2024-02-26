import { PrismaClient } from "@prisma/client";
import { ErrorRequestHandler, Request, Response } from "express";

const prisma = new PrismaClient();

interface Customer {
	id: number;
	name: string;
	email: string;
	address: string;
	phoneNumber: string;
}

// Controller functions for customer routes
const customerController = {
	// GET all customers
	getAllCustomers: async (req: Request, res: Response) => {
		try {
			const customers: Customer[] = await prisma.customer.findMany({
				where: {
					deletedAt: null,
				},
				select: {
					id: true,
					name: true,
					email: true,
					address: true,
					phoneNumber: true,
				},
			});
			res.status(200).json({
				success: true,
				data: customers,
				message: "All customers fetched successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// CREATE a new customer
	createCustomer: async (req: Request, res: Response) => {
		try {
			const newCustomer: Customer = await prisma.customer.create({
				data: req.body,
				select: {
					id: true,
					name: true,
					email: true,
					address: true,
					phoneNumber: true,
				},
			});
			res.status(201).json({
				success: true,
				data: newCustomer,
				message: "Customer created successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// GET a single customer by id
	getCustomerById: async (req: Request, res: Response) => {
		try {
			const customer: Customer | null = await prisma.customer.findUnique({
				where: { id: parseInt(req.params.id), deletedAt: null },
				select: {
					id: true,
					name: true,
					email: true,
					address: true,
					phoneNumber: true,
				},
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
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// UPDATE an existing customer
	updateCustomer: async (req: Request, res: Response) => {
		try {
			const customer: Customer | null = await prisma.customer.findUnique({
				where: { id: parseInt(req.params.id), deletedAt: null },
			});
			if (!customer) {
				return res.status(404).json({
					success: false,
					message: "Customer not found",
				});
			}

			const updatedCustomer: Customer = await prisma.customer.update({
				where: { id: parseInt(req.params.id) },
				data: req.body,
				select: {
					id: true,
					name: true,
					email: true,
					address: true,
					phoneNumber: true,
				},
			});
			res.status(200).json({
				success: true,
				data: updatedCustomer,
				message: "Customer updated successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// Soft DELETE a customer
	deleteCustomerSoft: async (req: Request, res: Response) => {
		try {
			const customer: Customer | null = await prisma.customer.findUnique({
				where: { id: parseInt(req.params.id), deletedAt: null },
			});
			if (!customer) {
				return res.status(404).json({
					success: false,
					message: "Customer not found",
				});
			}

			const deletedCustomer: Customer = await prisma.customer.update({
				where: { id: parseInt(req.params.id) },
				data: { deletedAt: new Date() },
			});
			res.status(200).json({
				success: true,
				message: "Customer soft deleted successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// Hard DELETE a customer
	deleteCustomerHard: async (req: Request, res: Response) => {
		try {
			const customer: Customer | null = await prisma.customer.findUnique({
				where: { id: parseInt(req.params.id) },
			});
			if (!customer) {
				return res.status(404).json({
					success: false,
					message: "Customer not found",
				});
			}

			const deletedCustomer: Customer = await prisma.customer.delete({
				where: { id: parseInt(req.params.id) },
			});
			res.status(200).json({
				success: true,
				message: "Customer hard deleted successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},
};

export default customerController;
