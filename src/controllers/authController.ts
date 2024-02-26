import { PrismaClient, Role } from "@prisma/client";
import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface Request extends ExpressRequest {
	user?: User;
}

interface User {
	id: number;
	name: string;
	username: string;
	password?: string;
	role: Role;
}

interface TokenOptions {
	expires: Date;
	httpOnly: boolean;
}

const generateToken = (
	user: User
): { token: string; options: TokenOptions } => {
	// Generate jwt token
	const token: string = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	// Define options for cookie
	const options: TokenOptions = {
		expires: new Date(
			Date.now() +
				Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	// Return token and options
	return { token, options };
};

const authController = {
	// Login
	login: async (req: Request, res: Response) => {
		try {
			// Get user input
			const { username, password } = req.body;
			if (!username || !password) {
				return res.status(400).json({
					success: false,
					message: "Username and password are required",
				});
			}

			// Find the user in the database
			const user: User | null = await prisma.user.findUnique({
				where: { username },
				select: {
					id: true,
					name: true,
					username: true,
					password: true,
					role: true,
				},
			});

			// Compare passwords
			const isPasswordValid =
				user &&
				user.password &&
				(await bcrypt.compare(password, user.password));

			// Remove password from user object
			if (user) {
				delete user.password;
			}

			if (!user || !isPasswordValid) {
				return res.status(401).json({
					success: false,
					message: "Invalid username or password",
				});
			}

			// Generate JWT token
			const { token, options } = generateToken(user);

			// Set cookie
			res.cookie("jwt", token, options);

			// Return the token
			res.status(200).json({
				success: true,
				token,
				data: user,
				message: "User logged in successfully",
			});
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// Logout
	logout: (req: Request, res: Response) => {
		// Remove cookie
		res.cookie("jwt", "", { maxAge: 1, httpOnly: true });

		// Return success message
		res.status(200).json({
			success: true,
			message: "User logged out successfully",
		});
	},

	// Protect route
	protect: async (req: Request, res: Response, next: NextFunction) => {
		try {
			let token;
			// Get token from request header
			if (
				req.headers.authorization &&
				req.headers.authorization.startsWith("Bearer")
			) {
				token = req.headers.authorization.split(" ")[1];
				// Get token from cookie if not in header
			} else if (req.cookies && req.cookies.jwt) {
				token = req.cookies.jwt;
			}

			// Check if token does not exist
			if (!token) {
				return res.status(401).json({
					success: false,
					message: "You are not logged in",
				});
			}

			// Verify token
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET!
			) as JwtPayload;

			// Find user by id
			const user: User | null = await prisma.user.findUnique({
				where: { id: decoded.id },
				select: {
					id: true,
					name: true,
					username: true,
					role: true,
				},
			});

			// Check if user exists
			if (!user) {
				return res.status(404).json({
					success: false,
					message: "No user found with this id",
				});
			}

			// Set user to request object
			req.user = user;

			next();
		} catch (error: unknown) {
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},

	// Restrict route to certain roles
	restrictTo: (...roles: string[]) => {
		return (req: Request, res: Response, next: NextFunction) => {
			// Check if user role is included in roles
			if (!req.user || !roles.includes(req.user.role)) {
				return res.status(403).json({
					success: false,
					message: "You are not authorized to access this route",
				});
			}

			next();
		};
	},
};

export default authController;
