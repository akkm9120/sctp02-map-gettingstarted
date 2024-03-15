



let singapore = [1.290270, 103.851959];
let map ;
let cities; // Ensure you have defined 'cities' somewhere in your code
let circle = null;

document.addEventListener("DOMContentLoaded", async function () {
    // Initialize the map on the 'SingaporeMap' div
    map = L.map('SingaporeMap').setView(singapore, 12);

    let singaporeMarker = L.marker(singapore,{ icon:singaporePin }).addTo(map);
    singaporeMarker.bindPopup("Welcome to Singapore! 🇸🇬").openPopup();


    map.on('zoomend', function () {
        if (map.getZoom() >= 15) {
            singaporeMarker.setOpacity(0); // Hide the marker when zoomed in beyond a certain level
        } else if ( map.getZoom() < 10){
            singaporeMarker.setOpacity(0);
        }
        else{
            singaporeMarker.setOpacity(1); // Show the marker when zoomed out
        }
    });
    
    let map1 =L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Grey/{z}/{x}/{y}.png', {
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
    var baseMaps = {
        "map1":map1,
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

    map.on('click', function(e) {
        var clickedLat = e.latlng.lat;
        var clickedLon = e.latlng.lng;
      
        // Example using Nominatim API (replace with your preferred service and API key)
        var nominatimUrl = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + clickedLat + "&lon=" + clickedLon + "&addressdetails=1";
      
        fetch(nominatimUrl)
          .then(response => response.json())
          .then(data => {
            if (data.address && data.address.road) {
              var locationName = data.address.road;
              L.popup("Location: " + locationName).setLatLng(e.latlng).openOn(map);
            } else {
              console.log("Location name not found");
            }
          })
          .catch(error => console.error(error));
      });

})

document.getElementById("searchbtn").addEventListener('click', async () => {
    if (!circle || !map.hasLayer(circle)) {
        let inputLocation = document.getElementById("searchin").value;
        const apiUrl = `https://api.tomtom.com/search/2/geocode/${inputLocation}.json?key=56jDLQEJXuz69NIh1n9a6aukSHECQfsh`;
        let userIlocation = await axios.get(apiUrl);

        let newlocation = [userIlocation.data.results[0].position.lat, userIlocation.data.results[0].position.lon];

        // Fly to the new location
        map.flyTo(newlocation, 14);

        if (circle) {
            map.removeLayer(circle);
        }

        console.log(newlocation);
        circle = L.circle(newlocation, {
            color: 'blue',
            fillColor: '#F9BD06',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(map);
    } else {
        // If there is an existing circle, remove it
        removeCircle();
    }
});


function removeCircle() {
    if (circle) {
        map.removeLayer(circle);
        circle = null;
    }
}

// https://api.mapbox.com/directions/v5/mapbox/driving/103.793022%2C1.404348%3B103.844353%2C1.278790?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=YOUR_MAPBOX_ACCESS_TOKEN')


// `https://api.mapbox.com/directions/v5/mapbox/driving/${lon}%2C${lat}%3B${lon1}%2C${lat1}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoiYWttLTAwMSIsImEiOiJjbHFmY3kyMmIweHBxMnFxZjlnajZlbnBzIn0.q0Ajs20MNX5__KxsHzL4HQ`
// https://api.mapbox.com/directions/v5/{profile}/{coordinates}

document.querySelector("#btnDirection").addEventListener('click', () => {
    axios.get('https://api.mapbox.com/directions/v5/mapbox/driving/103.793022%2C1.404348%3B103.844353%2C1.278790?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoiYWttLTAwMSIsImEiOiJjbHFmY3kyMmIweHBxMnFxZjlnajZlbnBzIn0.q0Ajs20MNX5__KxsHzL4HQ')
        .then(response => {
            // Extract route geometry from API response
            let data = response.data;
            let route = L.geoJSON(data.routes[0].geometry, {
                style: { color: 'blue' } // Customize route color
            }).addTo(map);

            // Fit map to route bounds
            map.fitBounds(route.getBounds());
        })
        .catch(error => {
            console.error('Error fetching route:', error);
        });
    // const centerpoint = map.getBounds().getCenter();
    // console.log(centerpoint);
})



