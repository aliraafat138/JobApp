import {Router} from "express";
import {authentication} from "../../MiddleWare/auth.js";
import {
  fileValidations,
  uploadFile,
} from "../../Utilis/multer/cloudinary.multer.js";
import {
  applicantStatus,
  createApplication,
  getApplication,
  uploadCv,
} from "./Service/application.service.js";
const router = Router();
router.post("/create/:jobId", authentication(), createApplication);
router.post(
  "/cv/:appId",
  authentication(),
  uploadFile(fileValidations.document).array("attachment", 1),
  uploadCv
);
router.get("/apps/:jobId", authentication(), getApplication);
router.patch("/status/:appId", authentication(), applicantStatus);
export default router;
