var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(url).then(function (data) {
    createFeatures(data.features);
  });

function createFeatures(eqData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}<br>Magnitude: ${feature.properties.mag}<br>Lat/Long: ${feature.geometry.coordinates[0]} , ${feature.geometry.coordinates[1]}<br>Depth: ${feature.geometry.coordinates[2]}</p>`);
      }
    
    function color(x){
        switch(true) {
            case (x < 5):
                return "#FFFFFF";
            case (x < 20):
                return "#FFFF00";
            case (x < 35):
                return "#FFA54F";
            case (x < 50):
                return "#00CD66";
            case (x < 65):
                return "#7A67EE";
            case (x < 80):
                return "#548B54";
            case (x < 95):
                return "#27408B";
            default:
                return "black"
        }
    }

    function style(feature, mag){
        let circle = {
            radius: (feature.properties.mag)*5,
            fillColor: color(feature.geometry.coordinates[2]),
            color: "black",
            weight: .25,
            opacity: .60,
            fillOpacity: .5
        }
        return L.circleMarker(mag,circle)
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

    var myMap = new L.Map("map", {center: [37.8, -96.9], zoom: 4, layers: [topog, eqs]});

    var legend = L.control({ position: "topleft" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ["<", 5, 20, 35, 50, 65, 80, 95, "<"];
        var colors = ["#FFFFFF", "#FFFF00", "#FFA54F", "#00CD66", "#7A67EE", "#548B54", "#27408B", "black"];
        div.innerHTML += "<h3 style='text-align: left'>Earthquake Depth</h3>"
        for (var i =0; i < colors.length; i++) {
            div.innerHTML += '<span>' + limits[i] + " - " + limits[i+1] + '</span><i style="background: ' + colors[i] + '"></i><br>';
          }

            return div;
    };


    legend.addTo(myMap);
};