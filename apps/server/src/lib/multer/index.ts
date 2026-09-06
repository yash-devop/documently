import multer from "multer";
import { AppError } from "../../middlewares/error.middleware";

export const documentsUpload = multer({
  fileFilter: (req, file, cb) => {
    console.log("file", file);
    if (file.mimetype === "application/pdf") {
      cb(null, true); // Accept the file
    } else {
      cb(
        new AppError("Only PDF files are allowed!", 400, "INVALID") as any,
        false,
      ); // Reject the file
    }
  },
});
