import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { COMPANY_API_ENDPOINT } from "../../utils/data";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${COMPANY_API_ENDPOINT}/register`,
        { companyName },
        { withCredentials: true },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate(`/admin/companies/${res.data.company._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-2xl font-bold text-ink">
        Name your company
      </h1>
      <p className="mt-1 text-sm text-slate">
        You can add a logo, description and more after this.
      </p>

      <form onSubmit={submitHandler} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink">Company name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            placeholder="e.g. Acme Corp"
            className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            to="/admin/companies"
            className="flex-1 text-center border border-line text-ink py-2 rounded-md font-medium hover:bg-line/20 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-ink text-paper py-2 rounded-md font-medium hover:bg-signal transition-colors disabled:opacity-60"
          >
            {loading ? "Creating..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyCreate;
