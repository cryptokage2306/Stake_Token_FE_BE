import { Axios } from "axios";
import { LIMIT } from "../constant/config";
function apiProvider() {
  const api = new Axios({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT,
  });
  const getRecords = async (skip) => {
    const { data } = await api.get("/stakeRecord/records", {
      params: {
        skip,
        limit: LIMIT,
      },
    });
    return JSON.parse(data);
  };
  return {
    getRecords,
  };
}

export default apiProvider();
