import axios from "axios";

// export const headers: any = {
//   "Content-Type": "application/json;charset=utf-8",
// };
export const getAccountType = () => {
  if (typeof window !== "undefined" && typeof window !== null) {
    return localStorage.getItem("accountType");
  } else {
    return null;
  }
};

const getDefaultConfiguration = () => {
  const accountType = getAccountType();
  let baseURL: string;
  if (accountType === "prod") {
    baseURL = process.env.API_BASEURL;
  } else if (accountType === "paperTrading") {
    baseURL = process.env.PAPERTRADING_API_BASEURL;
  } else {
    baseURL = process.env.API_BASEURL;
  }
  return { baseURL };
};

export const apiWithToken = axios.create(getDefaultConfiguration());

apiWithToken.interceptors.request.use(
  async (config: any) => {
    // Get the token from localStorage
    const accessToken = localStorage.getItem("accessToken") || "BPWSVtca0ejsaNAxOh0b3krpKG8a";
    const paperTradingAccessToken = localStorage.getItem("paper_trading_accessToken");
    const accountType = getAccountType(); // Re-evaluate accountType
    // If a token is available, set it in the Authorization header
    if (accessToken) {
      if (accountType === "prod") {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else if (accountType === "paperTrading") {
        config.headers.Authorization = `Bearer ${paperTradingAccessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
