import {Router} from "express";
import * as validators from "./user.validation.js";
import {authentication} from "../../MiddleWare/auth.js";
import {
  bannUser,
  deleteCover,
  deletePic,
  profile,
  softDelete,
  updatePassword,
  updateProfile,
  uploadCoverPic,
  uploadProfilePic,
} from "./Service/user.service.js";
import {
  fileValidations,
  uploadFile,
} from "../../Utilis/multer/cloudinary.multer.js";
import {validation} from "../../MiddleWare/validation.js";
const router = Router();
router.patch(
  "/update",
  authentication(),
  validation(validators.UpdateProfile),
  updateProfile
);
router.get("/profileData", authentication(), profile);
router.patch(
  "/password",
  authentication(),
  validation(validators.UpdatePassword),
  updatePassword
);
router.post(
  "/pic",
  authentication(),
  uploadFile(fileValidations.image).array("attachment", 1),
  validation(validators.ProfileImage),
  uploadProfilePic
);
router.post(
  "/cover",
  authentication(),
  uploadFile(fileValidations.image).array("attachment", 2),
  validation(validators.CoverImage),
  uploadCoverPic
);
router.patch("/delete/:picId", authentication(), deletePic);
router.patch("/delCover/:coverId", authentication(), deleteCover);
router.patch("/softdelete/:userId", authentication(), softDelete);
router.patch("/banned/:userId", authentication(), bannUser);
export default router;
