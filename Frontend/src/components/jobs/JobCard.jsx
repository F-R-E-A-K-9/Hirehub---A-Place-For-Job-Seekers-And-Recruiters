import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="flex items-center justify-between py-4 px-2 -mx-2 rounded-md border-b border-line cursor-pointer hover:bg-line/20 transition-colors"
    >
      <div>
        <h3 className="font-medium text-ink">{job.title}</h3>
        <p className="text-sm text-slate mt-0.5">{job.company?.name}</p>
      </div>
      <div className="hidden sm:flex items-center gap-6 text-sm text-slate text-right">
        <span>{job.location}</span>
        <span>{job.jobType}</span>
        <span className="text-ink font-medium">₹{job.salary} LPA</span>
      </div>
    </div>
  );
};

export default JobCard;
