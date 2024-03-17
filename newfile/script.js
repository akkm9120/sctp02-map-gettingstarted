let singapore = [1.290270, 103.851959];
let map;
let cities; // Ensure you have defined 'cities' somewhere in your code
let circle = null;

document.addEventListener("DOMContentLoaded", async function () {
    // Initialize the map on the 'SingaporeMap' div
    map = L.map('SingaporeMap').setView(singapore, 12);

    let singaporeMarker = L.marker(singapore, { icon: singaporePin }).addTo(map);
    singaporeMarker.bindPopup("Welcome to Singapore! 🇸🇬").openPopup();


    map.on('zoomend', function () {
        if (map.getZoom() >= 15) {
            singaporeMarker.setOpacity(0); // Hide the marker when zoomed in beyond a certain level
        } else if (map.getZoom() < 10) {
            singaporeMarker.setOpacity(0);
        }
        else {
            singaporeMarker.setOpacity(1); // Show the marker when zoomed out
        }
    });

    let map1 = L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Grey/{z}/{x}/{y}.png', {
        detectRetina: true,
        maxZoom: 19,
        minZoom: 11,
    }).addTo(map);

    let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    });

    let osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
    });
    let baseMaps = {
        "map1": map1,
        "OpenStreetMap": osm,
        "Food,Drink&taxi": osmHOT
    };


    const response = await axios.get('data/Hotels.geojson');
    let markers = L.markerClusterGroup();



    for (let feature of response.data.features) {
        // Create a new marker
        let marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { icon: hotelIcon });

        // Bind a popup to the marker
        marker.bindPopup(`${feature.properties.Description}`);

        // Add the marker to the markers group
        markers.addLayer(marker);
    }

    let overlayMaps = {
        "Hotels": markers // This will add the 'cities' layer to the overlay maps
    };
    L.control.layers(baseMaps, overlayMaps).addTo(map);

})


document.getElementById("searchbtn").addEventListener('click', async () => {
    const searchTerms = document.querySelector("#searchin").value;

    const centerPoint = map.getBounds().getCenter();
    const data = await search(centerPoint.lat, centerPoint.lng, searchTerms);

    addMarkersToMap(data, searchLayer, map);
});

function removeCircle() {
    if (circle) {
        map.removeLayer(circle);
        circle = null;
    }
}

document.querySelector("#btnDirection").addEventListener('click', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            axios.get(`https://api.mapbox.com/directions/v5/mapbox/cycling/${longitude},${latitude};103.846878,1.284390?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoiYWttLTAwMSIsImEiOiJjbHFmY3kyMmIweHBxMnFxZjlnajZlbnBzIn0.q0Ajs20MNX5__KxsHzL4HQ`)
                .then(response => {
                    let data = response.data;
                    let route = L.geoJSON(data.routes[0].geometry, {
                        style: {
                            color: 'blue',
                            weight: 5,
                            opacity: 0.6
                        }
                    }).addTo(map);

                    map.fitBounds(route.getBounds());
                    let navigationIcon = L.icon({
                        iconUrl: './icons/Navigation.png', // Path to the PNG icon
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                    });

                    L.marker([latitude, longitude], { icon: navigationIcon }).addTo(map)
                        .bindPopup(`<lord-icon
                        src="https://cdn.lordicon.com/oxbjzlrk.json"
                        trigger="loop"
                        delay="000"
                        style="width:50px;height:50px">
                    </lord-icon>
                    <p>You are here.</p>`).openPopup();

                    // Check if the instructions-container div already exists
                    var existingContainer = document.getElementById('instructions-container');

                    // If it exists, remove it
                    if (existingContainer) {
                        existingContainer.remove();
                    }

                    const instructionsContainer = document.createElement('div');
                    instructionsContainer.id = "instructions-container"; // Optional: set an ID for easier selection

                    const instructions = document.createElement('ol');

                    data.routes[0].legs.forEach(leg => {
                        leg.steps.forEach(step => {
                            const li = document.createElement('li');
                            li.textContent = step.maneuver.instruction;
                            instructions.appendChild(li);
                        });
                    });

                    instructionsContainer.appendChild(instructions);

                    document.body.appendChild(instructionsContainer);


                })
                .catch(error => {
                    console.error('Error fetching route:', error);
                });
        }, function (error) {
            console.error("Error getting location:", error.message);
        });
    } else {
        console.error("Geolocation is not supported by your browser");
    }
});
