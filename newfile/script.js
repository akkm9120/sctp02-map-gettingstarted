let singapore = [1.290270, 103.851959];
let map = L.map('SingaporeMap').setView(singapore, 12);
let circle = null ;

document.addEventListener("DOMContentLoaded", async function () {
L.marker(singapore).addTo(map);
L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Grey/{z}/{x}/{y}.png', {   detectRetina: true,   maxZoom: 19,   minZoom: 11,  
}).addTo(map);


const response = await axios.get('data/Hotels.geojson');
// var markers = new L.MarkerClusterGroup();

// L.geoJson(response.data, {
//     onEachFeature: function (feature, layer) {
//         // layer.on('mouseover', function (e) {
//         //     this.openPopup();
//         // });
//         // layer.on('mouseout', function (e) {
//         //     this.closePopup();
//         // });
//         // layer.bindPopup(`
//         // ${feature.properties.Description}`);
//     }
// }).addTo(map);

// var markers = new L.MarkerClusterGroup();
let markers = L.markerClusterGroup();
for (const feature of response.data.features) {
    markers.addLayer(L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]));
    markers.bindPopup(`${feature.properties.Description}`); 
}
map.addLayer(markers);
})

document.getElementById("searchbtn").addEventListener('click', async () => {
    if (!circle || !map.hasLayer(circle)) {
        let inputLocation = document.getElementById("searchin").value;
        const apiUrl = `https://api.tomtom.com/search/2/geocode/${inputLocation}.json?key=56jDLQEJXuz69NIh1n9a6aukSHECQfsh`;
        let userIlocation = await axios.get(apiUrl);
        
        let newlocation = [userIlocation.data.results[0].position.lat, userIlocation.data.results[0].position.lon];
        map.setView(newlocation, 14);
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

document.querySelector("#btnDirection").addEventListener('click', ()=>{
    axios.get('https://api.mapbox.com/directions/v5/mapbox/driving/103.793022%2C1.404348%3B103.844353%2C1.278790?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoiYWttLTAwMSIsImEiOiJjbHFmY3kyMmIweHBxMnFxZjlnajZlbnBzIn0.q0Ajs20MNX5__KxsHzL4HQ')
    .then(response => {
        // Extract route geometry from API response
        let data = response.data;
        let route = L.geoJSON(data.routes[0].geometry, {
            style: {color: 'blue'} // Customize route color
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



