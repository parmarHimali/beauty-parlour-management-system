import express from "express";
const router = express.Router();
import { uploadImage } from "./../middlewares/uploadImage.js";
import {
  addEmployee,
  deleteEmployee,
  employeeByService,
  getEmployees,
  getEmployeeSpeciality,
  photoChange,
  profile,
} from "../controllers/EmployeeController.js";
import { isAuthorized } from "../middlewares/auth.js";

router.post("/add", addEmployee);
router.get("/all", getEmployees);
router.get("/service/:sid", employeeByService);
router.get("/speciality/:uid", getEmployeeSpeciality);
router.delete("/delete/:eid", deleteEmployee);
router.get("/profile", isAuthorized, profile);
router.patch("/changePhoto", uploadImage, photoChange);

export default router;
