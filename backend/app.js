import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import serviceRouter from "./routes/ServiceRouter.js";
import reviewRouter from "./routes/ReviewRouter.js";
import employeeRouter from "./routes/employeeRouter.js";
import reportRouter from "./routes/reportRouter.js";
import appointmentsRouter from "./routes/appointmentRouter.js";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import path from "path";

const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);
// Serve images stored in the 'uploads' folder
app.use(
  "/uploads",
  express.static(
    path.join("C:/Users/HIMALI PARMAR/Desktop/beauty parlour/backend/uploads")
  )
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("public/images"));

app.use("/api/users", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/services", serviceRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/appointment", appointmentsRouter);
app.use("/api/reports", reportRouter);

dbConnection();
app.use(errorMiddleware);
export default app;
