import {Router} from "express";
import {
  createJob,
  deleteJob,
  filteredJobs,
  getJobs,
  updateJob,
} from "./Service/job.service.js";
import {authentication} from "../../MiddleWare/auth.js";
const router = Router();
router.post("/create/:companyId", authentication(), createJob);
router.patch("/update/:jobId", authentication(), updateJob);
router.delete("/delete/:jobId", authentication(), deleteJob);
router.get("/jobInfo", authentication(), getJobs);
router.get("/filterInfo", authentication(), filteredJobs);
export default router;
