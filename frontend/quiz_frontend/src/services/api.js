const API_BASE_URL = "http://127.0.0.1:8000";

export async function generateQuiz(url) {
  const response = await fetch(`${API_BASE_URL}/generate_quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) {
    let errorMsg = "Failed to generate quiz";
    try {
      const errorData = await response.json();
      if (errorData.detail) errorMsg = errorData.detail;
    } catch {
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function fetchHistory() {
  const response = await fetch(`${API_BASE_URL}/history`);
  if (!response.ok) throw new Error("Failed to load history");
  return response.json();
}

export async function fetchQuizById(id) {
  const response = await fetch(`${API_BASE_URL}/quiz/${id}`);
  if (!response.ok) throw new Error("Quiz not found");
  return response.json();
}
