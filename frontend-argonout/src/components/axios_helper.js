import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.get["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";

export const request = (method, url, data) => {
  return axios({
    method: method,
    url: url,
    data: data,
  });
};
