import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface ReqBody {
	name?: string;
	username?: string;
	password?: string;
	role?: string;
}

const userController = {
	getAllUsers: async (req: Request, res: Response) => {
		try {
			const users: User[] = await prisma.user.findMany({
				where: {
					deletedAt: null,
				},
			});
			res.status(200).json({
				success: true,
				data: users,
				message: "All users fetched successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	createUser: async (req: Request<{}, {}, ReqBody>, res: Response) => {
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

			const newUser: User = await prisma.user.create({ data: req.body });
			res.status(201).json({
				success: true,
				data: newUser,
				message: "User created successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	getUserById: async (req: Request, res: Response) => {
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
			res.status(200).json({
				success: true,
				data: user,
				message: "User fetched successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	updateUser: async (req: Request<{}, {}, ReqBody>, res: Response) => {
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

			const updatedUser: User = await prisma.user.update({
				where: { id: parseInt(req.params.id) },
				data: req.body,
			});
			res.status(200).json({
				success: true,
				data: updatedUser,
				message: "User updated successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	deleteUserSoft: async (req: Request, res: Response) => {
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

			const deletedUser: User = await prisma.user.update({
				where: { id: parseInt(req.params.id) },
				data: { deletedAt: new Date() },
			});
			res.status(200).json({
				success: true,
				message: "User soft deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

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
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},
};

export default userController;