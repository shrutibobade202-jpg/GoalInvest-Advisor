import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

export const chatWithAI = async (message) => {
  const response = await API.post("/chat", {
    message: message,
  });

  return response.data;
};

export const calculateGoal = async (data) => {
  const response = await API.post("/calculate-goal", data);

  return response.data;
};

export const getGoalAdvice = async (data) => {
  const response = await API.post("/goal-advice", data);

  return response.data;
};