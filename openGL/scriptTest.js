const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox/streets-v11',
    center: [1.290270, 103.851959], // Replace with your starting point coordinates
    zoom: 13
  });
  
  const directions = new MapboxDirections({
    accessToken: 'pk.eyJ1IjoiYWttLTAwMSIsImEiOiJjbHFmY3kyMmIweHBxMnFxZjlnajZlbnBzIn0.q0Ajs20MNX5__KxsHzL4HQ',
    controls: {
      inputs: false, // Hide origin and destination inputs
      route: true // Display route controls
    }
  });
  
  map.addControl(directions, 'top-left'); // Add directions control to top-left corner
  
  directions.on('route', (route) => {
    const instructions = document.getElementById('instructions');
    instructions.innerHTML = formatInstructions(route); // Update instructions div
  });
  
  function formatInstructions(route) {
    // This function can be customized to format the instructions as desired
    let formattedInstructions = '';
    route.legs.forEach(leg => {
      leg.steps.forEach(step => {
        formattedInstructions += `<p>${step.instruction}</p>`;
      });
    });
    return formattedInstructions;
  }
  