import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCompanies } from "../redux/companySlice";
import { COMPANY_API_ENDPOINT } from "../utils/data";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${COMPANY_API_ENDPOINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [dispatch]);

  return { loading };
};

export default useGetAllCompanies;
