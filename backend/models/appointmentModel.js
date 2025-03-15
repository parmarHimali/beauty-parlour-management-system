import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  userId: {
    // New field to store reference to the customer (User)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  customerName: {
    type: String,
    // required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
  },
  time: {
    type: String, // Format: HH:mm
    required: true,
  },
  applyDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    default: "Pending",
  },
  priceAtBooking: {
    type: Number,
    required: true, // Stores the price at the time of booking
  },
  discountApplied: {
    type: Number,
    default: 0, // Stores the discount applied at booking
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
