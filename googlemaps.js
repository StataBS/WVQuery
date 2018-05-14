/*
global google
*/
var map;

function initMap() {
    console.log('initMap');
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
}
     
function geocodeAddress(geocoder) {
     var address = document.getElementById('address').value;
     var lat;
     var lng;
     //var address = "Wiesengrundstrasse 9, Muttenz";
     geocoder.geocode({ 'address': address }, function(results, status) {
         if (status === 'OK') {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            //console.log("FLat1: " + lat);
            //console.log("FLong1: " + lng);
            
            var loc = results[0].geometry.location;
            
            var pos = {
                lat: lat,
                lng: lng
            };
             
            map.setCenter(pos); 
            
            var latLng = new google.maps.LatLng(lat, lng);  
            
            findWohnviertel(latLng, function(wvName){
                console.log('target WV: ', wvName);
            });
         }
         else {
             alert('Geocode was not successful for the following reason: ' + status);
         }
     });
}

function findWohnviertel(latLng, callbackFn){
    map.data.loadGeoJson('wvcoordinates.json', {idPropertyName: "TXT"}, function(features){
        var marker1 = new google.maps.Marker({
            map: map,
            position: latLng
        });
        
        //console.log('Is in Bettingen: ', google.maps.geometry.poly.containsLocation(marker1.getPosition(), testPoly));
        var targetWohnviertel;
        
        features.forEach(function(feature) {
            var wvName = feature.getProperty("name");
            var polygon = new google.maps.Polygon({
                paths: feature.getGeometry().getAt(0).getArray()
            });
            if (google.maps.geometry.poly.containsLocation(marker1.getPosition(), polygon)) {
                targetWohnviertel = wvName;
            }
        });
        
        callbackFn(targetWohnviertel);
        
    });
}

