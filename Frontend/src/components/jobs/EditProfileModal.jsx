import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../../redux/authSlice";
import { USER_API_ENDPOINT } from "../../utils/data";

const EditProfileModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    resume: user?.profile?.resume || "",
  });

  if (!open) return null;

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 px-4">
      <div className="bg-paper rounded-md max-w-md w-full p-6">
        <h2 className="font-display text-xl font-bold text-ink">
          Edit profile
        </h2>

        <form onSubmit={submitHandler} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink">Full name</label>
            <input
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={changeHandler}
              className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Bio</label>
            <textarea
              name="bio"
              value={input.bio}
              onChange={changeHandler}
              rows={3}
              className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={input.skills}
              onChange={changeHandler}
              placeholder="React, Node, MongoDB"
              className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Resume link</label>
            <input
              type="text"
              name="resume"
              value={input.resume}
              onChange={changeHandler}
              placeholder="https://..."
              className="mt-1 w-full border border-line rounded-md px-3 py-2 outline-none focus:border-signal text-ink"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-line text-ink py-2 rounded-md font-medium hover:bg-line/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-ink text-paper py-2 rounded-md font-medium hover:bg-signal transition-colors disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
