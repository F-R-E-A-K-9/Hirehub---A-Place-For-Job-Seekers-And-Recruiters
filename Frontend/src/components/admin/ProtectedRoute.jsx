import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "Recruiter") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "Recruiter") {
    return null;
  }

  return children;
};

export default ProtectedRoute;
