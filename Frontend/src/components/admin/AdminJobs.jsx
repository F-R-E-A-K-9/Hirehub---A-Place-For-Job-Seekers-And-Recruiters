import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminNav from "./AdminNav";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";

const AdminJobs = () => {
  const { loading } = useGetAllAdminJobs();
  const { allAdminJobs } = useSelector((store) => store.job);

  return (
    <div>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">My jobs</h1>

        <div className="mt-8">
          {loading ? (
            <p className="text-slate text-sm">Loading...</p>
          ) : allAdminJobs?.length > 0 ? (
            <div>
              {allAdminJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between py-4 border-b border-line"
                >
                  <div>
                    <h3 className="font-medium text-ink">{job.title}</h3>
                    <p className="text-sm text-slate mt-0.5">
                      {job.company?.name} · {job.location}
                    </p>
                  </div>
                  <Link
                    to={`/admin/jobs/${job._id}/applicants`}
                    className="text-sm font-medium text-signal hover:underline"
                  >
                    View applicants
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate text-sm">
              You haven't posted any jobs yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
