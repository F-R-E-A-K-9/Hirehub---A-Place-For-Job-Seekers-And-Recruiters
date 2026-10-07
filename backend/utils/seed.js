import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";

dotenv.config();

const jobsData = [
  { title: "Frontend Developer", description: "Build responsive UIs using React and Tailwind.", requirements: "React,JavaScript,CSS", salary: 8, location: "Bangalore", jobType: "Full-time", experienceLevel: 2, position: 3 },
  { title: "Backend Developer", description: "Design and maintain REST APIs using Node and Express.", requirements: "Node,Express,MongoDB", salary: 10, location: "Bangalore", jobType: "Full-time", experienceLevel: 3, position: 2 },
  { title: "Full Stack Developer", description: "Work across the stack on a fast-moving product team.", requirements: "React,Node,MongoDB", salary: 12, location: "Remote", jobType: "Full-time", experienceLevel: 3, position: 2 },
  { title: "UI/UX Designer", description: "Design clean, usable interfaces for web and mobile.", requirements: "Figma,Prototyping", salary: 7, location: "Mumbai", jobType: "Full-time", experienceLevel: 1, position: 1 },
  { title: "DevOps Engineer", description: "Manage CI/CD pipelines and cloud infrastructure.", requirements: "AWS,Docker,Kubernetes", salary: 14, location: "Pune", jobType: "Full-time", experienceLevel: 4, position: 1 },
  { title: "Data Analyst", description: "Analyze product data and build dashboards.", requirements: "SQL,Python,Excel", salary: 6, location: "Hyderabad", jobType: "Full-time", experienceLevel: 1, position: 2 },
  { title: "Product Manager", description: "Own the roadmap for a core product area.", requirements: "Communication,Strategy", salary: 18, location: "Bangalore", jobType: "Full-time", experienceLevel: 5, position: 1 },
  { title: "QA Engineer", description: "Write automated tests and ensure release quality.", requirements: "Selenium,Cypress", salary: 6, location: "Chennai", jobType: "Full-time", experienceLevel: 2, position: 2 },
  { title: "Android Developer", description: "Build and maintain our Android app in Kotlin.", requirements: "Kotlin,Android SDK", salary: 9, location: "Delhi", jobType: "Full-time", experienceLevel: 2, position: 1 },
  { title: "Marketing Intern", description: "Support social media and content campaigns.", requirements: "Content Writing,SEO", salary: 3, location: "Remote", jobType: "Internship", experienceLevel: 0, position: 3 },
  { title: "Machine Learning Engineer", description: "Build and deploy ML models for recommendations.", requirements: "Python,TensorFlow", salary: 16, location: "Bangalore", jobType: "Full-time", experienceLevel: 3, position: 1 },
  { title: "Technical Writer", description: "Write clear docs for developers using our API.", requirements: "Writing,Markdown", salary: 5, location: "Remote", jobType: "Part-time", experienceLevel: 1, position: 1 },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for seeding...");

  // ek dummy recruiter banao (agar pehle se nahi hai)
  let recruiter = await User.findOne({ email: "seed.recruiter@jobhunt.com" });
  if (!recruiter) {
    const hashedPassword = await bcrypt.hash("Seed@1234", 10);
    recruiter = await User.create({
      fullname: "Seed Recruiter",
      email: "seed.recruiter@jobhunt.com",
      phoneNumber: "9999999999",
      password: hashedPassword,
      role: "Recruiter",
      isVerified: true, // OTP verify skip kar diya, seedha verified
    });
    console.log("Created seed recruiter:", recruiter.email);
  }

  // ek dummy company banao (agar pehle se nahi hai)
  let company = await Company.findOne({ name: "Acme Corp" });
  if (!company) {
    company = await Company.create({
      name: "Acme Corp",
      description: "A sample company used for seeded test jobs.",
      location: "Bangalore",
      userId: recruiter._id,
    });
    console.log("Created seed company:", company.name);
  }

  // saari jobs insert karo
  for (const job of jobsData) {
    await Job.create({
      ...job,
      requirements: job.requirements.split(","),
      company: company._id,
      created_by: recruiter._id,
    });
  }

  console.log(`Inserted ${jobsData.length} jobs successfully.`);
  await mongoose.disconnect();
  process.exit(0);
};

seed();