import express from "express";
import {
  allAppChart,
  appointmentStats,
  availableTimes,
  bookAppointment,
  bookedTimes,
  currMonthChart,
  deleteAppointment,
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
router.delete("/delete/:appointmentId", deleteAppointment);
router.put("/update-status/:aid", statusChange);
router.get("/available-times/:eid/:date", availableTimes);
router.get("/booked-times/:eid/:date", bookedTimes);
router.get("/emp-app/:uid", getAllForEmployee);
//charts
router.get("/appointment-stats", appointmentStats);
router.get("/monthly-chart", monthlyChart);
router.get("/currMonth-chart", currMonthChart);
router.get("/emp-chart", allAppChart);

export default router;
