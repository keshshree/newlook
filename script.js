

document.getElementById('translate-button').addEventListener('click', async function() {
    const text = document.getElementById('text-to-translate').value;
    const targetLanguage = document.getElementById('target-language').value;
    const translatedTextElement = document.getElementById('translated-text');

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
        } else if (data.error) {
            translatedTextElement.innerText = `Error: ${data.error}`;
        } else {
            translatedTextElement.innerText = 'Unexpected response from server.';
        }
    } catch (error) {
        console.error('Error translating text:', error);
        translatedTextElement.innerText = 'Failed to translate text. Check console for details.';
    }
});

document.getElementById('get-stock-info-button').addEventListener('click', async function() {
    const ticker = document.getElementById('stock-ticker-input').value.toUpperCase();
    const stockInfoOutput = document.getElementById('stock-info-output');

    stockInfoOutput.innerHTML = ''; // Clear previous results

    try {
        const response = await fetch(`http://127.0.0.1:5000/stock_info?ticker=${ticker}`);
        const data = await response.json();

        if (data.error) {
            stockInfoOutput.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
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
        } else {
            stockInfoOutput.innerHTML = '<p>No stock information found for this ticker.</p>';
        }
    } catch (error) {
        console.error('Error fetching stock info:', error);
        stockInfoOutput.innerHTML = '<p style="color: red;">Failed to fetch stock information.</p>';
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
    const predictionResult = document.getElementById('prediction-result');

    predictError.innerText = '';
    predictionResult.innerText = '';
    predictLoader.style.display = 'block';

    try {
        const response = await fetch(`http://127.0.0.1:5000/predict?ticker=${ticker}`);
        const data = await response.json();

        if (data.prediction && data.prediction.length > 0) {
            predictionResult.innerText = `Predicted next value for ${ticker}: ${data.prediction[0].toFixed(2)}`;
        } else {
            predictError.innerText = 'Could not get prediction for this ticker. Please try another.';
        }
    } catch (error) {
        console.error('Error fetching prediction:', error);
        predictError.innerText = 'Failed to get prediction. Please check the ticker and try again.';
    } finally {
        predictLoader.style.display = 'none';
    }
});

document.getElementById('analyze-sentiment-button').addEventListener('click', async function() {
    const text = document.getElementById('sentiment-text').value;
    const sentimentLoader = document.getElementById('sentiment-loader');
    const sentimentError = document.getElementById('sentiment-error');
    const sentimentResult = document.getElementById('sentiment-result');

    sentimentError.innerText = '';
    sentimentResult.innerText = '';
    sentimentLoader.style.display = 'block';

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
        } else {
            sentimentError.innerText = 'Could not analyze sentiment. Please try again.';
        }
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        sentimentError.innerText = 'Failed to analyze sentiment. Please try again.';
    } finally {
        sentimentLoader.style.display = 'none';
    }
});


document.getElementById('get-recommendations-button').addEventListener('click', async function() {
    const preference = document.getElementById('user-preference').value;
    const recommendationLoader = document.getElementById('recommendation-loader');
    const recommendationError = document.getElementById('recommendation-error');
    const recommendationList = document.getElementById('recommendation-list');

    recommendationError.innerText = '';
    recommendationList.innerHTML = '';
    recommendationLoader.style.display = 'block';

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
        } else {
            recommendationError.innerText = 'No recommendations found for this preference. Please try another.';
        }
    } catch (error) {
        console.error('Error getting recommendations:', error);
        recommendationError.innerText = 'Failed to get recommendations. Please try again.';
    } finally {
        recommendationLoader.style.display = 'none';
    }
});

document.getElementById('validate-card-button').addEventListener('click', async function() {
    const cardNumber = document.getElementById('card-number-input').value;
    const cardValidatorLoader = document.getElementById('card-validator-loader');
    const cardValidatorError = document.getElementById('card-validator-error');
    const cardValidationResult = document.getElementById('card-validation-result');

    cardValidatorError.innerText = '';
    cardValidationResult.innerText = '';
    cardValidatorLoader.style.display = 'block';

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
        } else {
            cardValidatorError.innerText = 'Could not validate card. Please try again.';
        }
    } catch (error) {
        console.error('Error validating card:', error);
        cardValidatorError.innerText = 'Failed to validate card. Please try again.';
    } finally {
        cardValidatorLoader.style.display = 'none';
    }
});

document.getElementById('detect-fraud-button').addEventListener('click', async function() {
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const location = document.getElementById('transaction-location').value;
    const fraudDetectionLoader = document.getElementById('fraud-detection-loader');
    const fraudDetectionError = document.getElementById('fraud-detection-error');
    const fraudDetectionResult = document.getElementById('fraud-detection-result');

    fraudDetectionError.innerText = '';
    fraudDetectionResult.innerText = '';
    fraudDetectionLoader.style.display = 'block';

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
        } else {
            fraudDetectionError.innerText = 'Could not detect fraud. Please try again.';
        }
    } catch (error) {
        console.error('Error detecting fraud:', error);
        fraudDetectionError.innerText = 'Failed to detect fraud. Please try again.';
    } finally {
        fraudDetectionLoader.style.display = 'none';
    }
});
