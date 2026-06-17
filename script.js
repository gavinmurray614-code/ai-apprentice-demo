document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatHistory = document.getElementById('chat-history');
    const eventLog = document.getElementById('event-log');
    const clearLogBtn = document.getElementById('clear-log');
    let strictMode = false;
    let lastPasteTypes = [];

    // Add Strict Mode Toggle to UI dynamically
    const logHeader = document.querySelector('#event-log-container h2');
    if (logHeader) {
        const toggleLabel = document.createElement('label');
        toggleLabel.className = 'strict-mode-container';
        toggleLabel.style.fontSize = '0.8rem';
        toggleLabel.style.float = 'right';
        toggleLabel.style.color = 'var(--text-muted)';
        toggleLabel.style.fontWeight = 'normal';
        toggleLabel.style.cursor = 'pointer';
        toggleLabel.innerHTML = `<input type="checkbox" id="strict-toggle" style="margin-right: 5px;"> Strict Mode`;
        logHeader.appendChild(toggleLabel);

        const strictToggle = document.getElementById('strict-toggle');
        strictToggle.addEventListener('change', (e) => {
            strictMode = e.target.checked;
            logEvent('system', `Strict Mode ${strictMode ? 'Enabled' : 'Disabled'}`, 'system');
        });
    }

    // Helper to log events
    function logEvent(type, message, className = '') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${className}`;
        const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        entry.textContent = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        eventLog.appendChild(entry);
        eventLog.scrollTop = eventLog.scrollHeight;
    }

    // Helper to add chat message
    function addChatMessage(text, type = 'user') {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.textContent = text;
        chatHistory.appendChild(msg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // 1. Log Paste (but don't block it here yet)
    chatInput.addEventListener('paste', (e) => {
        const isTrusted = e.isTrusted ? 'User/System' : 'Script';
        lastPasteTypes = e.clipboardData ? Array.from(e.clipboardData.types) : [];
        const typesDisplay = lastPasteTypes.length > 0 ? ` (${lastPasteTypes.join(', ')})` : '';
        
        logEvent('paste', `Paste event detected (Source: ${isTrusted})${typesDisplay}`, 'paste');
        // We allow the event to continue so beforeinput can fire with data
    });

    // 2. Listen for beforeinput - THIS IS WHERE WE BLOCK
    chatInput.addEventListener('beforeinput', (e) => {
        const inputType = e.inputType || 'unknown';
        const data = e.data; 
        const isComposing = e.isComposing;
        
        // HEURISTIC LOGIC:
        // - Manual pastes (from websites/docs) usually have multiple types like 'text/html'.
        // - Dictation tools (like Wispr Flow) usually only have 'text/plain'.
        const hasRichContent = lastPasteTypes.includes('text/html') || lastPasteTypes.includes('text/rtf');
        const looksLikeManualPaste = (inputType === 'insertFromPaste') && (hasRichContent || data === null);
        
        // Strict Mode: Block all paste types
        // Heuristic Mode: Block if it has "Rich Content" signatures or no data
        const shouldBlock = strictMode ? (inputType === 'insertFromPaste' || inputType === 'insertFromDrop') : (looksLikeManualPaste || inputType === 'insertFromDrop');

        if (shouldBlock) {
            e.preventDefault();
            const reason = strictMode ? 'Strict Mode ON' : (hasRichContent ? 'Rich Content detected (text/html)' : 'Standard manual paste signature');
            logEvent('blocked', `Blocked ${inputType} (Reason: ${reason})`, 'paste');
            
            const systemMsg = document.createElement('div');
            systemMsg.className = 'message system';
            systemMsg.textContent = `Paste blocked: ${reason}.`;
            chatHistory.appendChild(systemMsg);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        } else {
            const compStatus = isComposing ? ' [COMPOSING]' : '';
            const dataDisplay = data === null ? 'null' : `"${data}"`;
            logEvent('beforeinput', `Allowed: ${inputType}${compStatus} | Data: ${dataDisplay}`, 'beforeinput');
        }
    });

    // 3. Track Composition events for even more visibility
    chatInput.addEventListener('compositionstart', () => logEvent('composition', 'Started (Dictation/IME active)', 'system'));
    chatInput.addEventListener('compositionend', () => logEvent('composition', 'Ended', 'system'));

    // 4. Listen for input
    chatInput.addEventListener('input', (e) => {
        const length = chatInput.value.length;
        logEvent('input', `Value changed. Current length: ${length}`, 'input');
    });

    // 5. Send Message
    function handleSend() {
        const text = chatInput.value.trim();
        if (text) {
            logEvent('click', `Send button clicked. Message length: ${text.length}`, 'system');
            addChatMessage(text, 'user');
            chatInput.value = '';
            
            // Fake AI response
            setTimeout(() => {
                addChatMessage('I received your message! This is a demo interface.', 'system');
            }, 600);
        }
    }

    sendBtn.addEventListener('click', handleSend);

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    // Clear Log
    clearLogBtn.addEventListener('click', () => {
        eventLog.innerHTML = '';
        logEvent('system', 'Log cleared.', 'system');
    });
});
