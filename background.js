// Listeners must be at the top level for Manifest V3
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "GENERATE_SUGGESTION") {
        handleAiRequest(msg.text).then(sendResponse);
        return true; // Keep communication channel open for async response
    }
});

async function handleAiRequest(userInput) {
    try {
        const { apiKey } = await chrome.storage.local.get(["apiKey"]);
        if (!apiKey) return { error: "API Key is missing." };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userInput }] }]
                })
            }
        );

        const data = await response.json();
        // Return suggestion from Gemini API response
        return { suggestion: data.candidates?.[0]?.content?.parts?.[0]?.text || "" };
    } catch (err) {
        return { error: err.message };
    }
}