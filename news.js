document.addEventListener('DOMContentLoaded', function() {
    const newsTopicInput = document.getElementById('news-topic-input');
    const fetchNewsButton = document.getElementById('fetch-news-button');
    const newsResultsContainer = document.getElementById('news-results-container');
    const newsLoader = document.getElementById('news-loader');
    const newsError = document.getElementById('news-error');

    const NEWS_API_KEY = 'YOUR_NEWS_API_KEY'; // Replace with your actual News API key

    async function fetchTrendingNews() {
        newsResultsContainer.innerHTML = '';
        newsError.style.display = 'none';
        newsLoader.style.display = 'block';

        if (NEWS_API_KEY === 'Google_API_KEY') {
            newsError.innerText = 'Please replace YOUR_NEWS_API_KEY in news.js with your actual News API key.';
            newsError.style.display = 'block';
            newsLoader.style.display = 'none';
            return;
        }

        try {
            const articles = await fetchNews('technology', true);
            if (articles.length > 0) {
                displayNews([articles[0]]);
            } else {
                newsError.innerText = 'No trending news found.';
                newsError.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching trending news:', error);
            newsError.innerText = 'An error occurred while fetching trending news. Please check the console for details.';
            newsError.style.display = 'block';
        } finally {
            newsLoader.style.display = 'none';
        }
    }

    fetchTrendingNews();

    if (fetchNewsButton) {
        fetchNewsButton.addEventListener('click', async function() {
            const topic = newsTopicInput.value.trim();

            newsResultsContainer.innerHTML = '';
            newsError.style.display = 'none';
            newsLoader.style.display = 'block';

            if (topic.length === 0) {
                newsError.innerText = 'Please enter a topic to search for news.';
                newsError.style.display = 'block';
                newsLoader.style.display = 'none';
                return;
            }

            if (NEWS_API_KEY === 'Google_API_KEY') {
                newsError.innerText = 'Please replace YOUR_NEWS_API_KEY in news.js with your actual News API key.';
                newsError.style.display = 'block';
                newsLoader.style.display = 'none';
                return;
            }

            try {
                const articles = await fetchNews(topic);
                if (articles.length > 0) {
                    displayNews(articles);
                } else {
                    newsError.innerText = `No news found for \'${topic}\'.`;
                    newsError.style.display = 'block';
                }
            } catch (error) {
                console.error('Error fetching news:', error);
                newsError.innerText = 'An error occurred while fetching news. Please check the console for details.';
                newsError.style.display = 'block';
            } finally {
                newsLoader.style.display = 'none';
            }
        });
    }

    async function fetchNews(topic, isTrending = false) {
        let url = `https://newsapi.org/v2/`;
        if (isTrending) {
            url += `top-headlines?country=us&category=${encodeURIComponent(topic)}&apiKey=${NEWS_API_KEY}&pageSize=1`;
        } else {
            url += `everything?q=${encodeURIComponent(topic)}&apiKey=${NEWS_API_KEY}&pageSize=10&sortBy=publishedAt`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch news');
        }
        const data = await response.json();
        return data.articles;
    }

    function displayNews(articles) {
        articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('news-article');

            const sentimentPlaceholder = `<span>Loading sentiment...</span>`;

            articleElement.innerHTML = `
                <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                <p><strong>Source:</strong> ${article.source.name}</p>
                <p>${article.description || 'No description available.'}</p>
                <div class="sentiment-analysis">
                    <strong>Sentiment:</strong> <span class="sentiment-score">${sentimentPlaceholder}</span>
                </div>
                <button class="summarize-button">Summarize</button>
                <div class="summary-container" style="display: none;"></div>
            `;

            newsResultsContainer.appendChild(articleElement);

            // Add event listener for the summarize button
            const summarizeButton = articleElement.querySelector('.summarize-button');
            const summaryContainer = articleElement.querySelector('.summary-container');
            summarizeButton.addEventListener('click', () => summarizeArticle(article.url, summaryContainer));

            // Analyze sentiment for the article description
            analyzeSentiment(article.description || '', articleElement.querySelector('.sentiment-score'));
        });
    }

    async function summarizeArticle(url, container) {
        container.style.display = 'block';
        container.innerHTML = '<p class="loader-message">Summarizing...</p>';

        try {
            const response = await fetch('http://127.0.0.1:5000/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
            });

            const data = await response.json();

            if (response.ok) {
                container.innerHTML = `<p><strong>AI Summary:</strong> ${data.summary}</p>`;
            } else {
                container.innerHTML = `<p class="error-message">Error: ${data.error || 'Failed to summarize.'}</p>`;
            }
        } catch (error) {
            console.error('Error summarizing article:', error);
            container.innerHTML = `<p class="error-message">An error occurred while summarizing.</p>`;
        }
    }

    async function analyzeSentiment(text, sentimentElement) {
        try {
            const response = await fetch('http://127.0.0.1:5000/sentiment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();

            if (response.ok) {
                const sentiment = data.sentiment;
                let sentimentText = 'Neutral';
                let sentimentColor = '#6c757d'; // Gray for Neutral

                if (sentiment > 0.1) {
                    sentimentText = 'Positive';
                    sentimentColor = '#28a745'; // Green for Positive
                } else if (sentiment < -0.1) {
                    sentimentText = 'Negative';
                    sentimentColor = '#dc3545'; // Red for Negative
                }

                sentimentElement.textContent = sentimentText;
                sentimentElement.style.color = sentimentColor;
            } else {
                sentimentElement.textContent = 'Error';
            }
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            sentimentElement.textContent = 'Error';
        }
    }
});