import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "../../utils/data";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "Student",
    file: null,
  });

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/verify-otp", { state: { email: input.email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-2xl font-bold text-ink">
        Create an account
      </h1>
      <p className="mt-1 text-sm text-slate">
        Start applying or hiring in minutes.
      </p>

      <form onSubmit={submitHandler} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink">Full name</label>
          <input
            type="text"
            name="fullname"
            value={input.fullname}
            onChange={changeHandler}
            required
            className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
          />
        </div>

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
          <label className="text-sm font-medium text-ink">Phone number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={input.phoneNumber}
            onChange={changeHandler}
            required
            className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Password</label>
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

        <div>
          <label className="text-sm font-medium text-ink">Profile photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={fileHandler}
            required
            className="mt-1 w-full text-sm text-slate"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper py-3 rounded-md font-medium hover:bg-signal transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        Already have an account?{" "}
        <Link to="/login" className="text-signal font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
