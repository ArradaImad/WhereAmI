var currentCoordinates;
var currentPositionText = document.getElementById("currentPosition");
var positions = [];
var markers = [];

function success(position) {
    currentCoordinates = position;
    currentPositionText.innerText = coordinatesToString(currentCoordinates.coords); //"Lat: " + currentCoordinates.coords.latitude + " Lon: " + currentCoordinates.coords.longitude;
    map.flyTo([currentCoordinates.coords.latitude, currentCoordinates.coords.longitude], 13);
    L.marker([currentCoordinates.coords.latitude, currentCoordinates.coords.longitude]).addTo(map);
    return position;
}
 
function getCoordinates() {
    navigator.geolocation.getCurrentPosition(success);
}

var element = document.getElementById("map");
var map = L.map('map').setView([48.85, 2.38], 10);

// Layer contenant les markers
var markersLayer = L.featureGroup();
var redIcon = L.icon({
    iconUrl: './assets/images/pin.png',
    iconAnchor:   [12, 41],
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(map);

markersLayer.addTo(map);
L.marker([48.85, 2.38]).addTo(markersLayer);

map.on('click', function(e){
    var marker = new L.marker(e.latlng, {icon: redIcon});
    marker.id = uniqueID();
    markers.push(marker);
    // Adding marker to layergroup
    marker.addTo(markersLayer);

    // rendering
    renderMarkersdata(markers);
});

markersLayer.on('click', function(e) {  
    // Deletion of marker
    markers = markers.filter(m => m.id !== e.layer.id);
    markersLayer.removeLayer(e.layer);
    renderMarkersdata(markers);
});

function savePosition() {
    if (typeof currentCoordinates !== "undefined") {
        positions.push({date: new Date(Date.now()).toString(), coordinates: {latitude: currentCoordinates.coords.latitude, longitude: currentCoordinates.coords.longitude}});
        localStorage.setItem("@positions", JSON.stringify(positions));
    }
}

function clearTable(id) {
    let table = document.getElementById(id)
    table.innerHTML = '';
} 

function renderMarkersdata(listOfMarkers) {
    clearTable('markers-table-body');
    listOfMarkers.forEach((marker, index) => {
        createMarkerTableRow(index, {latitude: marker._latlng.lat, longitude: marker._latlng.lng});
    });
}

function getPreviousPositions() {
    clearTable("table-body")
    let previousPositions = JSON.parse(localStorage.getItem('@positions'));
    previousPositions.forEach((position, index) => {
        console.log(index, position);
        createTableRow(index, position.date, position.coordinates);
    });
}

function deletePreviousPositions() {
    localStorage.removeItem('@positions');
    clearTable("table-body");
}

function createTableRow(id, date, coordinates) {
    let table = document.getElementById("table-body");
    let row = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");

    td1.innerText = id;
    td2.innerText = date;
    td3.innerText = coordinatesToString(coordinates);

    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);

    table.appendChild(row);
}

function createMarkerTableRow(id, coordinates) {
    let table = document.getElementById("markers-table-body");
    let row = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");

    td1.innerText = id;
    td2.innerText = coordinatesToString(coordinates);

    row.appendChild(td1);
    row.appendChild(td2);

    table.appendChild(row);
}

function coordinatesToString(coordinates) {
    return "Lat: " + coordinates.latitude + " Lon: " + coordinates.longitude;
}

function uniqueID() {
    return Math.floor(Math.random() * Date.now())
}