import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import userRoutes from "@/api/routes/user.route";
import paymentRoutes from "@/api/routes/payment.route";
import tradeRoutes from "@/api/routes/trade.route";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));
app.use(helmet());
// app.use(rateLimiter);

// Routes
app.use("/user", userRoutes);
app.use("/trades", tradeRoutes);
app.use("/payment", paymentRoutes);

// Swagger UI
// app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
