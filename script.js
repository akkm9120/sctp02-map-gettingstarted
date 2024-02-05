let singapore = [1.290270, 103.851959];

const map = L.map('SingaporeMap').setView(singapore, 12);
let marker = L.marker(singapore).addTo(map);

const markerCulster = L.markerCulsterGroup();
marker.markerCulster.addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
``