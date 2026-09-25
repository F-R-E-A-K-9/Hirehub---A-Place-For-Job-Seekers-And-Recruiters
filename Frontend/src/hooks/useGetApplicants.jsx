import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAllApplicants } from "../redux/applicationSlice";
import { APPLICATION_API_ENDPOINT } from "../utils/data";

const useGetApplicants = (jobId) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${APPLICATION_API_ENDPOINT}/${jobId}/applicants`,
          {
            withCredentials: true,
          },
        );
        if (res.data.success) {
          dispatch(setAllApplicants(res.data.job));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchApplicants();
  }, [jobId, dispatch]);

  return { loading };
};

export default useGetApplicants;
