import express from "express";
const router = express.Router();
import { uploadImage } from "./../middlewares/uploadImage.js";
import {
  addEmployee,
  calender,
  // allAppChart,
  deleteEmployee,
  empChart,
  employeeByService,
  getEmployees,
  getEmployeeSpeciality,
  profile,
  updateEmployeeImage,
} from "../controllers/EmployeeController.js";
import { isAuthorized } from "../middlewares/auth.js";

router.post("/add", addEmployee);
router.get("/all", getEmployees);
router.get("/service/:sid", employeeByService);
router.get("/speciality/:uid", getEmployeeSpeciality);
router.delete("/delete/:eid", deleteEmployee);
router.get("/profile", isAuthorized, profile);
router.get("/charts/:userId", empChart);
router.patch("/changePhoto/:id", uploadImage, updateEmployeeImage);
router.get("/calendar/:uid", calender);
// router.get("/app-chart", allAppChart);

export default router;
