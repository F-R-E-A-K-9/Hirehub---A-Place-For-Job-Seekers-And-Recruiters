import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import AdminNav from "./AdminNav";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import { JOB_API_ENDPOINT } from "../../utils/data";

const PostJob = () => {
  const navigate = useNavigate();
  useGetAllCompanies();
  const { companies } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
  });

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.companyId) {
      toast.error("Please select a company");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_ENDPOINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNav />
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">Post a job</h1>

        {companies?.length === 0 ? (
          <p className="mt-6 text-sm text-slate">
            You need to create a company before posting a job.
          </p>
        ) : (
          <form onSubmit={submitHandler} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink">Company</label>
              <select
                name="companyId"
                value={input.companyId}
                onChange={changeHandler}
                required
                className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink bg-paper"
              >
                <option value="">Select a company</option>
                {companies?.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-ink">Job title</label>
              <input
                type="text"
                name="title"
                value={input.title}
                onChange={changeHandler}
                required
                className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-ink">
                Description
              </label>
              <textarea
                name="description"
                value={input.description}
                onChange={changeHandler}
                required
                rows={4}
                className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-ink">
                Requirements (comma separated)
              </label>
              <input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeHandler}
                required
                placeholder="React, Node, MongoDB"
                className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-ink">Location</label>
                <input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeHandler}
                  required
                  className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink">Job type</label>
                <input
                  type="text"
                  name="jobType"
                  value={input.jobType}
                  onChange={changeHandler}
                  required
                  placeholder="Full-time"
                  className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-ink">
                  Salary (LPA)
                </label>
                <input
                  type="number"
                  name="salary"
                  value={input.salary}
                  onChange={changeHandler}
                  required
                  className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink">
                  Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  value={input.experience}
                  onChange={changeHandler}
                  required
                  className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink">
                  Positions
                </label>
                <input
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={changeHandler}
                  required
                  className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper py-3 rounded-md font-medium hover:bg-signal transition-colors disabled:opacity-60"
            >
              {loading ? "Posting..." : "Post job"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostJob;
