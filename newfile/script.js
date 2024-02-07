document.addEventListener("DOMContentLoaded", async function () {
let singapore = [1.290270, 103.851959];

const map = L.map('SingaporeMap').setView(singapore, 12);
L.marker(singapore).addTo(map);
L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Grey/{z}/{x}/{y}.png', {   detectRetina: true,   maxZoom: 19,   minZoom: 11,  
}).addTo(map);


document.querySelector("btnDirection").addEventListener('click', ()=>{
    const centerpoint = map.getBounds().getCenter();
    console.log(centerpoint);
})



})