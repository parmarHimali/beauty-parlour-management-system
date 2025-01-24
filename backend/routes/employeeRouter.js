import express from "express";
const router = express.Router();
import {
  addEmployee,
  deleteEmployee,
  employeeByService,
  getEmployees,
} from "../controllers/EmployeeController.js";

router.post("/add", addEmployee);
router.get("/all", getEmployees);
router.get("/service/:sid", employeeByService);
router.delete("/delete/:eid", deleteEmployee);

export default router;
