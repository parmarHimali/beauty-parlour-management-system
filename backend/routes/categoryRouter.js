import express from "express";
import {
  deleteCategory,
  getCategories,
  getCategory,
  postCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { uploadImage } from "./../middlewares/uploadImage.js";
const router = express.Router();

router.post("/create-category", uploadImage, postCategory);
router.get("/all-categories", getCategories);
router.put("/update/:cid", uploadImage, updateCategory);
router.delete("/delete/:cid", deleteCategory);
router.get("/:cid", getCategory);
export default router;
