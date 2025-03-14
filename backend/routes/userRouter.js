import express from "express";
import {
  allCountList,
  deleteCustomer,
  forgotPassword,
  getCustomers,
  getCustomerStatistics,
  getUser,
  login,
  logout,
  register,
  resetPassword,
  sendOtp,
  verifyOtp,
} from "../controllers/userController.js";
import { isAuthorized } from "../middlewares/auth.js";
import { checkAdminRole } from "../middlewares/checkAdminRole.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/logout", isAuthorized, logout);
router.get("/getUser", isAuthorized, getUser);

router.get("/count-list", allCountList);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/getCustomers", getCustomers);
router.delete("/delete/:custId", deleteCustomer);
router.get("/customer-stats", getCustomerStatistics);
export default router;
