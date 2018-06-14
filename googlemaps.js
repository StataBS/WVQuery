/*
global google
global $
*/
var map;
var targetWohnviertel = {};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: { 
            lat: 47.5517544,
            lng: 7.6349769
        }
    });
    var geocoder = new google.maps.Geocoder();
    
    document.getElementById('wv-submit').addEventListener('click', function() {
        $("#adresse-data").show();
        // $("#wv-data").show();
    });

    document.getElementById('addr-submit').addEventListener('click', function() {
        geocodeAddress(geocoder);
    });
    
    document.getElementById('wv-transfer').addEventListener('click', function() {
        $("#wohnviertelliste").val(targetWohnviertel.Index);
        $("#adresse-data").hide();
        $("#wv-data").hide();
    });

    map.data.loadGeoJson('wvcoordinates.json', {idPropertyName: "TXT"});

    loadWvList($('select#wohnviertelliste'), 'wvcoordinates.json', 'name');
}
     
function geocodeAddress(geocoder) {
     var address = document.getElementById('addresse').value;
     geocoder.geocode({ 'address': address }, function(results, status) {
         if (status === 'OK') {
            var loc = results[0].geometry.location;
            map.setCenter(loc); 
            findWohnviertel(loc);
            console.log('target WV: ', targetWohnviertel.Name);
            // $("#wohnviertelliste").val(wv.Index);
            $("#wv-gefunden").text(targetWohnviertel.Name);
            $("#wv-data").show();
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
        
        // var targetWohnviertel = {};
        
        map.data.forEach(function(feature) {
            var wvName = feature.getProperty("name");
            var wvIndex = feature.getProperty("TXT");
            var polygon = new google.maps.Polygon({
                paths: feature.getGeometry().getAt(0).getArray()
            });
            if (google.maps.geometry.poly.containsLocation(marker1.getPosition(), polygon)) {
                targetWohnviertel.Name = wvName;
                targetWohnviertel.Index = wvIndex;
            }
        });
        
        // return targetWohnviertel;
}

function loadWvList(selobj,url,nameattr)
{
    //$(selobj).empty();
    $.getJSON(url,{},function(data)
    {
        $.each(data.features, function(key, value)
        {
            
            //console.log('i: ' + i + ', obj:' + obj);
            $(selobj).append(
                $('<option></option>')
                    .val(value.properties["TXT"])
                    .html(value.properties["name"]));
            
        });
    });
}
