// content.js
// This script runs on every web page specified in manifest.json 'matches'.

console.log("AI Messaging Assistant: Content script loaded.");

// Function to simulate typing into an input element
function simulateTyping(element, text) {
  if (!element) return;

  element.focus();
  element.value = ""; // Clear existing text

  let i = 0;
  const typeInterval = setInterval(() => {
    if (i < text.length) {
      element.value += text.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);
      // Dispatch input event to ensure the app recognizes the change
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, 50);
}

// Example of how to trigger response generation (this would be more sophisticated in a real app)
// For demonstration, let's assume a button or a specific key press triggers this

// We need to listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateResponseFromPage") {
    const latestMessage = document.querySelector('div[data-testid="message-text"]') ?
                          document.querySelector('div[data-testid="message-text"]').innerText : 
                          document.body.innerText.slice(0, 500); // Fallback to body text

    // In a real scenario, you'd extract actual chat history and current message
    const currentMessage = latestMessage; // Simplified for now
    const chatHistory = []; // Placeholder for actual history extraction

    chrome.runtime.sendMessage(
      {
        action: "generateResponse",
        data: { message: currentMessage, history: chatHistory },
      },
      (response) => {
        if (response.status === "success") {
          console.log("AI Response received:", response.response.response);
          // Find a chat input field and type the response
          const inputField = document.querySelector('div[contenteditable="true"]'); // Common for web chats
          if (inputField) {
            simulateTyping(inputField, response.response.response);
          } else {
            alert("AI Response: " + response.response.response + "\n(Could not find chat input field)");
          }
        } else {
          console.error("Error from background script:", response.message);
          alert("AI Service Error: " + response.message);
        }
        sendResponse({ status: response.status, message: response.message || response.response.response });
      }
    );
    return true; // Indicate asynchronous response
  }
});

// A basic listener to check if content script is alive (for debugging/popup)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse({ status: "pong" });
  }
}); 