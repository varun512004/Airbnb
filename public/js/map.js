mapboxgl.accessToken = mapPublicToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [122.4194, 37.7749], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});