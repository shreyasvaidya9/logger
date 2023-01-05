import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url, method = "get", body) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios({ url, method, data: body });
        const data = response?.data?.result;

        setData(data);
        setError(null);
        setLoading(false);
      } catch (error) {
        setData(null);
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { loading, error, data };
};

export default useFetch;
