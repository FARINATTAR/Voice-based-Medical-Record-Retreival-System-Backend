import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered");

  const newUser = await User.create({ name, email, password });
  const token = signToken(newUser._id);

  return { token, user: { id: newUser._id, name: newUser.name, email: newUser.email } };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password))) {
    throw new Error("Invalid email or password");
  }

  const token = signToken(user._id);
  return { token, user: { id: user._id, name: user.name, email: user.email } };
};
