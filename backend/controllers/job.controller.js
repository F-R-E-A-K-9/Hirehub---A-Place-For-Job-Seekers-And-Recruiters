import { Job } from "../models/job.model.js";

// Recruiter job post karta hai
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id; // isAuthenticated middleware se

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","), // "React,Node" -> ["React", "Node"]
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    res.status(201).json({
      message: "Job posted successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Sabke liye - saari jobs, keyword search ke saath (login zaroori nahi)
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Sabke liye - ek single job (login zaroori nahi)
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({ path: "applications" });

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Recruiter - sirf apni banayi hui jobs
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
    });

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};
