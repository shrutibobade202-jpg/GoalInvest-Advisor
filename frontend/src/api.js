
const API_BASE_URL = "https://goalinvest-advisor-project.onrender.com";

// AI Assistant
export async function chatWithAI(message) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }

  return await response.json();
}

// Goal Planner: Calculate monthly savings
export async function calculateGoal(data) {
  const response = await fetch(`${API_BASE_URL}/calculate-goal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to calculate goal");
  }

  return await response.json();
}

// Goal Planner: Get goal advice
export async function getGoalAdvice(data) {
  const response = await fetch(`${API_BASE_URL}/goal-advice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to get goal advice");
  }

  return await response.json();
}

// Mutual fund dataset
export async function getMutualFunds(
  category = "",
  risk_level = "",
  search = ""
) {
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (risk_level) params.append("risk_level", risk_level);
  if (search) params.append("search", search);

  const response = await fetch(
    `${API_BASE_URL}/mutual-funds?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to load mutual funds");
  }

  return await response.json();
}
