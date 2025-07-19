
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
});
