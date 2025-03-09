import express from "express";
import {
  monthlySalesReport,
  salesReport,
} from "../controllers/reportsController.js";
const router = express.Router();

router.get("/sales", salesReport);
router.get("/monthly-sales", monthlySalesReport);
export default router;
