async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("You", userMessage);
  input.value = "";

  try {
    const res = await fetch("http://127.0.0.1:8000/generate_response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: "Shreya", message: userMessage }),
    });

    const data = await res.json();

    // Display AI response with typing effect
    streamMessage("AI", data.response);
  } catch (err) {
    console.error("Error:", err);
    appendMessage("AI", "⚠️ Error: Could not connect to backend.");
  }
}