import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/admin/companies", label: "Companies" },
  { to: "/admin/jobs/create", label: "Post a job" },
  { to: "/admin/jobs", label: "My jobs" },
];

const AdminNav = () => {
  return (
    <div className="border-b border-line">
      <div className="max-w-4xl mx-auto px-6 flex gap-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) =>
              `py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                isActive
                  ? "border-signal text-ink"
                  : "border-transparent text-slate hover:text-ink"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminNav;
