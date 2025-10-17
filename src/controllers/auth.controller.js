import { registerUser, loginUser } from "../services/auth.service.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const result = await registerUser(name, email, password);
    res.status(201).json({ message: "Signup successful", ...result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const result = await loginUser(email, password);
    res.status(200).json({ message: "Login successful", ...result });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
