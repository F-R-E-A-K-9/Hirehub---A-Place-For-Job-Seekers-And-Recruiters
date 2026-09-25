import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/authSlice";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "../../utils/data";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error("Something went wrong while logging out");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-ink">
          Job Hunt
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate">
          <Link to="/" className="hover:text-ink transition-colors">
            Home
          </Link>
          <Link to="/jobs" className="hover:text-ink transition-colors">
            Jobs
          </Link>
        </nav>

        {!user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-ink px-4 py-2 hover:text-signal transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-ink text-paper px-4 py-2 rounded-md hover:bg-signal transition-colors"
            >
              Sign up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {user.role === "Recruiter" && (
              <Link
                to="/admin/companies"
                className="text-sm text-slate hover:text-ink"
              >
                Dashboard
              </Link>
            )}
            <Link to="/profile" className="text-sm text-slate hover:text-ink">
              {user.fullname}
            </Link>
            <button
              onClick={logoutHandler}
              className="text-sm font-medium text-ink hover:text-signal transition-colors"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
