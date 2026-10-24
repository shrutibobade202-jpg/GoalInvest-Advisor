
const API_BASE_URL = "https://goalinvest-advisor.onrender.com";

// AI Assistant
export async function chatWithAI(message) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get AI response: ${errorText}`);
  }

  return response.json();
}

// Goal Calculator
export async function calculateGoal(data, target_amount, months) {
  const payload =
    typeof data === "object" && data !== null
      ? data
      : { goal: data, target_amount, months };

  const response = await fetch(`${API_BASE_URL}/calculate-goal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      goal: payload.goal,
      target_amount: Number(payload.target_amount),
      months: Number(payload.months),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to calculate goal: ${errorText}`);
  }

  return response.json();
}

// Goal Advice
export async function getGoalAdvice(data, target_amount, months) {
  const payload =
    typeof data === "object" && data !== null
      ? data
      : { goal: data, target_amount, months };

  const response = await fetch(`${API_BASE_URL}/goal-advice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      goal: payload.goal,
      target_amount: Number(payload.target_amount),
      months: Number(payload.months),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get goal advice: ${errorText}`);
  }

  return response.json();
}
