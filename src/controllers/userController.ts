import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from "express";
import hashPassword from "../utils/hashPassword";

const prisma = new PrismaClient();

interface User {
	id: number;
	name: string;
	username: string;
	role: Role;
}

// Controller functions for user routes
const userController = {
	// GET all users
	getAllUsers: async (req: Request, res: Response) => {
		try {
			const users: User[] = await prisma.user.findMany({
				where: {
					deletedAt: null,
				},
				select: {
					id: true,
					name: true,
					username: true,
					role: true,
				},
			});
			res.status(200).json({
				success: true,
				data: users,
				message: "All users fetched successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// CREATE a new user
	createUser: async (req: Request, res: Response) => {
		try {
			const { name, username, password, role } = req.body;

			if (!name || !username || !password || !role) {
				return res.status(400).json({
					success: false,
					message: "Name, username, password, and role are required",
				});
			}

			const existingUser: User | null = await prisma.user.findUnique({
				where: { username },
			});
			if (existingUser) {
				return res.status(409).json({
					success: false,
					message: "Username already exists",
				});
			}

			// Hash the password
			const hashedPassword: string = await hashPassword(password);

			const newUser: User = await prisma.user.create({
				data: {
					...req.body,
					password: hashedPassword,
				},
				select: {
					id: true,
					name: true,
					username: true,
					role: true,
				},
			});
			res.status(201).json({
				success: true,
				data: newUser,
				message: "User created successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// GET a single user by id
	getUserById: async (req: Request, res: Response) => {
		try {
			const user: User | null = await prisma.user.findUnique({
				where: { id: parseInt(req.params.id), deletedAt: null },
				select: {
					id: true,
					name: true,
					username: true,
					role: true,
				},
			});
			if (!user) {
				return res.status(404).json({
					success: false,
					message: "User not found",
				});
			}
			res.status(200).json({
				success: true,
				data: user,
				message: "User fetched successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// UPDATE an existing user
	updateUser: async (req: Request, res: Response) => {
		try {
			const user: User | null = await prisma.user.findUnique({
				where: { id: parseInt(req.params.id), deletedAt: null },
			});
			if (!user) {
				return res.status(404).json({
					success: false,
					message: "User not found",
				});
			}

			let data = req.body;

			// Hash the password if it is being updated
			if (req.body.password) {
				const hashedPassword: string = await hashPassword(
					req.body.password
				);
				data = { ...req.body, password: hashedPassword };
			}

			const updatedUser: User = await prisma.user.update({
				where: { id: parseInt(req.params.id) },
				data: data,
				select: {
					id: true,
					name: true,
					username: true,
					role: true,
				},
			});
			res.status(200).json({
				success: true,
				data: updatedUser,
				message: "User updated successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// Soft DELETE a user
	deleteUserSoft: async (req: Request, res: Response) => {
		try {
			const user: User | null = await prisma.user.findUnique({
				where: { id: parseInt(req.params.id), deletedAt: null },
			});
			if (!user) {
				return res.status(404).json({
					success: false,
					message: "User not found",
				});
			}

			const deletedUser: User = await prisma.user.update({
				where: { id: parseInt(req.params.id) },
				data: { deletedAt: new Date() },
			});
			res.status(200).json({
				success: true,
				message: "User soft deleted successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// Hard DELETE a user
	deleteUserHard: async (req: Request, res: Response) => {
		try {
			const user: User | null = await prisma.user.findUnique({
				where: { id: parseInt(req.params.id) },
			});
			if (!user) {
				return res.status(404).json({
					success: false,
					message: "User not found",
				});
			}

			const deletedUser: User = await prisma.user.delete({
				where: { id: parseInt(req.params.id) },
			});
			res.status(200).json({
				success: true,
				message: "User hard deleted successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},
};

export default userController;
