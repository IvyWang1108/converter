// Initialize the map centered on Antarctica
const map = L.map('map').setView([-70, 0], 3);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add a custom whale icon
const whaleIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjMWE1Mjc2IiBkPSJNNDQ4IDI1NmMwIDEwNi4wMzktODUuOTYxIDE5Mi0xOTIgMTkyUzY0IDM2Mi4wMzkgNjQgMjU2UzE0OS45NjEgNjQgMjU2IDY0czE5MiA4NS45NjEgMTkyIDE5MnoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzg0IDI1NmMwIDcwLjY5My01Ny4zMDggMTI4LTEyOCAxMjhTMTI4IDMyNi42OTMgMTI4IDI1NnM1Ny4zMDgtMTI4IDEyOC0xMjhzMTI4IDU3LjMwNyAxMjggMTI4eiIvPjxwYXRoIGZpbGw9IiMxYTI3MzYiIGQ9Ik0zNTIgMjU2YzAgNTMuMDI5LTQyLjk3MSA5Ni05NiA5NnMtOTYtNDIuOTcxLTk2LTk2IDQyLjk3MS05NiA5Ni05NiA5NiA0Mi45NzEgOTYgOTZ6Ii8+PGNpcmNsZSBjeD0iMjI0IiBjeT0iMjI0IiByPSIxNiIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjI4OCIgY3k9IjIyNCIgcj0iMTYiIGZpbGw9IiNmZmYiLz48cGF0aCBmaWxsPSIjMWEyNzM2IiBkPSJNMjU2IDI4OGMxNy42NjcgMCAzMi0xNC4zMzMgMzItMzJoLTY0YzAgMTcuNjY3IDE0LjMzMyAzMiAzMiAzMnoiLz48L3N2Zz4=',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// Store markers and sightings data
let markers = [];
let sightingsData = [];

// Function to fetch whale sightings data from GBIF
async function fetchWhaleSightings() {
    try {
        // Using GBIF API to fetch humpback whale occurrences in the Antarctic region
        const response = await fetch('https://api.gbif.org/v1/occurrence/search?taxon_key=2420683&decimalLatitude=-90,-60&limit=50&hasCoordinate=true&hasGeospatialIssue=false');
        const data = await response.json();
        
        if (data && data.results) {
            processSightings(data.results);
        } else {
            showError('No whale sightings data available at the moment.');
        }
    } catch (error) {
        console.error('Error fetching whale sightings:', error);
        showError('Failed to load whale sightings. Please try again later.');
    }
}

// Process and display sightings
function processSightings(sightings) {
    // Clear previous markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    sightingsData = [];
    
    // Clear sightings list
    const sightingsList = document.getElementById('sightings-list');
    sightingsList.innerHTML = '';
    
    if (sightings.length === 0) {
        sightingsList.innerHTML = '<div class="loading">No recent whale sightings found.</div>';
        return;
    }
    
    // Process each sighting
    sightings.forEach(sighting => {
        if (sighting.decimalLatitude && sighting.decimalLongitude) {
            const lat = parseFloat(sighting.decimalLatitude);
            const lng = parseFloat(sighting.decimalLongitude);
            const date = sighting.eventDate ? new Date(sighting.eventDate).toLocaleDateString() : 'Date not specified';
            const location = sighting.locality || 'Location not specified';
            const scientificName = sighting.scientificName || 'Megaptera novaeangliae';
            const recordedBy = sighting.recordedBy || 'Unknown observer';
            
            // Create marker
            const marker = L.marker([lat, lng], { icon: whaleIcon })
                .addTo(map)
                .bindPopup(`
                    <strong>${scientificName}</strong><br>
                    ${location}<br>
                    <small>${date}</small><br>
                    <small>Recorded by: ${recordedBy}</small>
                `);
            
            markers.push(marker);
            
            // Add to sightings list
            const sightingCard = document.createElement('div');
            sightingCard.className = 'sighting-card';
            sightingCard.innerHTML = `
                <h4>${scientificName}</h4>
                <p>📍 ${location}</p>
                <p>📅 ${date}</p>
                <p>👤 ${recordedBy}</p>
            `;
            
            // Center map on click
            sightingCard.addEventListener('click', () => {
                map.setView([lat, lng], 6);
                marker.openPopup();
            });
            
            sightingsList.appendChild(sightingCard);
            
            // Store for filtering/sorting
            sightingsData.push({
                lat,
                lng,
                date,
                location,
                scientificName,
                recordedBy
            });
        }
    });
    
    // Fit map to show all markers
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Show error message
function showError(message) {
    const sightingsList = document.getElementById('sightings-list');
    sightingsList.innerHTML = `<div class="error">${message}</div>`;
}

// Initialize the application
function init() {
    // Set map view to show Antarctica
    map.setView([-75, 0], 2);
    
    // Add attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add a custom tile layer for better visualization of Antarctica
    L.tileLayer('https://tiles.arcgis.com/arcgis/rest/services/Polar/Antarctic_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri'
    }).addTo(map);
    
    // Fetch whale sightings data
    fetchWhaleSightings();
    
    // Set up auto-refresh every 5 minutes
    setInterval(fetchWhaleSightings, 5 * 60 * 1000);
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
