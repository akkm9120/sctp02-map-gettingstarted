let singapore = [1.29, 103.85] || [103.85,];
let map;
let cities; // Ensure you have defined 'cities' somewhere in your code
let circle = null;

let singaporePin = L.icon({
    iconUrl: './icons/pngwing.com.png',
    iconSize: [100, 56],  // Increase the size to 40x40 pixels
    iconAnchor: [50, 50], // Adjust the anchor point if needed
    popupAnchor: [-5, -50]
});

let hotelIcon = L.icon({
    iconUrl: './icons/hotelwings.png',
    iconSize: [16, 16],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
});


document.addEventListener("DOMContentLoaded", async function () {
    // Initialize the map on the 'SingaporeMap' div

    map = L.map('map').setView(singapore, 12);

    // mapboxgl.accessToken = `pk.eyJ1IjoiYWttLTAwMSIsImEiOiJjbHFmY3kyMmIweHBxMnFxZjlnajZlbnBzIn0.q0Ajs20MNX5__KxsHzL4HQ`;
    //  map= new mapboxgl.Map({
    //     container: 'map',
    //     style: 'mapbox://styles/mapbox/streets-v12',
    //     center: singapore,
    //     zoom: 12
    //   });
    // map.addControl(new mapboxgl.NavigationControl());

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



    let response = await axios.get('data/Hotels.geojson');
    let markers = L.markerClusterGroup();
    for (let feature of response.data.features) {

        let marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { icon: hotelIcon });
        marker.bindPopup(`${feature.properties.Description}`);
        markers.addLayer(marker);
    }

    let response1 = await axios.get('data/TouristAttractions (1).geojson');
    let t_attractions = L.markerClusterGroup();
    for (let feature of response1.data.features) {
        let tmarker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
        tmarker.bindPopup(`${feature.properties.Description}`);
        t_attractions.addLayer(tmarker);
    }

    let overlayMaps = {
        "Hotels": markers,
        "Attractions": t_attractions
    };
    L.control.layers(baseMaps, overlayMaps).addTo(map);



    //     const compassControl = L.control({ position: 'topright' });

    //     compassControl.onAdd = function (map) {
    //         const div = L.DomUtil.create('div', 'leaflet-compass');
    //         div.innerHTML = '<i class="fas fa-compass"></i>'; // Use a compass icon
    //         div.title = 'Rotate to North';

    //         // Add click event to reset rotation (unchanged)
    //         div.addEventListener('click', function () {
    //             map.setView(map.getCenter(), map.getZoom());
    //         });

    //         // Update compass rotation on map move
    //         map.on('move', function () {
    //             const bearing = map.getBearing();
    //             div.style.transform = `rotate(${bearing}deg)`;
    //         });

    //         return div;
    //     };

    // compassControl.addTo(map);

})

// const searchLayer = L.layerGroup();
// searchLayer.addTo(map);

// document.querySelector("#searchbtn").addEventListener("click", async function () {
//     const searchTerms = document.querySelector("#searchin").value;

//     const centerPoint = map.getBounds().getCenter();
//     const data = await search(centerPoint.lat, centerPoint.lng, searchTerms);

//     addMarkersToMap(data, searchLayer, map);

// });


function removeCircle() {
    if (circle) {
        map.removeLayer(circle);
        circle = null;
    }
}




document.querySelector("#btnDirection").addEventListener('click',() => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            let inputLocation = document.getElementById("to").value;
            const apiUrl = `https://api.tomtom.com/search/2/geocode/${inputLocation}.json?key=56jDLQEJXuz69NIh1n9a6aukSHECQfsh`;
            let endlocation = await axios.get(apiUrl);
            let newEndlocation = [endlocation.data.results[0].position.lat, endlocation.data.results[0].position.lon];
            console.log(newEndlocation)

            
            axios.get(`https://api.mapbox.com/directions/v5/mapbox/cycling/${longitude},${latitude};${newEndlocation[1]},${newEndlocation[0]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoiYWttLTAwMSIsImEiOiJjbHFmY3kyMmIweHBxMnFxZjlnajZlbnBzIn0.q0Ajs20MNX5__KxsHzL4HQ`)
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

function addMarkersToMap(searchResults, layer, map) {
    // add markers:
    // Example of how to get lat lng from the FourSquare results: 
    // x.results[0].geocodes.main.latitude = lat
    // x.results[0].goecodes.main.longtitude = lng

    // remove all existing markers from the provided layer
    layer.clearLayers();

    const searchResultOutput = document.querySelector("#search-results");
    searchResultOutput.innerHTML = "";

    // take one location at a time from data.results
    for (let location of searchResults.results) {
        // PART A: create a marker for that location

        const lat = location.geocodes.main.latitude;
        const lng = location.geocodes.main.longitude;
        const address = location.location.formatted_address;
        const name = location.name;
        const marker = L.marker([lat, lng]);
        marker.bindPopup(function () {

            const divElement = document.createElement('div');
            divElement.innerHTML = `
                <h3>${name}</h3>
                <img src="#"/>
                <h4>${address}</h4>
                <button class="clickButton">Click</button>
            `;

            async function getPicture() {
                const photos = await getPhotoFromFourSquare(location.fsq_id);
                const firstPhoto = photos[0];
                const photoUrl = firstPhoto.prefix + '150x150' + firstPhoto.suffix;
                divElement.querySelector("img").src = photoUrl;
            }

            getPicture();

            divElement.querySelector(".clickButton").addEventListener("click", function () {
                alert("hello world!");
            });


            // whatver element or HTML the function returns will be inside popup
            return divElement;
        });

        marker.addTo(layer);
        const divElement = document.createElement('div');

        // 3. add the element to the result element
        divElement.innerHTML = location.name;

        divElement.addEventListener("click", function () {

            const lat = location.geocodes.main.latitude;
            const lng = location.geocodes.main.longitude;
            map.flyTo([lat, lng], 16);
            marker.openPopup();
        })

        searchResultOutput.appendChild(divElement);


    }
}