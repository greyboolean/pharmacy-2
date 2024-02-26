import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import authRouter from "./src/routes/authRouter";
import userRouter from "./src/routes/userRouter";
import medicineRouter from "./src/routes/medicineRouter";
import customerRouter from "./src/routes/customerRouter";

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/medicines", medicineRouter);
app.use("/api/v1/customers", customerRouter);

// Start the server
const port: string | number = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});