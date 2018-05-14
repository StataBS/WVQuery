/*
global google
*/
var map;

function initMap() {
     map = new google.maps.Map(document.getElementById('map'), {
          zoom: 11,
          center: { 
              lat: 47.5517544,
              lng: 7.6349769
          }
      });
     var geocoder = new google.maps.Geocoder();
        document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder);
     });
     
     map.data.loadGeoJson('wvcoordinates.json', {idPropertyName: "TXT"});
}
     
function geocodeAddress(geocoder) {
     var address = document.getElementById('address').value;
     geocoder.geocode({ 'address': address }, function(results, status) {
         if (status === 'OK') {
            var loc = results[0].geometry.location;
            map.setCenter(loc); 
            var wv  = findWohnviertel(loc);
            console.log('target WV: ', wv);
         }
         else {
             alert('Geocode was not successful for the following reason: ' + status);
         }
     });
}

function findWohnviertel(position){
        var marker1 = new google.maps.Marker({
            map: map,
            position: position
        });
        
        var targetWohnviertel;
        
        map.data.forEach(function(feature) {
            var wvName = feature.getProperty("name");
            var polygon = new google.maps.Polygon({
                paths: feature.getGeometry().getAt(0).getArray()
            });
            if (google.maps.geometry.poly.containsLocation(marker1.getPosition(), polygon)) {
                targetWohnviertel = wvName;
            }
        });
        
        return targetWohnviertel;
}

