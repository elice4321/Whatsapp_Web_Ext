document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('save-btn');
  const apiKeyInput = document.getElementById('api-key-input');
  const statusMsg = document.getElementById('status-msg');

  // Load existing key
  chrome.storage.local.get(['apiKey'], (result) => {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
  });

  saveBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      chrome.storage.local.set({ apiKey: key }, () => {
        statusMsg.textContent = "API key saved! Refreshing...";
        setTimeout(() => window.close(), 1000);
      });
    } else {
      statusMsg.style.color = "red";
      statusMsg.textContent = "Please enter a key.";
    }
  });

  document.getElementById('close-btn').onclick = () => window.close();
});