import axios from "axios";

const APIInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://dms.origiins.co/api"
      : "http://localhost:3000/api/",
});

export default APIInstance;
