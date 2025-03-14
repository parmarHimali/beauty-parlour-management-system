import express from "express";
import {
  addService,
  addToGallery,
  deleteService,
  fetchService,
  fetchServices,
  getAllService,
  getMostRequestedServices,
  getRecentServices,
  updateService,
} from "../controllers/ServiceController.js";
import { uploadImage } from "../middlewares/uploadImage.js";
import { isAuthorized } from "./../middlewares/auth.js";
const router = express.Router();

router.get("/s-detail/:sid", fetchService);
router.post("/", uploadImage, addService);
router.get("/most-req", getMostRequestedServices);
router.get("/all-service", getAllService);
router.get("/recent-services", getRecentServices);
router.post("/upload-gallery/:sid", isAuthorized, uploadImage, addToGallery);
router.delete("/dlt-service/:sid", deleteService);
router.put("/update/:sid", uploadImage, updateService);
router.get("/:cid", fetchServices);

export default router;
