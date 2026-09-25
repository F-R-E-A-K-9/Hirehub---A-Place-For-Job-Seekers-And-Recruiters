import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import AdminNav from "./AdminNav";
import useGetApplicants from "../../hooks/useGetApplicants";
import { APPLICATION_API_ENDPOINT } from "../../utils/data";

const Applicants = () => {
  const { id } = useParams();
  const { loading } = useGetApplicants(id);
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (applicationId, status) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${applicationId}/update`,
        { status },
        { withCredentials: true },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update status");
    }
  };

  return (
    <div>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">
          Applicants{applicants?.title ? ` for ${applicants.title}` : ""}
        </h1>

        <div className="mt-8">
          {loading ? (
            <p className="text-slate text-sm">Loading...</p>
          ) : applicants?.applications?.length > 0 ? (
            <div>
              {applicants.applications.map((application) => (
                <div
                  key={application._id}
                  className="flex items-center justify-between py-4 border-b border-line"
                >
                  <div>
                    <h3 className="font-medium text-ink">
                      {application.applicant?.fullname}
                    </h3>
                    <p className="text-sm text-slate mt-0.5">
                      {application.applicant?.email}
                    </p>
                    {application.applicant?.profile?.resume && (
                      <a
                        href={application.applicant.profile.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-signal hover:underline"
                      >
                        View resume
                      </a>
                    )}
                  </div>

                  {application.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          statusHandler(application._id, "rejected")
                        }
                        className="text-sm font-medium border border-line text-ink px-3 py-1.5 rounded-md hover:bg-line/20 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          statusHandler(application._id, "accepted")
                        }
                        className="text-sm font-medium bg-signal text-white px-3 py-1.5 rounded-md hover:bg-ink transition-colors"
                      >
                        Accept
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-md ${
                        application.status === "accepted"
                          ? "bg-signal/15 text-signal"
                          : "bg-flag/15 text-flag"
                      }`}
                    >
                      {application.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate text-sm">No applicants yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applicants;
