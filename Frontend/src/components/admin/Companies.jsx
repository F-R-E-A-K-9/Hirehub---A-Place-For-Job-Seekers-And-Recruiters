import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import AdminNav from "./AdminNav";

const Companies = () => {
  const { loading } = useGetAllCompanies();
  const { companies } = useSelector((store) => store.company);

  return (
    <div>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-ink">
            Companies
          </h1>
          <Link
            to="/admin/companies/create"
            className="flex items-center gap-1.5 text-sm font-medium bg-ink text-paper px-4 py-2 rounded-md hover:bg-signal transition-colors"
          >
            <Plus size={16} />
            New company
          </Link>
        </div>

        <div className="mt-8">
          {loading ? (
            <p className="text-slate text-sm">Loading...</p>
          ) : companies?.length > 0 ? (
            <div>
              {companies.map((company) => (
                <Link
                  key={company._id}
                  to={`/admin/companies/${company._id}`}
                  className="flex items-center justify-between py-4 border-b border-line hover:bg-line/20 transition-colors -mx-2 px-2 rounded-md"
                >
                  <div>
                    <h3 className="font-medium text-ink">{company.name}</h3>
                    <p className="text-sm text-slate mt-0.5">
                      {company.location || "No location set"}
                    </p>
                  </div>
                  <span className="text-sm text-slate">Edit →</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate text-sm">
              You haven't added a company yet. Create one to start posting jobs.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Companies;
