console.log("AI Assistant: Content Script Loaded.");

function createGlobalAssistant() {
    if (document.getElementById('ai-assistant-container')) return;

    chrome.storage.local.get(['apiKey'], (result) => {
        if (!result.apiKey) return;

        // 1. Create the Host Container
        const container = document.createElement('div');
        container.id = 'ai-assistant-container';
        container.style.cssText = `
            position: fixed !important;
            bottom: 30px !important;
            right: 30px !important;
            z-index: 2147483647;
            user-select: none;
        `;

        // 2. Attach Shadow DOM for Style Isolation
        const shadow = container.attachShadow({ mode: 'open' });

        // 3. Define the HTML and CSS inside the Shadow DOM
        const iconUrl = chrome.runtime.getURL('icons/icon48.png'); //
        
        shadow.innerHTML = `
            <style>
                #fab {
                    width: 50px; height: 50px;
                    background-color: #ffffff;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    transition: transform 0.2s;
                }
                #fab:hover { transform: scale(1.05); }
                #fab img { width: 35px; height: 35px; }

                #menu {
                    display: none;
                    position: absolute;
                    bottom: 75px;
                    right: 0;
                    background: white;
                    border-radius: 12px;
                    width: 180px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                    padding: 8px 0;
                    flex-direction: column;
                    overflow: hidden;
                    font-family: 'Segoe UI', Tahoma, sans-serif;
                }
                #menu.show { display: flex; }

                .tone-option {
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: background 0.2s;
                    font-size: 14px;
                    color: #333;
                }
                .tone-option:hover { background: #f5f5f5; }
                .tone-option input { cursor: pointer; }
            </style>

            <div id="menu">
                <div class="tone-option" data-tone="polished">
                    <input type="radio" name="tone" value="polished" checked>
                    <span>💼 Polished</span>
                </div>
                <div class="tone-option" data-tone="warm">
                    <input type="radio" name="tone" value="warm">
                    <span>☀️ Warm</span>
                </div>
                <div class="tone-option" data-tone="concise">
                    <input type="radio" name="tone" value="concise">
                    <span>⚡ Concise</span>
                </div>
            </div>

            <div id="fab">
                <img src="${iconUrl}" alt="AI Assistant">
            </div>
        `;

        document.body.appendChild(container);

        // 4. Toggle Logic
        const fab = shadow.getElementById('fab');
        const menu = shadow.getElementById('menu');

        fab.onclick = (e) => {
            e.stopPropagation();
            const isShowing = menu.classList.toggle('show');
            console.log("AI Assistant: Menu " + (isShowing ? "opened" : "closed"));
        };

        // Close menu when clicking anywhere else
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                menu.classList.remove('show');
            }
        });

        // 5. Handle Tone Selection
        shadow.querySelectorAll('.tone-option').forEach(option => {
            option.onclick = () => {
                const radio = option.querySelector('input');
                radio.checked = true;
                const tone = radio.value;
                chrome.storage.local.set({ selectedTone: tone });
                console.log("Selected Tone:", tone);
            };
        });
    });
}

setInterval(createGlobalAssistant, 2000);