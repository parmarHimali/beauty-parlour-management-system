import express from "express";
import {
  deleteCustomer,
  getCustomers,
  getCustomerStatistics,
  getUser,
  login,
  logout,
  register,
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

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.get("/getCustomers", getCustomers);
router.delete("/delete/:custId", deleteCustomer);
router.get("/customer-stats", getCustomerStatistics);
export default router;
