import express from "express";
import { CreatePaymentIntents } from "@/api/controllers/payment.controller";

const router = express.Router();

router.post("/create-payment-intents", CreatePaymentIntents);

export default router;
