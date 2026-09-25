import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../../redux/authSlice";
import { USER_API_ENDPOINT } from "../../utils/data";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "Student",
  });

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      const data = error.response?.data;

      // agar account verified nahi hai, seedha OTP page par bhej do
      if (data?.needVerification) {
        toast.error(data.message);
        navigate("/verify-otp", { state: { email: input.email } });
        return;
      }

      toast.error(data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-2xl font-bold text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-slate">Log in to continue.</p>

      <form onSubmit={submitHandler} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeHandler}
            required
            className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-ink">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs text-signal hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            value={input.password}
            onChange={changeHandler}
            required
            className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink">I am a</label>
          <div className="mt-1 flex gap-4">
            <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
              <input
                type="radio"
                name="role"
                value="Student"
                checked={input.role === "Student"}
                onChange={changeHandler}
              />
              Job seeker
            </label>
            <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
              <input
                type="radio"
                name="role"
                value="Recruiter"
                checked={input.role === "Recruiter"}
                onChange={changeHandler}
              />
              Recruiter
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper py-3 rounded-md font-medium hover:bg-signal transition-colors disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-signal font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
