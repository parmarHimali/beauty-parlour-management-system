import express from "express";
import {
  availableTimes,
  bookAppointment,
  bookedTimes,
  getAllForEmployee,
  getAppointments,
  getTodayAppointments,
  statusChange,
} from "../controllers/appointmentController.js";
const router = express.Router();

// router.get("/appointments/availableTimes", availableTimes);
router.post("/book-appointment", bookAppointment);
router.get("/all-appointments", getAppointments);
router.get("/today-appointments", getTodayAppointments);
router.put("/update-status/:aid", statusChange);
router.get("/available-times/:eid/:date", availableTimes);
router.get("/booked-times/:eid/:date", bookedTimes);
router.get("/emp-app/:uid", getAllForEmployee);

export default router;
