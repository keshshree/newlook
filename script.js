document.addEventListener('DOMContentLoaded', function() {
    const welcomeContainer = document.getElementById('welcome-container');
    const welcomeNameInput = document.getElementById('welcome-name');
    const welcomeEmailInput = document.getElementById('welcome-email');
    const welcomeSubmitButton = document.getElementById('welcome-submit');
    const welcomeError = document.getElementById('welcome-error');

    const emailVerificationContainer = document.getElementById('email-verification-container');
    const verificationCodeInput = document.getElementById('verification-code');
    const verifyCodeButton = document.getElementById('verify-code-button');
    const verificationError = document.getElementById('verification-error');
    const verificationSuccess = document.getElementById('verification-success');
    const verificationLoader = document.getElementById('verification-loader');

    const mainContent = document.getElementById('main-content');
    const mainWrapper = document.getElementById('main-wrapper');
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.querySelector('.openbtn');
    const closeBtn = document.querySelector('.closebtn');
    const servicesToggle = document.querySelector('.services-toggle');
    const submenu = document.querySelector('.submenu');

    let userEmail = '';

    // Sidebar functions
    function openNav() {
        if (sidebar) {
            sidebar.style.width = "250px";
        }
        if (mainWrapper) {
            mainWrapper.style.marginLeft = "250px";
        }
    }

    function closeNav() {
        if (sidebar) {
            sidebar.style.width = "0";
        }
        if (mainWrapper) {
            mainWrapper.style.marginLeft = "0";
        }
    }

    // Toggle services submenu
    if (servicesToggle && submenu) {
        servicesToggle.addEventListener('click', function(event) {
            event.preventDefault();
            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            servicesToggle.classList.toggle('active');
        });
    }

    // Attach listeners
    if (openBtn) {
        openBtn.addEventListener("click", openNav);
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeNav);
    }

    // Function to validate email domain
    function isValidEmail(email) {
        const allowedDomains = ['@gmail.com', '@yahoo.com'];
        return allowedDomains.some(domain => email.endsWith(domain));
    }

    function validateName(name) {
        if (!name || name.length < 2) {
            return { isValid: false, message: "Name must be at least 2 characters long." };
        }
        // Basic check for alphanumeric and some special characters (spaces, hyphens, apostrophes)
        const nameRegex = /^[a-zA-Z\s\-']+$/;
        if (!nameRegex.test(name)) {
            return { isValid: false, message: "Name can only contain letters, spaces, hyphens, and apostrophes." };
        }
        return { isValid: true, message: "" };
    }

    function validateEmail(email) {
        // Basic email regex for format validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, message: "Invalid email format." };
        }

        // Domain specific validation
        const allowedDomains = ['gmail.com', 'yahoo.com'];
        const domain = email.split('@')[1];
        if (!allowedDomains.includes(domain)) {
            return { isValid: false, message: "Invalid email domain. Only @gmail.com and @yahoo.com are allowed." };
        }
        return { isValid: true, message: "" };
    }

    function validateVerificationCode(code) {
        if (!code || code.length !== 7 || !/^[0-9]+$/.test(code)) {
            return { isValid: false, message: "Verification code must be a 7-digit number." };
        }
        return { isValid: true, message: "" };
    }

    function validateText(text) {
        if (!text || text.length < 1) {
            return { isValid: false, message: "Text cannot be empty." };
        }
        if (text.length > 5000) {
            return { isValid: false, message: "Text exceeds maximum allowed length (5000 characters)." };
        }
        return { isValid: true, message: "" };
    }

    function validateStockTicker(ticker) {
        const tickerRegex = /^[A-Z]{1,5}$/;
        if (!tickerRegex.test(ticker)) {
            return { isValid: false, message: "Invalid stock ticker format. Must be 1-5 uppercase letters." };
        }
        return { isValid: true, message: "" };
    }

    function validateAmount(amount) {
        if (isNaN(amount) || amount <= 0) {
            return { isValid: false, message: "Amount must be a positive number." };
        }
        return { isValid: true, message: "" };
    }

    function validateLocation(location) {
        if (!location || location.length < 2) {
            return { isValid: false, message: "Location must be at least 2 characters long." };
        }
        const locationRegex = /^[a-zA-Z0-9\s]+$/;
        if (!locationRegex.test(location)) {
            return { isValid: false, message: "Location can only contain letters, numbers, and spaces." };
        }
        return { isValid: true, message: "" };
    }

    function validatePricesList(pricesString) {
        if (!pricesString) {
            return { isValid: false, message: "Please enter stock prices." };
        }
        const prices = pricesString.split(',').map(p => parseFloat(p.trim()));
        if (prices.some(isNaN)) {
            return { isValid: false, message: "Please enter valid numbers separated by commas." };
        }
        if (prices.length === 0) {
            return { isValid: false, message: "Prices list cannot be empty." };
        }
        for (const price of prices) {
            if (price < 0) {
                return { isValid: false, message: "Each price in the list must be a non-negative number." };
            }
        }
        return { isValid: true, message: "" };
    }

    function validateMessage(message) {
        if (!message || message.length < 1) {
            return { isValid: false, message: "Message cannot be empty." };
        }
        if (message.length > 1000) {
            return { isValid: false, message: "Message exceeds maximum allowed length (1000 characters)." };
        }
        return { isValid: true, message: "" };
    }

    // Welcome screen submit handler
    welcomeSubmitButton.addEventListener('click', function() {
        const name = welcomeNameInput.value.trim();
        const email = welcomeEmailInput.value.trim();

        welcomeError.style.display = 'none';

        const nameValidation = validateName(name);
        const emailValidation = validateEmail(email);

        if (!nameValidation.isValid) {
            welcomeError.innerText = nameValidation.message;
            welcomeError.style.display = 'block';
            return;
        }

        if (!emailValidation.isValid) {
            welcomeError.innerText = emailValidation.message;
            welcomeError.style.display = 'block';
            return;
        }

        userEmail = email;
        welcomeContainer.style.display = 'none';
        emailVerificationContainer.style.display = 'block';
        // In a real application, you would send the verification email here
        console.log(`Sending verification code to ${userEmail}`);
    });

    // Email verification code handler
    verifyCodeButton.addEventListener('click', async function() {
        const verificationCode = verificationCodeInput.value.trim();
        verificationError.style.display = 'none';
        verificationSuccess.style.display = 'none';
        verificationLoader.style.display = 'block';

        const codeValidation = validateVerificationCode(verificationCode);
        if (!codeValidation.isValid) {
            verificationError.innerText = codeValidation.message;
            verificationError.style.display = 'block';
            verificationLoader.style.display = 'none';
            return;
        }

        // Simulate verification (replace with actual API call)
        if (verificationCode === '1234567') { // Example valid code
            verificationSuccess.innerText = 'Verification successful! Redirecting...';
            verificationSuccess.style.display = 'block';
            emailVerificationContainer.style.display = 'none';
            mainContent.style.display = 'block'; // Show main content
        } else {
            verificationError.innerText = 'Invalid verification code.';
            verificationError.style.display = 'block';
        }
        verificationLoader.style.display = 'none';
    });

    // Initial state: show welcome screen
    welcomeContainer.style.display = 'block';
    emailVerificationContainer.style.display = 'none';
    mainContent.style.display = 'none';
    mainWrapper.style.display = 'block'; // Ensure mainWrapper is visible

    // Translation Service
    const textToTranslate = document.getElementById('text-to-translate');
    const targetLanguage = document.getElementById('target-language');
    const translateButton = document.getElementById('translate-button');
    const translatedText = document.getElementById('translated-text');
    const translationLoader = document.getElementById('translation-loader');
    const translationError = document.getElementById('translation-error');
    const translationSuccess = document.getElementById('translation-success');
    const resetTranslationButton = document.getElementById('reset-translation-button');

    if (translateButton) {
        translateButton.addEventListener('click', async function() {
            const text = textToTranslate.value.trim();
            const language = targetLanguage.value;

            translatedText.innerText = '';
            translationError.style.display = 'none';
            translationSuccess.style.display = 'none';
            translationLoader.style.display = 'block';

            const textValidation = validateText(text);
            if (!textValidation.isValid) {
                translationError.innerText = textValidation.message;
                translationError.style.display = 'block';
                translationLoader.style.display = 'none';
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5000/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: text, target_language: language })
                });
                const data = await response.json();

                if (response.ok) {
                    translatedText.innerText = data.translated_text;
                    translationSuccess.innerText = 'Translation successful!';
                    translationSuccess.style.display = 'block';
                } else {
                    translationError.innerText = `Error: ${data.error || 'Translation failed.'}`;
                    translationError.style.display = 'block';
                }
            } catch (error) {
                console.error('Error during translation:', error);
                translationError.innerText = 'An error occurred during translation. Please try again.';
                translationError.style.display = 'block';
            } finally {
                translationLoader.style.display = 'none';
            }
        });
    }

    if (resetTranslationButton) {
        resetTranslationButton.addEventListener('click', function() {
            textToTranslate.value = '';
            translatedText.innerText = '';
            translationError.style.display = 'none';
            translationSuccess.style.display = 'none';
            translationLoader.style.display = 'none';
        });
    }

    // Stock Info Service
    const stockTickerInput = document.getElementById('stock-ticker-input');
    const getStockInfoButton = document.getElementById('get-stock-info-button');
    const stockInfoOutput = document.getElementById('stock-info-output');
    const stockInfoLoader = document.getElementById('stock-info-loader');
    const stockInfoError = document.getElementById('stock-info-error');
    const stockInfoSuccess = document.getElementById('stock-info-success');
    const resetStockInfoButton = document.getElementById('reset-stock-info-button');

    if (getStockInfoButton) {
        getStockInfoButton.addEventListener('click', async function() {
            const ticker = stockTickerInput.value.trim();
            stockInfoOutput.innerHTML = '';
            stockInfoError.style.display = 'none';
            stockInfoSuccess.style.display = 'none';
            stockInfoLoader.style.display = 'block';

            const tickerValidation = validateStockTicker(ticker);
            if (!tickerValidation.isValid) {
                stockInfoError.innerText = tickerValidation.message;
                stockInfoError.style.display = 'block';
                stockInfoLoader.style.display = 'none';
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:5000/stock_info?ticker=${ticker}`);
                const data = await response.json();

                if (response.ok) {
                    if (data.symbol) {
                        stockInfoOutput.innerHTML = `
                            <p><strong>Symbol:</strong> ${data.symbol}</p>
                            <p><strong>Company:</strong> ${data.longName || 'N/A'}</p>
                            <p><strong>Current Price:</strong> ${data.currentPrice ? data.currentPrice.toFixed(2) : 'N/A'}</p>
                            <p><strong>Previous Close:</strong> ${data.previousClose ? data.previousClose.toFixed(2) : 'N/A'}</p>
                            <p><strong>Open:</strong> ${data.open ? data.open.toFixed(2) : 'N/A'}</p>
                            <p><strong>Day High:</strong> ${data.dayHigh ? data.dayHigh.toFixed(2) : 'N/A'}</p>
                            <p><strong>Day Low:</strong> ${data.dayLow ? data.dayLow.toFixed(2) : 'N/A'}</p>
                            <p><strong>Volume:</strong> ${data.volume ? data.volume.toLocaleString() : 'N/A'}</p>
                            <p><strong>Market Cap:</strong> ${data.marketCap ? data.marketCap.toLocaleString() : 'N/A'} ${data.currency || ''}</p>
                        `;
                        stockInfoSuccess.innerText = 'Stock information fetched successfully!';
                        stockInfoSuccess.style.display = 'block';
                    } else {
                        stockInfoError.innerText = 'Stock not found or no data available.';
                        stockInfoError.style.display = 'block';
                    }
                } else {
                    stockInfoError.innerText = `Error: ${data.error || 'Failed to fetch stock information.'}`;
                    stockInfoError.style.display = 'block';
                }
            } catch (error) {
                console.error('Error fetching stock info:', error);
                stockInfoError.innerText = 'An error occurred while fetching stock information. Please try again.';
                stockInfoError.style.display = 'block';
            } finally {
                stockInfoLoader.style.display = 'none';
            }
        });
    }

    if (resetStockInfoButton) {
        resetStockInfoButton.addEventListener('click', function() {
            stockTickerInput.value = '';
            stockInfoOutput.innerHTML = '';
            stockInfoError.style.display = 'none';
            stockInfoSuccess.style.display = 'none';
            stockInfoLoader.style.display = 'none';
        });
    }

    // Stock Chart Service
    const chartTickerInput = document.getElementById('chart-ticker-input');
    const viewChartButton = document.getElementById('view-chart-button');
    const stockChartCanvas = document.getElementById('stock-chart');
    const chartLoader = document.getElementById('chart-loader');
    const chartError = document.getElementById('chart-error');
    const chartSuccess = document.getElementById('chart-success');
    const resetChartButton = document.getElementById('reset-chart-button');

    let stockChartInstance = null; // To store the Chart.js instance

    // Most Traded Stocks (Sample) functionality
    const sampleTickerButtons = document.querySelectorAll('.sample-ticker-button');
    sampleTickerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticker = this.dataset.ticker;
            stockTickerInput.value = ticker;
            chartTickerInput.value = ticker;
            getStockInfoButton.click(); // Trigger stock info fetch
            viewChartButton.click();    // Trigger chart view
        });
    });

    if (viewChartButton) {
        viewChartButton.addEventListener('click', async function() {
            const ticker = chartTickerInput.value.trim();
            chartError.style.display = 'none';
            chartSuccess.style.display = 'none';
            chartLoader.style.display = 'block';

            const tickerValidation = validateStockTicker(ticker);
            if (!tickerValidation.isValid) {
                chartError.innerText = tickerValidation.message;
                chartError.style.display = 'block';
                chartLoader.style.display = 'none';
                return;
            }

            try {
                // Fetch historical data (e.g., last 30 days)
                const response = await fetch(`http://127.0.0.1:5000/history?ticker=${ticker}`);
                const data = await response.json();

                if (response.ok && data.length > 0) {
                    const dates = data.map(item => item.Date);
                    const prices = data.map(item => item.Close);

                    // Destroy existing chart if it exists
                    if (stockChartInstance) {
                        stockChartInstance.destroy();
                    }

                    // Create new chart
                    stockChartInstance = new Chart(stockChartCanvas, {
                        type: 'line',
                        data: {
                            labels: dates,
                            datasets: [{
                                label: `${ticker} Stock Price`,
                                data: prices,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1,
                                fill: false
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    type: 'category',
                                    title: {
                                        display: true,
                                        text: 'Date'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Price (USD)'
                                    }
                                }
                            }
                        }
                    });
                    chartSuccess.innerText = 'Stock chart loaded successfully!';
                    chartSuccess.style.display = 'block';
                } else {
                    chartError.innerText = `Error: ${data.error || 'Failed to fetch chart data or no data available.'}`;
                    chartError.style.display = 'block';
                }
            } catch (error) {
                console.error('Error fetching chart data:', error);
                chartError.innerText = 'An error occurred while loading the chart. Please try again.';
                chartError.style.display = 'block';
            } finally {
                chartLoader.style.display = 'none';
            }
        });
    }

    if (resetChartButton) {
        resetChartButton.addEventListener('click', function() {
            chartTickerInput.value = '';
            if (stockChartInstance) {
                stockChartInstance.destroy();
                stockChartInstance = null;
            }
            chartError.style.display = 'none';
            chartSuccess.style.display = 'none';
            chartLoader.style.display = 'none';
        });
    }

    // Fraud Detection Service
    const transactionAmountInput = document.getElementById('transaction-amount');
    const transactionLocationInput = document.getElementById('transaction-location');
    const detectFraudButton = document.getElementById('detect-fraud-button');
    const fraudResult = document.getElementById('fraud-result');
    const fraudLoader = document.getElementById('fraud-loader');
    const fraudError = document.getElementById('fraud-error');
    const fraudSuccess = document.getElementById('fraud-success');
    const resetFraudButton = document.getElementById('reset-fraud-button');

    if (detectFraudButton) {
        detectFraudButton.addEventListener('click', async function() {
            const amount = parseFloat(transactionAmountInput.value.trim());
            const location = transactionLocationInput.value.trim();

            fraudResult.innerText = '';
            fraudError.style.display = 'none';
            fraudSuccess.style.display = 'none';
            fraudLoader.style.display = 'block';

            const amountValidation = validateAmount(amount);
            const locationValidation = validateLocation(location);

            if (!amountValidation.isValid) {
                fraudError.innerText = amountValidation.message;
                fraudError.style.display = 'block';
                fraudLoader.style.display = 'none';
                return;
            }

            if (!locationValidation.isValid) {
                fraudError.innerText = locationValidation.message;
                fraudError.style.display = 'block';
                fraudLoader.style.display = 'none';
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5000/detect_fraud', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount: amount, location: location })
                });
                const data = await response.json();

                if (response.ok) {
                    if (data.is_fraud) {
                        fraudResult.innerText = 'Fraud Detected!';
                        fraudResult.style.color = 'red';
                    } else {
                        fraudResult.innerText = 'No Fraud Detected.';
                        fraudResult.style.color = 'green';
                    }
                    fraudSuccess.innerText = 'Fraud detection completed!';
                    fraudSuccess.style.display = 'block';
                } else {
                    fraudError.innerText = `Error: ${data.error || 'Fraud detection failed.'}`;
                    fraudError.style.display = 'block';
                }
            } catch (error) {
                console.error('Error during fraud detection:', error);
                fraudError.innerText = 'An error occurred during fraud detection. Please try again.';
                fraudError.style.display = 'block';
            } finally {
                fraudLoader.style.display = 'none';
            }
        });
    }

    if (resetFraudButton) {
        resetFraudButton.addEventListener('click', function() {
            transactionAmountInput.value = '';
            transactionLocationInput.value = '';
            fraudResult.innerText = '';
            fraudResult.style.color = ''; // Reset color
            fraudError.style.display = 'none';
            fraudSuccess.style.display = 'none';
            fraudLoader.style.display = 'none';
        });
    }

    // Trading Maximization Service
    const pricesInput = document.getElementById('prices-input');
    const calculateProfitButton = document.getElementById('calculate-profit-button');
    const maxProfitOutput = document.getElementById('max-profit-output');
    const tradingLoader = document.getElementById('trading-loader');
    const tradingError = document.getElementById('trading-error');
    const tradingSuccess = document.getElementById('trading-success');
    const resetProfitButton = document.getElementById('reset-profit-button');

    if (calculateProfitButton) {
        calculateProfitButton.addEventListener('click', async function() {
            const pricesString = pricesInput.value.trim();
            maxProfitOutput.innerText = '';
            tradingError.style.display = 'none';
            tradingSuccess.style.display = 'none';
            tradingLoader.style.display = 'block';

            const pricesValidation = validatePricesList(prices);
            if (!pricesValidation.isValid) {
                tradingError.innerText = pricesValidation.message;
                tradingError.style.display = 'block';
                tradingLoader.style.display = 'none';
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5000/max_profit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prices: prices })
                });
                const data = await response.json();

                if (response.ok) {
                    maxProfitOutput.innerText = `Maximum Profit: ${data.max_profit.toFixed(2)}`;
                    tradingSuccess.innerText = 'Profit calculated successfully!';
                    tradingSuccess.style.display = 'block';
                } else {
                    tradingError.innerText = `Error: ${data.error || 'Failed to calculate profit.'}`;
                    tradingError.style.display = 'block';
                }
            } catch (error) {
                console.error('Error calculating max profit:', error);
                tradingError.innerText = 'An error occurred while calculating max profit. Please try again.';
                tradingError.style.display = 'block';
            } finally {
                tradingLoader.style.display = 'none';
            }
        });
    }

    if (resetProfitButton) {
        resetProfitButton.addEventListener('click', function() {
            pricesInput.value = '';
            maxProfitOutput.innerText = '';
            tradingError.style.display = 'none';
            tradingSuccess.style.display = 'none';
            tradingLoader.style.display = 'none';
        });
    }

    // Gemini AI Chat Service
    const aiChatInput = document.getElementById('ai-chat-input');
    const aiChatSendButton = document.getElementById('ai-chat-send');
    const chatHistory = document.getElementById('chat-history');
    const aiChatLoader = document.getElementById('ai-chat-loader');
    const aiChatError = document.getElementById('ai-chat-error');
    const resetAiChatButton = document.getElementById('reset-ai-chat-button');

    // Function to add a message to the chat history
    function addMessageToChat(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
        messageElement.innerText = message;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to bottom
    }

    if (aiChatSendButton) {
        aiChatSendButton.addEventListener('click', async function() {
            aiChatLoader.style.display = 'block';

            const messageValidation = validateMessage(message);
            if (!messageValidation.isValid) {
                aiChatError.innerText = messageValidation.message;
                aiChatError.style.display = 'block';
                aiChatLoader.style.display = 'none';
                return;
            }

            addMessageToChat(message, 'user');
            aiChatInput.value = ''; // Clear input
            aiChatError.style.display = 'none';
            aiChatLoader.style.display = 'block';

            try {
                // For demonstration, using a fixed user_id. In a real app, this would be dynamic.
                const user_id = 'demo_user_123';
                const response = await fetch('http://127.0.0.1:5000/ask_ai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_id: user_id, message: message })
                });
                const data = await response.json();

                if (response.ok) {
                    addMessageToChat(data.response, 'ai');
                } else {
                    aiChatError.innerText = `Error: ${data.error || 'Failed to get response from AI.'}`;
                    aiChatError.style.display = 'block';
                }
            } catch (error) {
                console.error('Error during AI chat:', error);
                aiChatError.innerText = 'An error occurred during AI chat. Please try again.';
                aiChatError.style.display = 'block';
            } finally {
                aiChatLoader.style.display = 'none';
            }
        });
    }

    if (resetAiChatButton) {
        resetAiChatButton.addEventListener('click', function() {
            chatHistory.innerHTML = ''; // Clear chat history
            aiChatInput.value = '';
            aiChatError.style.display = 'none';
            aiChatLoader.style.display = 'none';
        });
    }
});