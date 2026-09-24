import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Student job ke liye apply karta hai
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Invalid job id", success: false });
    }

    // check karo pehle se apply to nahi kiya
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // check karo job exist karti hai
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    // nayi application banao
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // job document ke applications array mein bhi is application ki id daal do
    job.applications.push(newApplication._id);
    await job.save();

    return res
      .status(201)
      .json({ message: "Application submitted", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Student - apni saari applied jobs dekhta hai
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: { path: "company" },
      });

    return res.status(200).json({ application: applications, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Recruiter - ek job ke saare applicants dekhta hai
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: { path: "applicant" },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Recruiter - applicant ka status accept/reject karta hai
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res
        .status(400)
        .json({ message: "status is required", success: false });
    }

    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found.", success: false });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res
      .status(200)
      .json({ message: "Application status updated", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
