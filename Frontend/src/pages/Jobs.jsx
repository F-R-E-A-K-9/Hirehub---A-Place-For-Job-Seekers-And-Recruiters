import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search } from "lucide-react";
import useGetAllJobs from "../hooks/useGetAllJobs";
import JobCard from "../components/jobs/JobCard";
import { setSearchedQuery } from "../redux/jobSlice";

const Jobs = () => {
  const dispatch = useDispatch();
  const { loading } = useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [query, setQuery] = useState(searchedQuery || "");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(setSearchedQuery(query));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Browse jobs</h1>

      <form
        onSubmit={submitHandler}
        className="mt-6 flex border border-line rounded-md overflow-hidden max-w-lg"
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

      <div className="mt-8">
        {loading ? (
          <p className="text-slate text-sm">Loading jobs...</p>
        ) : allJobs?.length > 0 ? (
          <div>
            {allJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-slate text-sm">
            No jobs found{searchedQuery ? ` for "${searchedQuery}"` : ""}.
          </p>
        )}
      </div>
    </div>
  );
};

export default Jobs;
