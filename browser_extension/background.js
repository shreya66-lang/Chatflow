// background.js
// This script runs in the background of the extension.

console.log("AI Messaging Assistant: Background script loaded.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateResponse") {
    console.log("Received request in background script:", request.data);
    // Forward message to FastAPI service
    fetch("http://127.0.0.1:8000/generate_response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from AI service:", data);
        sendResponse({ status: "success", response: data });
      })
      .catch((error) => {
        console.error("Error communicating with AI service:", error);
        sendResponse({ status: "error", message: error.message });
      });

    // Return true to indicate that we will send a response asynchronously
    return true;
  }
}); 