import {Router} from "express";
import {
  approvedCompany,
  bannCompany,
  companyData,
  companyLogo,
  coverCompanyLogo,
  createCompany,
  deleteCompanyCoverLogo,
  deleteCompanyLogo,
  SoftDeleteCompany,
  specificCompany,
  updateCompany,
} from "./service/company.service.js";
import * as validators from "../Company/company.validation.js";
import {authentication} from "../../MiddleWare/auth.js";
import {
  fileValidations,
  uploadFile,
} from "../../Utilis/multer/cloudinary.multer.js";
import {validation} from "../../MiddleWare/validation.js";
const router = Router();
router.post(
  "/create",
  authentication(),
  validation(validators.CreateCompany),
  createCompany
);
router.patch("/update/:companyId", authentication(), updateCompany);
router.patch("/softDelete/:companyId", authentication(), SoftDeleteCompany);
router.get("/data/:companyId", authentication(), companyData);
router.get("/specific", authentication(), specificCompany);
router.post(
  "/logo/:companyId",
  authentication(),
  uploadFile(fileValidations.image).array("attachment", 1),
  companyLogo
);
router.post(
  "/cover/:companyId",
  authentication(),
  uploadFile(fileValidations.image).array("attachment", 2),
  coverCompanyLogo
);
router.patch("/deleteLogo/:logoId", authentication(), deleteCompanyLogo);
router.patch(
  "/deleteCoverLogo/:logoId",
  authentication(),
  deleteCompanyCoverLogo
);
router.patch("/banned/:companyId", authentication(), bannCompany);
router.patch("/approve/:companyId", authentication(), approvedCompany);
export default router;
