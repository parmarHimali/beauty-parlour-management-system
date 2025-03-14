import express from "express";
import { addReview, getTopReviews } from "../controllers/ReviewController.js";
const router = express.Router();

router.post("/add", addReview);
router.get("/top-review", getTopReviews);
export default router;
