//Create Map variable
var map;
//Fucntion to make the map in the div
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center:{lat: 40.4259, lng: 86.9081},
		zoom: 13
	});
	//array holding the location data
	var locations = [
		{lat: 40.422848654474635, lng: -86.90782070159912},
		{lat: 40.42362457637239, lng: -86.9071501493454},
		{lat: 40.4245270847936, lng: -86.90841615200043},
		{lat: 40.42450258246246, lng: -86.90679609775543},
		{lat: 40.42286090594257, lng: -86.90416753292084},
		{lat: 40.422909911791955, lng: -86.90318048000336},
		{lat: 40.42146014031933, lng: -86.90384566783905}
	];
}