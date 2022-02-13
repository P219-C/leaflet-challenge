// For Output format check the original source https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Creating map object
var myMap = L.map("map", {
    center: [38.665, -100.0],
    zoom: 5
  });

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);



d3.json(queryUrl).then(function(data) {
    console.log(data.features)

    for (var i = 0; i < data.features.length; i++) {

        // console.log( data.features[i].geometry.coordinates[0])

        var lon = data.features[i].geometry.coordinates[1];
        var lat = data.features[i].geometry.coordinates[0];
        var magnitude = data.features[i].properties.mag;
        var coordinates = [lon,lat]
        
        var color = "";
        if (magnitude > 5) {
          color = "#F06B6B";
        }
        else if (magnitude > 4) {
          color = "#F0A76B";
        }
        else if (magnitude > 3) {
          color = "#F3BA4D";
        }
        else if (magnitude > 2) {
          color = "#F3DB4D";
        }
        else if (magnitude >1) {
          color = "#E1F34D";
        }
        else {
          color = "#B7F34D";
        }
        
        // console.log(i,lon,lat,magnitude,color, coordinates)
        // console.log(data.features[i].geometry.coordinates[0])
        L.circle(coordinates, {
            stroke: true,
            weight: 1,
            fillOpacity: 1.0,
            color: "black",
            fillColor: color,
            // Adjust radius
            radius: magnitude *15000//* (Math.exp(Math.abs(lat)/90))/Math.exp(1)
          }).bindPopup("<b>Earthquake ID: " + data.features[i].id + "</b> <hr> <p>Location:" + data.features[i].properties.place + "</p> <p>Magnitude: " + data.features[i].properties.mag + "</p>").addTo(myMap);
    }

    function getColor(d) {
      return d > 5  ? '#F06B6B' :
             d > 4  ? '#F0A76B' :
             d > 3  ? '#F3BA4D' :
             d > 2  ? '#F3DB4D' :
             d > 1  ? '#E1F34D' :
                      '#B7F34D';
  }

    // Set up the legend
    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
    magnitudes = [0, 1, 2, 3, 4, 5],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(myMap);
    




});