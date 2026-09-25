import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../redux/authSlice";
import { USER_API_ENDPOINT } from "../utils/data";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = location.state?.email;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const changeHandler = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // sirf ek digit allow karo

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // agar digit type hui, agle box par focus le jao
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const keyDownHandler = (index, e) => {
    // Backspace par khali box ho to pichle box par jao
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_ENDPOINT}/verify-otp`,
        { email, otp: otpValue },
        { withCredentials: true },
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendHandler = async () => {
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/resend-otp`, {
        email,
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not resend OTP");
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-16 text-center">
      <h1 className="font-display text-2xl font-bold text-ink">
        Verify your email
      </h1>
      <p className="mt-2 text-sm text-slate">
        We sent a 6-digit code to{" "}
        <span className="text-ink font-medium">{email}</span>
      </p>

      <form onSubmit={submitHandler} className="mt-8">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => changeHandler(index, e.target.value)}
              onKeyDown={(e) => keyDownHandler(index, e)}
              className="w-11 h-12 text-center text-lg font-medium border border-line rounded-md outline-none focus:border-signal text-ink"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-ink text-paper py-3 rounded-md font-medium hover:bg-signal transition-colors disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <button
        onClick={resendHandler}
        className="mt-4 text-sm text-signal font-medium hover:underline"
      >
        Resend code
      </button>
    </div>
  );
};

export default VerifyOtp;
