import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Config } from "../utils/envConfig";
import User from "../../api/models/user.model.js";

export const verifyUser =async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  console.log(req.headers, )
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token, 'token')
  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Access denied", data: null });
  }
  try {
    const decoded = jwt.verify(token, Config.JWT_SECRET!);
    console.log(decoded,'decodedd..')
    const userFound = await User.findById(decoded.sub)
    req.user = userFound;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid token", data: null });
  }
};
