import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import useGetCompanyById from "../../hooks/useGetCompanyById";
import { COMPANY_API_ENDPOINT } from "../../utils/data";

const CompanySetup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading: fetching } = useGetCompanyById(id);
  const { singleCompany } = useSelector((store) => store.company);
  const [saving, setSaving] = useState(false);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  // jab company data fetch hoke Redux mein aaye, form ko us data se bhar do
  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
      });
    }
  }, [singleCompany]);

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setSaving(true);
      const res = await axios.put(
        `${COMPANY_API_ENDPOINT}/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update company");
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <p className="max-w-xl mx-auto px-6 py-10 text-slate text-sm">
        Loading...
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">
        Company details
      </h1>
      <p className="mt-1 text-sm text-slate">
        This information will appear on your job postings.
      </p>

      <form onSubmit={submitHandler} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink">Company name</label>
          <input
            type="text"
            name="name"
            value={input.name}
            onChange={changeHandler}
            className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Description</label>
          <textarea
            name="description"
            value={input.description}
            onChange={changeHandler}
            rows={4}
            className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Website</label>
          <input
            type="text"
            name="website"
            value={input.website}
            onChange={changeHandler}
            placeholder="https://..."
            className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Location</label>
          <input
            type="text"
            name="location"
            value={input.location}
            onChange={changeHandler}
            className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Logo</label>
          {singleCompany?.logo && (
            <img
              src={singleCompany.logo}
              alt="Current logo"
              className="w-12 h-12 rounded-md object-cover mt-1 mb-2 border border-line"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={fileHandler}
            className="w-full text-sm text-slate"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-ink text-paper py-3 rounded-md font-medium hover:bg-signal transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default CompanySetup;
