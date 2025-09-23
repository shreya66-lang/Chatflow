// popup.js
// This script runs when the extension popup is opened.

document.addEventListener('DOMContentLoaded', () => {
  const generateResponseBtn = document.getElementById('generateResponseBtn');
  const statusDiv = document.getElementById('status');

  generateResponseBtn.addEventListener('click', () => {
    statusDiv.textContent = "Generating response...";

    // Send a message to the content script to trigger response generation
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "generateResponseFromPage" }, (response) => {
          if (chrome.runtime.lastError) {
            statusDiv.textContent = "Error: Could not connect to content script. Make sure you are on a web page.";
            console.error(chrome.runtime.lastError.message);
            return;
          }

          if (response && response.status === "success") {
            statusDiv.textContent = "Response generated!";
          } else if (response) {
            statusDiv.textContent = `Error: ${response.message}`;
          } else {
            statusDiv.textContent = "No response from content script.";
          }
        });
      } else {
        statusDiv.textContent = "No active tab found. Open a web page to use the assistant.";
      }
    });
  });
}); 