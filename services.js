document.getElementById('translate-button').addEventListener('click', async function() {
    const text = document.getElementById('text-to-translate').value;
    const targetLanguage = document.getElementById('target-language').value;
    const translatedTextElement = document.getElementById('translated-text');
    const translationLoader = document.getElementById('translation-loader');
    const translationError = document.getElementById('translation-error');
    const translationSuccess = document.getElementById('translation-success');

    // Clear previous messages
    translatedTextElement.innerText = '';
    translationError.innerText = '';
    translationSuccess.innerText = '';
    translationLoader.style.display = 'block'; // Show loader

    try {
        console.log('Sending translation request...');
        const response = await fetch(`http://127.0.0.1:5000/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text, target_language: targetLanguage })
        });
        console.log('Received response:', response);
        const data = await response.json();
        console.log('Parsed data:', data);

        if (data.translated_text) {
            translatedTextElement.innerText = data.translated_text;
            translationSuccess.innerText = 'Translation successful!';
            translationSuccess.style.display = 'block';
        } else if (data.error) {
            translationError.innerText = `Error: ${data.error}`;
            translationError.style.display = 'block';
        } else {
            translationError.innerText = 'Unexpected response from server.';
            translationError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error translating text:', error);
        translationError.innerText = 'Failed to translate text. Check console for details.';
        translationError.style.display = 'block';
    } finally {
        translationLoader.style.display = 'none'; // Hide loader
    }
});

document.getElementById('get-stock-info-button').addEventListener('click', async function() {
    const ticker = document.getElementById('stock-ticker-input').value.toUpperCase();
    const stockInfoOutput = document.getElementById('stock-info-output');
    const stockInfoLoader = document.getElementById('stock-info-loader');
    const stockInfoError = document.getElementById('stock-info-error');
    const stockInfoSuccess = document.getElementById('stock-info-success');

    // Clear previous messages
    stockInfoOutput.innerHTML = '';
    stockInfoError.innerText = '';
    stockInfoSuccess.innerText = '';
    stockInfoLoader.style.display = 'block'; // Show loader

    try {
        const response = await fetch(`http://127.0.0.1:5000/stock_info?ticker=${ticker}`);
        const data = await response.json();

        if (data.error) {
            stockInfoError.innerText = `Error: ${data.error}`;
            stockInfoError.style.display = 'block';
        } else if (data.symbol) {
            stockInfoOutput.innerHTML = `
                <p><strong>${data.longName} (${data.symbol})</strong></p>
                <p>Current Price: ${data.currentPrice} ${data.currency}</p>
                <p>Previous Close: ${data.previousClose} ${data.currency}</p>
                <p>Open: ${data.open} ${data.currency}</p>
                <p>Day High: ${data.dayHigh} ${data.currency}</p>
                <p>Day Low: ${data.dayLow} ${data.currency}</p>
                <p>Volume: ${data.volume}</p>
                <p>Market Cap: ${data.marketCap} ${data.currency}</p>
            `;
            stockInfoSuccess.innerText = 'Stock information fetched successfully!';
            stockInfoSuccess.style.display = 'block';
        } else {
            stockInfoError.innerText = 'No stock information found for this ticker.';
            stockInfoError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching stock info:', error);
        stockInfoError.innerText = 'Failed to fetch stock information.';
        stockInfoError.style.display = 'block';
    } finally {
        stockInfoLoader.style.display = 'none'; // Hide loader
    }
});

let stockChart;

document.getElementById('view-chart-button').addEventListener('click', async function() {
    const ticker = document.getElementById('chart-ticker-input').value.toUpperCase();
    const chartLoader = document.getElementById('chart-loader');
    const chartError = document.getElementById('chart-error');
    const chartCanvas = document.getElementById('stock-chart');

    chartError.innerText = '';
    chartLoader.style.display = 'block';

    try {
        const response = await fetch(`http://127.0.0.1:5000/history?ticker=${ticker}`);
        const data = await response.json();

        if (data.length === 0) {
            chartError.innerText = 'No data found for this ticker. Please try another.';
            chartCanvas.style.display = 'none';
            return;
        }

        chartCanvas.style.display = 'block';
        const dates = data.map(item => item.Date);
        const prices = data.map(item => item.Close);

        if (stockChart) {
            stockChart.destroy(); // Destroy existing chart before creating a new one
        }

        const ctx = chartCanvas.getContext('2d');
        stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: `${ticker} Stock Price`,
                    data: prices,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching chart data:', error);
        chartError.innerText = 'Failed to load chart data. Please check the ticker and try again.';
        chartCanvas.style.display = 'none';
    } finally {
        chartLoader.style.display = 'none';
    }
});





document.getElementById('predict-button').addEventListener('click', async function() {
    const ticker = document.getElementById('predict-ticker-input').value.toUpperCase();
    const predictLoader = document.getElementById('predict-loader');
    const predictError = document.getElementById('predict-error');
    const predictSuccess = document.getElementById('predict-success');
    const predictionResult = document.getElementById('prediction-result');

    // Clear previous messages
    predictError.innerText = '';
    predictSuccess.innerText = '';
    predictionResult.innerText = '';
    predictLoader.style.display = 'block'; // Show loader

    try {
        const response = await fetch(`http://127.0.0.1:5000/predict?ticker=${ticker}`);
        const data = await response.json();

        if (data.prediction && data.prediction.length > 0) {
            predictionResult.innerText = `Predicted next value for ${ticker}: ${data.prediction[0].toFixed(2)}`;
            predictSuccess.innerText = 'Prediction successful!';
            predictSuccess.style.display = 'block';
        } else {
            predictError.innerText = 'Could not get prediction for this ticker. Please try another.';
            predictError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching prediction:', error);
        predictError.innerText = 'Failed to get prediction. Please check the ticker and try again.';
        predictError.style.display = 'block';
    } finally {
        predictLoader.style.display = 'none'; // Hide loader
    }
});

document.getElementById('analyze-sentiment-button').addEventListener('click', async function() {
    const text = document.getElementById('sentiment-text').value;
    const sentimentLoader = document.getElementById('sentiment-loader');
    const sentimentError = document.getElementById('sentiment-error');
    const sentimentSuccess = document.getElementById('sentiment-success');
    const sentimentResult = document.getElementById('sentiment-result');

    // Clear previous messages
    sentimentError.innerText = '';
    sentimentSuccess.innerText = '';
    sentimentResult.innerText = '';
    sentimentLoader.style.display = 'block'; // Show loader

    try {
        const response = await fetch(`http://127.0.0.1:5000/sentiment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
        });
        const data = await response.json();

        if (data.sentiment) {
            sentimentResult.innerText = `Sentiment: ${data.sentiment}`;
            sentimentSuccess.innerText = 'Sentiment analysis successful!';
            sentimentSuccess.style.display = 'block';
        } else {
            sentimentError.innerText = 'Could not analyze sentiment. Please try again.';
            sentimentError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        sentimentError.innerText = 'Failed to analyze sentiment. Please try again.';
        sentimentError.style.display = 'block';
    } finally {
        sentimentLoader.style.display = 'none'; // Hide loader
    }
});


document.getElementById('get-recommendations-button').addEventListener('click', async function() {
    const preference = document.getElementById('user-preference').value;
    const recommendationLoader = document.getElementById('recommendation-loader');
    const recommendationError = document.getElementById('recommendation-error');
    const recommendationSuccess = document.getElementById('recommendation-success');
    const recommendationList = document.getElementById('recommendation-list');

    // Clear previous messages
    recommendationError.innerText = '';
    recommendationSuccess.innerText = '';
    recommendationList.innerHTML = '';
    recommendationLoader.style.display = 'block'; // Show loader

    try {
        const response = await fetch(`http://127.0.0.1:5000/recommend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ preference: preference })
        });
        const data = await response.json();

        if (data.recommendations && data.recommendations.length > 0) {
            data.recommendations.forEach(item => {
                const li = document.createElement('li');
                li.innerText = item;
                recommendationList.appendChild(li);
            });
            recommendationSuccess.innerText = 'Recommendations fetched successfully!';
            recommendationSuccess.style.display = 'block';
        } else {
            recommendationError.innerText = 'No recommendations found for this preference. Please try another.';
            recommendationError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error getting recommendations:', error);
        recommendationError.innerText = 'Failed to get recommendations. Please try again.';
        recommendationError.style.display = 'block';
    } finally {
        recommendationLoader.style.display = 'none'; // Hide loader
    }
});

document.getElementById('validate-card-button').addEventListener('click', async function() {
    const cardNumber = document.getElementById('card-number-input').value;
    const cardValidatorLoader = document.getElementById('card-validator-loader');
    const cardValidatorError = document.getElementById('card-validator-error');
    const cardValidatorSuccess = document.getElementById('card-validator-success');
    const cardValidationResult = document.getElementById('card-validation-result');

    // Clear previous messages
    cardValidatorError.innerText = '';
    cardValidatorSuccess.innerText = '';
    cardValidationResult.innerText = '';
    cardValidatorLoader.style.display = 'block'; // Show loader

    try {
        const response = await fetch(`http://127.0.0.1:5000/validate_card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ card_number: cardNumber })
        });
        const data = await response.json();

        if (data.is_valid !== undefined) {
            cardValidationResult.innerText = `Card is ${data.is_valid ? 'Valid' : 'Invalid'}`;
            cardValidatorSuccess.innerText = 'Card validation complete!';
            cardValidatorSuccess.style.display = 'block';
        } else {
            cardValidatorError.innerText = 'Could not validate card. Please try again.';
            cardValidatorError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error validating card:', error);
        cardValidatorError.innerText = 'Failed to validate card. Please try again.';
        cardValidatorError.style.display = 'block';
    } finally {
        cardValidatorLoader.style.display = 'none'; // Hide loader
    }
});

document.getElementById('detect-fraud-button').addEventListener('click', async function() {
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const location = document.getElementById('transaction-location').value;
    const fraudDetectionLoader = document.getElementById('fraud-detection-loader');
    const fraudDetectionError = document.getElementById('fraud-detection-error');
    const fraudDetectionSuccess = document.getElementById('fraud-detection-success');
    const fraudDetectionResult = document.getElementById('fraud-detection-result');

    // Clear previous messages
    fraudDetectionError.innerText = '';
    fraudDetectionSuccess.innerText = '';
    fraudDetectionResult.innerText = '';
    fraudDetectionLoader.style.display = 'block'; // Show loader

    try {
        const response = await fetch(`http://127.0.0.1:5000/detect_fraud`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: amount, location: location })
        });
        const data = await response.json();

        if (data.is_fraud !== undefined) {
            fraudDetectionResult.innerText = `Fraudulent Transaction: ${data.is_fraud ? 'Yes' : 'No'}`;
            fraudDetectionSuccess.innerText = 'Fraud detection complete!';
            fraudDetectionSuccess.style.display = 'block';
        } else {
            fraudDetectionError.innerText = 'Could not detect fraud. Please try again.';
            fraudDetectionError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error detecting fraud:', error);
        fraudDetectionError.innerText = 'Failed to detect fraud. Please try again.';
        fraudDetectionError.style.display = 'block';
    } finally {
        fraudDetectionLoader.style.display = 'none'; // Hide loader
    }
});

// AI Chat functionality
const chatHistory = document.getElementById('chat-history');
const aiChatInput = document.getElementById('ai-chat-input');
const aiChatSendButton = document.getElementById('ai-chat-send');
const aiChatLoader = document.getElementById('ai-chat-loader');
const aiChatError = document.getElementById('ai-chat-error');

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.classList.add(`${sender}-message`);
    messageElement.innerText = message;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to bottom
}

aiChatSendButton.addEventListener('click', async function() {
    const userMessage = aiChatInput.value.trim();
    if (!userMessage) return;

    aiChatInput.value = ''; // Clear input
    aiChatError.style.display = 'none';
    aiChatLoader.style.display = 'block';

    appendMessage('user', userMessage);

    try {
        // Use the user's email as user_id for the AI chat session
        const userEmail = localStorage.getItem('userEmail'); // Assuming email is stored after MFA
        if (!userEmail) {
            aiChatError.innerText = 'User not authenticated. Please complete MFA.';
            aiChatError.style.display = 'block';
            return;
        }

        const response = await fetch(`http://127.0.0.1:5000/ask_ai`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userEmail, message: userMessage })
        });
        const data = await response.json();

        if (data.response) {
            appendMessage('ai', data.response);
        } else if (data.error) {
            aiChatError.innerText = `AI Error: ${data.error}`;
            aiChatError.style.display = 'block';
        } else {
            aiChatError.innerText = 'Unexpected response from AI.';
            aiChatError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error communicating with AI:', error);
        aiChatError.innerText = 'Failed to get response from AI. Check console for details.';
        aiChatError.style.display = 'block';
    } finally {
        aiChatLoader.style.display = 'none';
    }
});

