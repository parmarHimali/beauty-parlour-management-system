import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  speciality: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }], // Array of service IDs
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  bookedTimes: [
    {
      date: String,
      times: [String],
    },
  ],
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
