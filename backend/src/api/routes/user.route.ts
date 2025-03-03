import express from 'express'
import { continueWithGoogle, login, register, resendCode, verifyCode } from '../controllers/user.controller.js';
const router = express.Router();

// Define Routes
router.post("/register", register);
router.post("/verify-code", verifyCode);
router.post("/resend-code", resendCode);
router.post("/login", login);
router.post("/google", continueWithGoogle);

export default router;
