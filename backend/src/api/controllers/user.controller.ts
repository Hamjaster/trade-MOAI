import {
  generateCode,
  generateToken,
  hashPassword,
  sendEmail,
  verifyPassword,
} from "@/common/utils/services";
import User, { UserDocument } from "../models/user.model";
import userModel from "../models/user.model";

// Register Controller
export const register = async (req : any, res : any) => {
  try {
    const { firstName, lastName, email, password, nameOfSpace } = req.body;
    console.log(req.body, 'this is req.body')
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists.", data: null });
    }
    const hashedPassword = await hashPassword(password);
    const verificationCode = generateCode();
    const verificationExpires = Date.now() + 10 * 60 * 1000;
    console.log(hashPassword, verificationCode, 'password')
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      nameOfSpace,
      verificationCode,
      verificationExpires,
    });
    console.log(newUser, 'new user, USER')

    await newUser.save();

    await sendEmail(
      email,
      "Your verification code",
      `Your verification code is ${verificationCode}`
    );

    res
      .status(200)
      .json({ success: true, message: "User registered. Verification code sent to email.", data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", data: error.message });
  }
};

// Verify Code Controller
export const verifyCode = async (req : any, res : any) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found.", data: null });

    if (
      user.verificationCode !== code ||
      (user.verificationExpires && user.verificationExpires < Date.now())
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired verification code.", data: null });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "User verified successfully.", data: {user, token : await generateToken(user._id)} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", data: error });
  }
};

// Resend Code Controller
export const resendCode = async (req : any, res : any) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found.", data: null });

    const verificationCode = generateCode();
    user.verificationCode = verificationCode;
    user.verificationExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(
      email,
      "Your verification code",
      `Your verification code is ${verificationCode}`
    );

    res.status(200).json({ success: true, message: "New verification code sent.", data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", data: error });
  }
};

// Login Controller
export const login = async (req : any, res : any) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found.", data: null });

    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: "User not verified.", data: null });
    }

    const isMatch = await verifyPassword(password, user.password);
    
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials.", data: null });

    const token = await generateToken(user._id);

    res.status(200).json({ success: true, message: "Login successful.", data: { user, token } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", data: error });
  }
};

// Continue with Google
export const continueWithGoogle = async (req :any, res : any) => {
  const { firstName, lastName, nameOfSpace, email } = req.body 
  const isAlreadyPresent = await User.findOne({ email })
  if (isAlreadyPresent) {
      const user = isAlreadyPresent;
      res.status(200).json({
        success : true,
        data : {
          user,
          token : await generateToken(user._id)
        }
      })
  } else {

      const user = await User.create({
          firstName,
          lastName,
          nameOfSpace,
          email
      })

      res.json({
        success : true,
        data : {
          user,
          token : await generateToken(user._id)
        }
      })
  }
}

