import multer from "multer";
import path from "path";

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${
      file.originalname
    }`; // Create unique filename
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max file size of 2MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // Allow file upload
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

export const uploadImage = upload.single("image"); // Use this in routes for single image upload

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Set up storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const { type } = req.body; // Get the type (employee, service, category) from the request body

//     // Define base upload path
//     let uploadPath = "uploads";

//     // Determine the folder based on the type
//     if (type === "employee") {
//       uploadPath = path.join(uploadPath, "employees"); // Store in "uploads/employees"
//     } else if (type === "service") {
//       uploadPath = path.join(uploadPath, "services"); // Store in "uploads/services"
//     } else if (type === "category") {
//       uploadPath = path.join(uploadPath, "categories"); // Store in "uploads/categories"
//     } else {
//       return cb(
//         new Error(
//           "Invalid type. Valid types are 'employee', 'service', or 'category'."
//         )
//       );
//     }

//     // Ensure the folder exists
//     fs.mkdirSync(uploadPath, { recursive: true });

//     cb(null, uploadPath); // Use the determined folder as the upload destination
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`; // Generate a unique filename
//     cb(null, filename);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 2 * 1024 * 1024 }, // Max file size of 2MB
//   fileFilter: (req, file, cb) => {
//     const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
//     if (allowedMimes.includes(file.mimetype)) {
//       cb(null, true); // Allow file upload
//     } else {
//       cb(new Error("Only image files are allowed!"));
//     }
//   },
// });

// // Export the middleware for single image upload
// export const uploadImage = upload.single("image");
