import Axios from "axios";

const api = Axios.create({
  baseURL: `${
    process.env.APP_TYPE == "DEV"
      ? "http://localhost:3333"
      : "https://topsun-backend.herokuapp.com"
  }`,
});

export default api;
