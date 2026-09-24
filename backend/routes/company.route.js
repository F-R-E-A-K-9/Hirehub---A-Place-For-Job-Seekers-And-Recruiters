import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  registerCompany,
  getAllCompanies,
} from "../controllers/company.controller.js";

const router = express.Router();

router.route("/register").post(authenticateToken, registerCompany);
router.route("/get").get(authenticateToken, getAllCompanies);

export default router;
