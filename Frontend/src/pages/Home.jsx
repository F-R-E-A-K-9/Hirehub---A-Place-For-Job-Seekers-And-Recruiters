import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import useGetAllJobs from "../hooks/useGetAllJobs";
import JobCard from "../components/jobs/JobCard";
import { setSearchedQuery } from "../redux/jobSlice";

const Home = () => {
  useGetAllJobs();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allJobs } = useSelector((store) => store.job);
  const [query, setQuery] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(setSearchedQuery(query));
    navigate("/jobs");
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      <section className="py-16 md:py-24 max-w-xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight">
          Find work that actually fits.
        </h1>
        <p className="mt-4 text-slate text-lg">
          Search roles from real companies hiring right now.
        </p>

        <form
          onSubmit={submitHandler}
          className="mt-8 flex border border-line rounded-md overflow-hidden"
        >
          <div className="flex items-center gap-2 flex-1 px-4">
            <Search size={18} className="text-slate" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title or keyword"
              className="w-full py-3 outline-none bg-transparent text-ink placeholder:text-slate"
            />
          </div>
          <button className="px-6 bg-signal text-white font-medium">
            Search
          </button>
        </form>

        <p className="mt-3 text-sm text-slate">
          {allJobs?.length || 0} open roles, updated today
        </p>
      </section>

      <section className="border-t border-line py-10">
        <h2 className="font-display text-xl font-bold text-ink mb-4">
          Latest jobs
        </h2>

        {allJobs?.length > 0 ? (
          <div>
            {allJobs.slice(0, 6).map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-slate text-sm">No jobs posted yet.</p>
        )}

        <div className="mt-6">
          <Link
            to="/jobs"
            className="text-signal font-medium text-sm hover:underline"
          >
            Browse all jobs
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
