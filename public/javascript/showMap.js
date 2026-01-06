const map = L.map("map").setView([coordinates[1], coordinates[0]], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

L.marker([coordinates[1], coordinates[0]])
  .addTo(map)
  .bindPopup(placeName)
  .openPopup();
