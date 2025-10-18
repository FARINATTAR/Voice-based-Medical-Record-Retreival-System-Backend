// // import jwt from "jsonwebtoken";
// // import User from "../models/user.model.js";

// // export const protect = async (req, res, next) => {
// //   try {
// //     const token = req.headers.authorization?.split(" ")[1];
// //     if (!token) return res.status(401).json({ message: "Not logged in" });

// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     const currentUser = await User.findById(decoded.id);
// //     if (!currentUser) return res.status(401).json({ message: "User no longer exists" });

// //     req.user = currentUser;
// //     next();
// //   } catch (err) {
// //     res.status(401).json({ message: "Invalid token" });
// //   }
// // };

// import jwt from 'jsonwebtoken';

// // Auth middleware
// export const auth = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Role-based middleware
// export const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     next();
//   };
// };
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid/expired token', error: err.message });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
};
