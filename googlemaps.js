/*
global google
global $
*/
var map;
var targetWohnviertel = {};
var marker;

var sheetWidth = 297;
var sheetHeight = 210;
var pageOffset = 6;

var leftPad = 2;
var rightPad = 2;

var marginLeft = 13;
var marginRight = 26;
var marginTop = 38;
var marginBottom = 75;

var rowHeight = 5;

var pdfBaseUrl = "https://mietpreisraster.statabs.ch/?";
var pdfLink = "";

let zimmerZahlList =    [
                        {index: 1, text: '1 Zimmer'}, 
                        {index: 2, text: '2 Zimmer'},
                        {index: 3, text: '3 Zimmer'},
                        {index: 4, text: '4 Zimmer'},
                        {index: 5, text: '5 Zimmer'},
                        {index: 6, text: '6 Zimmer'},
                        ];

let baujahrList =       [
                        {index: 1, text: 'vor 1920', yPos: 55},
                        {index: 2, text: '1921 - 1946', yPos: 68},
                        {index: 3, text: '1947 - 1960', yPos: 84},
                        {index: 4, text: '1961 - 1970', yPos: 98},
                        {index: 5, text: '1971 - 1980', yPos: 112.5},
                        {index: 6, text: '1981 - 1990', yPos: 127.5},
                        {index: 7, text: '1991 - 2000', yPos: 141.5},
                        {index: 8, text: '2001 - 2010', yPos: 158},
                        {index: 9, text: 'ab 2011', yPos: 166}
                        ];


let renovationList =    [
                        {index: 1, text: 'nicht renoviert', yPosRel: 2.5},
                        {index: 2, text: 'renoviert', yPosRel: 7}
                        ];

let wvxPosList =        [
                        {index: 1, xPosStart: 51, xPosEnd: 66},
                        {index: 2, xPosStart: 69, xPosEnd: 77},
                        {index: 3, xPosStart: 82, xPosEnd: 87},
                        {index: 4, xPosStart: 90, xPosEnd: 97},
                        {index: 5, xPosStart: 100, xPosEnd: 108},
                        {index: 6, xPosStart: 110, xPosEnd: 119},
                        {index: 7, xPosStart: 121, xPosEnd: 131},
                        {index: 8, xPosStart: 133, xPosEnd: 140},
                        {index: 9, xPosStart: 145, xPosEnd: 151},
                        {index: 10, xPosStart: 154, xPosEnd: 160},
                        {index: 11, xPosStart: 162, xPosEnd: 172},
                        {index: 12, xPosStart: 174, xPosEnd: 188},
                        {index: 13, xPosStart: 192, xPosEnd: 198},
                        {index: 14, xPosStart: 202, xPosEnd: 209},
                        {index: 15, xPosStart: 211, xPosEnd: 222},
                        {index: 16, xPosStart: 224, xPosEnd: 234},
                        {index: 17, xPosStart: 238, xPosEnd: 245},
                        {index: 18, xPosStart: 250, xPosEnd: 256},
                        {index: 19, xPosStart: 259, xPosEnd: 269},
                        {index: 20, xPosStart: 271, xPosEnd: 284}
                        ];

function initMap() {
    
    $("#open-pdf").hide();
    
    $('#addresse').keypress(function(e){
      if(e.keyCode==13)
      $('#wv-submit').click();
    });

    // //Nordwestschweiz
    // var defaultBounds = new google.maps.LatLngBounds(
    //     new google.maps.LatLng(47.254020, 7.494277),
    //     new google.maps.LatLng(47.617088, 8.134363));
        
    //Region Basel
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(47.518908, 7.554809),
        new google.maps.LatLng(47.601326, 7.693824));

    var options = {
        bounds: defaultBounds
        //,types: ['geocode']
        ,types: ['address']
        ,componentRestrictions: {country: 'CH'}
    };
    var input = document.getElementById('addresse');    
    var autocomplete = new google.maps.places.Autocomplete(input, options);    
    autocomplete.setOptions({strictBounds: true});
    // autocomplete.setFields(['address_components']);
    //autocomplete.setFields(['name']);
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: { 
            lat: 47.5517544,
            lng: 7.6349769
        }
    });
    var geocoder = new google.maps.Geocoder();
    
    document.getElementById('wv-submit').addEventListener('click', function() {
        geocodeAddress(geocoder);
        //$("#wohnviertelliste").val(targetWohnviertel.Index);
        //createPdfUrl();
        //$("#adresse-data").show();
        //$("#wv-data").show();
    });

    // document.getElementById('addr-submit').addEventListener('click', function() {
    //     geocodeAddress(geocoder);
    // });
    
    document.getElementById('wv-transfer').addEventListener('click', function() {
        $("#wohnviertelliste").val(targetWohnviertel.Index);
        //$("#adresse-data").hide();
        $("#wv-data").hide();
        $("#addresse").val("");
        createPdfUrl();
    });

    document.getElementById('pdf-open-button').addEventListener('click', function() {
        console.log("PDF-Link: ", pdfLink)
        // window.open(pdfLink, "_blank");
        return false;
    });

    map.data.loadGeoJson('wvcoordinates.json', {idPropertyName: "TXT"});

    loadWvList($('select#wohnviertelliste'), 'wvcoordinates.json', 'name');
    loadStaticList($('select#zimmerzahl'), zimmerZahlList);
    loadStaticList($('select#baujahr'), baujahrList);
    loadStaticList($('select#renovation'), renovationList);
}
     
