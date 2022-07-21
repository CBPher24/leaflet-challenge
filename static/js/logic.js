var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(url).then(function (data) {
    createFeatures(data.features);
  });

function createFeatures(eqData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
      }
    
    function style(feature){
        var circle = {
            radius: (feature.properties.mag),
            fillColor: "white",
            color: "black",
            weight: .25,
            opacity: .75,
            fillOpacity: .5
        }
        return circle
    }
    
    var eqs = L.geoJSON(eqData, {
        onEachFeature: onEachFeature,
        pointToLayer: style
    });

    createMap(eqs);
}  

function createMap(eqs) {
    var topog = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var baseMaps = {
        "Topographic": topog
    };

    var overlayMaps = {
        Earthquakes: eqs
    };

    var myMap = new L.Map("map", {center: [37.8, -96.9], zoom: 4, layers: [topog, eqs]});
    
    // L.control.layers(baseMaps, overlayMaps, {
    //     collapsed: false
    // }).addTo(myMap);
}

// d3.json("").then(createMarkers);
