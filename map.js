
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    const map = L.map('map').setView([51.505, -0.09], 13);

    // Add a tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker to the map
    L.marker([51.505, -0.09]).addTo(map)
        .bindPopup('A sample marker on the map.')
        .openPopup();

    // Function to search for a location
    function searchLocation() {
        const searchInput = document.getElementById('location-search-input');
        const query = searchInput.value.trim();

        if (query.length === 0) {
            alert('Please enter a location to search.');
            return;
        }

        // Use Google Maps Geocoding API to find the location's coordinates
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': query }, function(results, status) {
            if (status === 'OK') {
                const location = results[0].geometry.location;
                const lat = location.lat();
                const lon = location.lng();
                map.setView([lat, lon], 13);
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`You searched for: ${query}`)
                    .openPopup();
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    // Attach event listener to the search button
    const searchButton = document.getElementById('location-search-button');
    if (searchButton) {
        searchButton.addEventListener('click', searchLocation);
    }

    // Accident Prediction
    const predictAccidentButton = document.getElementById('predict-accident-button');
    const predictLatInput = document.getElementById('predict-lat');
    const predictLngInput = document.getElementById('predict-lng');
    const predictWeatherInput = document.getElementById('predict-weather');
    const predictHourInput = document.getElementById('predict-hour');
    const predictionOutput = document.getElementById('accident-prediction-output');
    const predictionLoader = document.getElementById('accident-prediction-loader');
    const predictionError = document.getElementById('accident-prediction-error');

    if (predictAccidentButton) {
        predictAccidentButton.addEventListener('click', async () => {
            const latitude = parseFloat(predictLatInput.value);
            const longitude = parseFloat(predictLngInput.value);
            const weatherCondition = predictWeatherInput.value.trim();
            const hourOfDay = parseInt(predictHourInput.value, 10);

            predictionOutput.innerHTML = '';
            predictionError.style.display = 'none';
            predictionLoader.style.display = 'block';

            if (isNaN(latitude) || isNaN(longitude) || !weatherCondition || isNaN(hourOfDay) || hourOfDay < 0 || hourOfDay > 23) {
                predictionError.innerText = 'Please enter valid input for all fields.';
                predictionError.style.display = 'block';
                predictionLoader.style.display = 'none';
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:5000/predict_accident`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        latitude: latitude,
                        longitude: longitude,
                        weather_condition: weatherCondition,
                        hour_of_day: hourOfDay
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    let resultHtml = '<h4>Accident Probability by Severity:</h4><ul>';
                    for (const severity in data) {
                        if (severity.startsWith('severity_')) {
                            resultHtml += `<li>${severity.replace('severity_', 'Severity ')}: ${(data[severity] * 100).toFixed(2)}%</li>`;
                        }
                    }
                    resultHtml += '</ul>';
                    predictionOutput.innerHTML = resultHtml;
                } else {
                    predictionError.innerText = `Error: ${data.error}`;
                    predictionError.style.display = 'block';
                }
            } catch (err) {
                console.error('Error predicting accident:', err);
                predictionError.innerText = 'Failed to get accident prediction. Please try again later.';
                predictionError.style.display = 'block';
            } finally {
                predictionLoader.style.display = 'none';
            }
        });
    }
});
