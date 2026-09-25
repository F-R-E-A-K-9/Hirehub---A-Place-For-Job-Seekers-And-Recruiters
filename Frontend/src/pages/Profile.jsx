import { useState } from "react";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import EditProfileModal from "../components/jobs/EditProfileModal";

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const { allAppliedJobs } = useSelector((store) => store.job);
  const { loading } = useGetAppliedJobs();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between border-b border-line pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            {user?.fullname}
          </h1>
          <p className="mt-1 text-slate text-sm">{user?.email}</p>
          <p className="text-slate text-sm">{user?.phoneNumber}</p>
          {user?.profile?.bio && (
            <p className="mt-3 text-ink text-sm max-w-md">{user.profile.bio}</p>
          )}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="text-sm font-medium border border-line px-4 py-2 rounded-md hover:bg-line/20 transition-colors"
        >
          Edit profile
        </button>
      </div>

      {user?.profile?.skills?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-medium text-ink">Skills</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.profile.skills.map((skill, index) => (
              <span
                key={index}
                className="text-xs bg-line/30 text-ink px-3 py-1 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {user?.profile?.resume && (
        <a
          href={user.profile.resume}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-signal text-sm font-medium hover:underline"
        >
          View resume
        </a>
      )}

      <div className="mt-10">
        <h2 className="font-display text-lg font-bold text-ink mb-4">
          Applied jobs
        </h2>

        {loading ? (
          <p className="text-slate text-sm">Loading...</p>
        ) : allAppliedJobs?.length > 0 ? (
          <div>
            {allAppliedJobs.map((application) => (
              <div
                key={application._id}
                className="flex items-center justify-between py-4 border-b border-line"
              >
                <div>
                  <h3 className="font-medium text-ink">
                    {application.job?.title}
                  </h3>
                  <p className="text-sm text-slate mt-0.5">
                    {application.job?.company?.name}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-md ${
                    application.status === "accepted"
                      ? "bg-signal/15 text-signal"
                      : application.status === "rejected"
                        ? "bg-flag/15 text-flag"
                        : "bg-line/40 text-slate"
                  }`}
                >
                  {application.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate text-sm">
            You haven't applied to any jobs yet.
          </p>
        )}
      </div>

      <EditProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Profile;