// Trading Profit Maximization functionality
const pricesInput = document.getElementById('prices-input');
const calculateProfitButton = document.getElementById('calculate-profit-button');
const maxProfitOutput = document.getElementById('max-profit-output');
const tradingLoader = document.getElementById('trading-loader');
const tradingError = document.getElementById('trading-error');
const tradingSuccess = document.getElementById('trading-success');

calculateProfitButton.addEventListener('click', async function() {
    const pricesString = pricesInput.value.trim();
    tradingError.style.display = 'none';
    tradingSuccess.style.display = 'none';
    maxProfitOutput.innerText = '';

    if (!pricesString) {
        tradingError.innerText = 'Please enter stock prices.';
        tradingError.style.display = 'block';
        return;
    }

    const prices = pricesString.split(',').map(price => parseFloat(price.trim()));

    if (prices.some(isNaN)) {
        tradingError.innerText = 'Invalid input. Please enter comma-separated numbers.';
        tradingError.style.display = 'block';
        return;
    }

    tradingLoader.style.display = 'block';

    try {
        const response = await fetch(`http://127.0.0.1:5000/max_profit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prices: prices })
        });
        const data = await response.json();

        if (data.max_profit !== undefined) {
            maxProfitOutput.innerText = `Maximum Profit: $${data.max_profit.toFixed(2)}`;
            tradingSuccess.innerText = 'Calculation successful!';
            tradingSuccess.style.display = 'block';
        } else if (data.error) {
            tradingError.innerText = `Error: ${data.error}`;
            tradingError.style.display = 'block';
        } else {
            tradingError.innerText = 'Unexpected response from server.';
            tradingError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error calculating max profit:', error);
        tradingError.innerText = 'Failed to calculate max profit. Check console for details.';
        tradingError.style.display = 'block';
    } finally {
        tradingLoader.style.display = 'none';
    }
});