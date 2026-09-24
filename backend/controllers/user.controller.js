import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";
import { sendOtpEmail } from "../utils/mailer.js";
import jwt from "jsonwebtoken";

// random 6-digit OTP generate karne ka helper
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    // photo Cloudinary par upload karo
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // check karo email pehle se to nahi hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    // password ko hash karo (plain text kabhi save nahi karte)
    const hashedPassword = await bcrypt.hash(password, 10);

    // OTP generate karo, 10 minute ke liye valid
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      isVerified: false,
      otp,
      otpExpiry,
      profile: {
        profilePhoto: cloudResponse?.secure_url || "",
      },
    });

    await newUser.save();

    // OTP email bhejo
    try {
      await sendOtpEmail(email, otp);
    } catch (mailError) {
      console.error("Failed to send OTP email:", mailError);
      // email fail hua to user ko delete kar do, taaki dubara try kar sake
      await User.deleteOne({ _id: newUser._id });
      return res.status(500).json({
        message: "Could not send verification email. Please try again.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "OTP sent to your email. Please verify to continue.",
      email,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error registering user",
      success: false,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified. Please login.",
        success: false,
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
        success: false,
      });
    }

    // sab check pass ho gaye - user ko verified maar do
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // JWT token banao
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // password chhupa kar response bhejo
    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 din (milliseconds mein)
        httpOnly: true,
        sameSite: "Strict",
      })
      .json({
        message: "Email verified successfully.",
        user: safeUser,
        success: true,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error verifying OTP", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // password check karo (hashed password se compare)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // email verify hai ya nahi check karo
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        needVerification: true,
        success: false,
      });
    }

    // role match karta hai ya nahi (Student try na kare Recruiter bankar login karne ki)
    if (user.role !== role) {
      return res.status(403).json({
        message: "You don't have the necessary role to access this resource",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: safeUser,
        success: true,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error login failed",
      success: false,
    });
  }
};
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills, resume } = req.body;
    const file = req.file;

    // agar naya photo aaya hai to Cloudinary par upload karo
    let cloudResponse;
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    const userId = req.id; // isAuthenticated middleware se
    let user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // sirf woh fields update karo jo bheji gayi hain
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");
    if (resume) user.profile.resume = resume;
    if (cloudResponse) user.profile.profilePhoto = cloudResponse.secure_url;

    await user.save();

    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: safeUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error updating profile", success: false });
  }
};
// Step 1: OTP bhejo (forgot password ke liye, ya profile se "change password" ke liye)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
        success: false,
      });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    return res
      .status(200)
      .json({ message: "OTP sent to your email.", success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error sending OTP", success: false });
  }
};

// Step 2: OTP verify karo aur naya password set karo
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
        success: false,
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully. Please login.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error resetting password", success: false });
  }
};

// Bonus: agar signup wala OTP expire ho jaaye, naya bhej do
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified. Please login.",
        success: false,
      });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      message: "A new OTP has been sent to your email.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error resending OTP", success: false });
  }
};
