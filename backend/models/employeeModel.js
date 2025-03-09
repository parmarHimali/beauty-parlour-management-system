import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    required: false,
    default: "/images/user.jpg",
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
      date: { type: String, required: true },
      times: [
        {
          time: { type: String, required: true },
          serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          phone: { type: String, required: true },
        },
      ],
    },
  ],
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
