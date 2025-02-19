import express from "express";
import {
  appointmentStats,
  availableTimes,
  bookAppointment,
  bookedTimes,
  currMonthChart,
  getAllForEmployee,
  getAppointments,
  getTodayAppointments,
  monthlyChart,
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
//charts
router.get("/appointment-stats", appointmentStats);
router.get("/monthly-chart", monthlyChart);
router.get("/currMonth-chart", currMonthChart);
export default router;
