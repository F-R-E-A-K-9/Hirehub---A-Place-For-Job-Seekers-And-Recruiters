import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "../utils/data";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = email maango, 2 = OTP + naya password
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const sendOtpHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_ENDPOINT}/forgot-password`, {
        email,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_ENDPOINT}/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="font-display text-2xl font-bold text-ink">
        Reset password
      </h1>
      <p className="mt-2 text-sm text-slate">
        {step === 1
          ? "Enter your email and we'll send you a code."
          : `Enter the code sent to ${email} and choose a new password.`}
      </p>

      {step === 1 ? (
        <form onSubmit={sendOtpHandler} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-3 rounded-md font-medium hover:bg-signal transition-colors disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={resetHandler} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink">6-digit code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink tracking-widest"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-3 rounded-md font-medium hover:bg-signal transition-colors disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-sm text-slate hover:text-ink"
          >
            Use a different email
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
