/* global $ */

var jsonObj = require("./wvcoordinates_slim.json");

var f;
var g;
var features = jsonObj.features;
var wvPolygons = [];
//var count = 0;

for (f in features)
{
    // count++;
    // if (count > 1)
    //     break;
    console.log(features[f].properties.name);
    //console.log(features[f].geometry.coordinates);
    var poly = getPolygon(features[f].geometry);
    
    //var coordinates = [[[7.60536092671533,47.5315409010553],[7.58874075072381,47.5281081546764],[7.58500256357686,47.5312850131184],[7.58592807012977,47.5378356172811],[7.59839049203229,47.5385454791251],[7.60536092671533,47.5315409010553]]]

}

function getPolygon(geojsonGeometry)
{
	var paths = [];
	var exteriorDirection;
	var interiorDirection;
	for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
		var path = [];
		for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
			var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][1], geojsonGeometry.coordinates[i][j][0]);
			path.push(ll);
		}
		if(!i){
			exteriorDirection = _ccw(path);
			paths.push(path);
		}else if(i == 1){
			interiorDirection = _ccw(path);
			if(exteriorDirection == interiorDirection){
				paths.push(path.reverse());
			}else{
				paths.push(path);
			}
		}else{
			if(exteriorDirection == interiorDirection){
				paths.push(path.reverse());
			}else{
				paths.push(path);
			}
		}
	}
	//opts.paths = paths;
	var googleObj = new google.maps.Polygon(paths);
	return googleObj;
// 	if (geojsonProperties) {
// 		googleObj.set("geojsonProperties", geojsonProperties);
// 	}
}

var _ccw = function( path ){
	var isCCW;
	var a = 0;
	for (var i = 0; i < path.length-2; i++){
		a += ((path[i+1].lat() - path[i].lat()) * (path[i+2].lng() - path[i].lng()) - (path[i+2].lat() - path[i].lat()) * (path[i+1].lng() - path[i].lng()));
	}
	if(a > 0){
		isCCW = true;
	}
	else{
		isCCW = false;
	}
	return isCCW;
};