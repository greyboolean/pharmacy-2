import { Request } from "express";
import { User as PrismaUser } from "@prisma/client";

type User= Omit<PrismaUser, "password" | "deletedAt">;

declare module "express" {
	export interface Request {
		user?: User;
	}
}
