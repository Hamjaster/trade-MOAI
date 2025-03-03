import express from 'express'
import { continueWithGoogle, login, register, resendCode, verifyCode } from '../controllers/user.controller';
import {  getHistoricalData, getTrades, getTradesSummary, saveJournalEntry, uploadCSVBulk } from '../controllers/trade.controller';
import multer from "multer";
import { verifyUser } from '@/common/middleware/auth.middleware';
import { getTradeAnalytics, getTradesPerMonth, getTradesPerDay, getWinRatePercentage } from '../controllers/trade.controller';

const router = express.Router();
// Multer configuration
const upload = multer({ dest: "uploads/" });

// Define Routes
router.post("/upload-bulk", verifyUser, upload.single("file"), uploadCSVBulk);
router.get("/get",verifyUser, getTrades);
router.post("/journal/:id",verifyUser, saveJournalEntry);
router.post("/getHistoricData",verifyUser, getHistoricalData);

// Route to get overall analytics
router.get('/analytics', getTradeAnalytics);
router.get('/analytics/trades-per-month', getTradesPerMonth);
router.get('/analytics/trades-per-day', getTradesPerDay);
router.get('/analytics/win-rate', getWinRatePercentage);
router.get('/calendar', verifyUser,  getTradesSummary);


export default router;
