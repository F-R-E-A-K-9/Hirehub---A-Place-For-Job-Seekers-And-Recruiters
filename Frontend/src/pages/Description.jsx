import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import useGetSingleJob from "../hooks/useGetSingleJob";
import { APPLICATION_API_ENDPOINT } from "../utils/data";

const Description = () => {
  const { id } = useParams();
  const { loading } = useGetSingleJob(id);
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [applying, setApplying] = useState(false);

  const alreadyApplied = singleJob?.applications?.some(
    (application) => application.applicant === user?._id,
  );

  const applyHandler = async () => {
    try {
      setApplying(true);
      const res = await axios.get(`${APPLICATION_API_ENDPOINT}/apply/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        // singleJob ko manually update kar dete hain, taaki turant button badal jaaye
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <p className="max-w-3xl mx-auto px-6 py-10 text-slate text-sm">
        Loading...
      </p>
    );
  }

  if (!singleJob) {
    return (
      <p className="max-w-3xl mx-auto px-6 py-10 text-slate text-sm">
        Job not found.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between border-b border-line pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            {singleJob.title}
          </h1>
          <p className="mt-1 text-slate">{singleJob.company?.name}</p>
        </div>

        {user?.role === "Student" &&
          (alreadyApplied ? (
            <span className="px-4 py-2 rounded-md bg-line/40 text-slate text-sm font-medium">
              Already applied
            </span>
          ) : (
            <button
              onClick={applyHandler}
              disabled={applying}
              className="px-5 py-2 rounded-md bg-signal text-white text-sm font-medium hover:bg-ink transition-colors disabled:opacity-60"
            >
              {applying ? "Applying..." : "Apply now"}
            </button>
          ))}
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-2 mt-6 text-sm text-slate">
        <span>{singleJob.location}</span>
        <span>{singleJob.jobType}</span>
        <span className="text-ink font-medium">₹{singleJob.salary} LPA</span>
        <span>{singleJob.position} openings</span>
        <span>{singleJob.experienceLevel}+ years experience</span>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-ink">
          About the role
        </h2>
        <p className="mt-2 text-ink leading-relaxed whitespace-pre-line">
          {singleJob.description}
        </p>
      </div>

      {singleJob.requirements?.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-bold text-ink">
            Requirements
          </h2>
          <ul className="mt-2 space-y-1">
            {singleJob.requirements.map((req, index) => (
              <li key={index} className="text-ink text-sm">
                • {req.trim()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Description;