function geocodeAddress(geocoder) {
     var address = document.getElementById('addresse').value;
     //geocoder.geocode({'address': address, 'componentRestrictions': {'postalCode': '4'}}, function(results, status) {
     //geocoder.geocode({'address': address, 'componentRestrictions': {country: 'CH', postalCode: '8000'}}, function(results, status) {
     geocoder.geocode({'address': address }, function(results, status) {
         if (status === 'OK')
         {
            var loc = results[0].geometry.location;
            map.setCenter(loc); 
            // findWohnviertel(loc);
            var result = findWohnviertel(loc);
            console.log('target WV: ', targetWohnviertel.Name);
            console.log(result);
            if (result != -1)
            {
                console.log('target WV: ', targetWohnviertel.Name);
                //console.log('Loc: ', loc.lat, ',', loc.lng);
                //$("#wohnviertelliste").val(wv.Index);
                $("#wv-gefunden").text(targetWohnviertel.Name);
                $("#wv-data").show();
            }
            else
            {
                alert(unescape("Es konnte kein Wohnviertel f%FCr die angegebene Adresse (" + address + ") ermittelt werden."));
                $("#wv-data").hide();
            }
         }
         else
         {
            if (address === "")
            {
                alert(unescape("Bitte geben Sie eine Adresse ein."));
            }
            else
            {
                alert(unescape("Es konnte keine g%FCltige Adresse f%FCr den Wert '" + address + "' ermittelt werden."));
            }
         }
     });
}

function findWohnviertel(position){
    targetWohnviertel = {};
    if (marker != null)
    {
        marker.setMap(null);
    }
    marker = new google.maps.Marker({
    map: map,
    position: position
    });

    map.data.forEach(function(feature) {
        var wvName = feature.getProperty("name");
        var wvIndex = feature.getProperty("TXT");
        var polygon = new google.maps.Polygon({
            paths: feature.getGeometry().getAt(0).getArray()
        });
        if (google.maps.geometry.poly.containsLocation(marker.getPosition(), polygon)) {
            targetWohnviertel.Name = wvName;
            targetWohnviertel.Index = wvIndex;
        }
    });
    
    if (targetWohnviertel.Name !== undefined)
        return 1;
    else
        return -1;
}

function sortJsonByName(a,b){
        return a.properties["name"] > b.properties["name"] ? 1 : -1;
};

function loadWvList(selobj,url,nameattr)
{
    //$(selobj).empty();
    $.getJSON(url,{},function(data)
    {
        data.features = $(data.features).sort(sortJsonByName);
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

function loadStaticList(selobj, data)
{
    data.forEach(function(element)
    {
        
        $(selobj).append(
            $('<option></option>')
                .val(element.index)
                .html(element.text));
    });
}

function createPdfUrl()
{
    console.log("wvlist val: " + $("#wohnviertelliste").val())
    console.log("baujahrList val: " + $("#baujahr").val())
    console.log("renovationList val: " + $("#renovation").val())
    console.log("zimmerZahlList val: " + $("#zimmerzahl").val())
    
    // rect=6@59,57,10,6|7@11,88,275,6@89,35,10,135|8@0,0,297,210#page=7
    
    var pageNo;
    //r1: row, r2: column
    var r1xOrigin;
    var r1yOrigin;
    var r1xExtent;
    var r1yExtent;
    var r2xOrigin;
    var r2yOrigin;
    var r2xExtent;
    var r2yExtent;

    if ($("#wohnviertelliste").val() != 0 && $("#baujahr").val() != 0 && $("#renovation").val() != 0 && $("#zimmerzahl").val() != 0)
    {
        pdfLink = "";
        pageNo = zimmerZahlList[$("#zimmerzahl").val() - 1].index + pageOffset - 1;
        r1xOrigin = marginLeft;
        // ab 2010 keine Unterscheidung renoviert / nicht renoviert
        if ($("#baujahr").val() <= 7)
        {
            r1yOrigin = baujahrList[$("#baujahr").val() - 1].yPos + renovationList[$("#renovation").val() - 1].yPosRel;
        }
        else
        {
            r1yOrigin = baujahrList[$("#baujahr").val() - 1].yPos;
        }

        r1xExtent = sheetWidth - marginRight;
        r1yExtent = rowHeight;
        r2xOrigin = wvxPosList[$("#wohnviertelliste").val() - 1].xPosStart - leftPad;
        r2yOrigin = marginTop;
        r2xExtent = wvxPosList[$("#wohnviertelliste").val() - 1].xPosEnd - wvxPosList[$("#wohnviertelliste").val() - 1].xPosStart + leftPad + rightPad;
        r2yExtent = sheetHeight - marginBottom;
        
        pdfLink = pdfBaseUrl + "rect=" + pageNo + "@" + r1xOrigin + "," + r1yOrigin + "," + r1xExtent + "," + r1yExtent + "@" + r2xOrigin + "," + r2yOrigin + "," + r2xExtent + "," + r2yExtent + "#page=" + pageNo;
        
        $("#open-pdf").show();
    }
    else
    {
        $("#open-pdf").hide();
    }
}