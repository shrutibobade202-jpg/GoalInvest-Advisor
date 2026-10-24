
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
export async function calculateGoal(goal, target_amount, months) {
  const response = await fetch(`${API_BASE_URL}/calculate-goal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      goal,
      target_amount: Number(target_amount),
      months: Number(months),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to calculate goal");
  }

  return response.json();
}

// Goal Advice
export async function getGoalAdvice(goal, target_amount, months) {
  const response = await fetch(`${API_BASE_URL}/goal-advice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      goal,
      target_amount: Number(target_amount),
      months: Number(months),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get goal advice");
  }

  return response.json();
}
