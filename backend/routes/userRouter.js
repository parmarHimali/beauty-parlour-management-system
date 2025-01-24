import express from "express";
import {
  deleteCustomer,
  getCustomers,
  getCustomerStatistics,
  getUser,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import { isAuthorized } from "../middlewares/auth.js";
import { checkAdminRole } from "../middlewares/checkAdminRole.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/logout", isAuthorized, logout);
router.get("/getUser", isAuthorized, getUser);

router.get("/getCustomers", getCustomers);
router.delete("/delete/:custId", deleteCustomer);
router.get("/customer-stats", getCustomerStatistics);
export default router;
