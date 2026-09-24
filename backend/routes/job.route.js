import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(authenticateToken, postJob);
router.route("/get").get(getAllJobs); // public - no middleware
router.route("/getadminjobs").get(authenticateToken, getAdminJobs);
router.route("/get/:id").get(getJobById); // public - no middleware

export default router;
