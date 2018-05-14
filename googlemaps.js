// Usage: sleep(5000).then(() => {console.log("Sleeping for 5 seconds");});

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function initMap() {
    console.log('initMap');
     // var map = new google.maps.Map(document.getElementById('map'), {
     //     zoom: 8,
     //     center: { lat: -34.397, lng: 150.644 }
     // });
     var geocoder = new google.maps.Geocoder();
        document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder);
     });

}
     
function geocodeAddress(geocoder) {
     var address = document.getElementById('address').value;
     //var address = "Wiesengrundstrasse 9, Muttenz";
     geocoder.geocode({ 'address': address }, function(results, status) {
         if (status === 'OK') {
             console.log("FLat1: " + results[0].geometry.location.lat());
             console.log("FLong1: " + results[0].geometry.location.lng());
         }
         else {
             alert('Geocode was not successful for the following reason: ' + status);
         }
     });
}

function getWVFromCoordinate()
{
   var coords = [
          {lat: 25.774, lng: -80.19},
          {lat: 18.466, lng: -66.118},
          {lat: 32.321, lng: -64.757}
    ];
}


 