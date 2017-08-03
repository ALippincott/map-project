

//View Model
var koViewModel = function(map, locationList) {
	var self = this;
	self.googleMap = map;
	self.allPlaces = [];
	//Observable Array of locations
	self.locations = ko.observableArray([
	{name: 'Basil Thai', latLng: {lat: 40.422848654474635,lng: -86.90782070159912}},
	{name: 'Chipotle', latLng: {lat: 40.42362457637239,lng: -86.9071501493454}},
	{name: 'Blue Nile', latLng: {lat: 40.4245270847936,lng: -86.90841615200043}},
	{name: 'Maru', latLng: {lat: 40.42450258246246,lng: -86.90679609775543}}, 
	{name: 'Town and Gown', latLng: {lat: 40.42286090594257,lng: -86.90416753292084}}, 
	{name: 'Oishi', latLng: {lat: 40.42146014031933,lng: -86.90384566783905}}
	]);
	//pushes location into allPlaces array
	locationList.forEach(function(place) {
		self.allPlaces.push(new Place(place));
	});
	//Creates markers and infowindows for every place in allPlaces
	self.allPlaces.forEach(function(place) {
		
		var markerOptions = {
			map: self.googleMap,
			position: place.latLng,
			animation: google.maps.Animation.DROP,
		};
		var infowindow = new google.maps.InfoWindow({
			content: place.name
		});
		place.marker = new google.maps.Marker(markerOptions);
		place.marker.addListener('click', function() {
			infowindow.open(map, place.marker);
		
		});
		
	});
	
	//Creates seperate visible array for list
	 self.visiblePlaces = ko.observableArray();
	 self.allPlaces.forEach(function(place) {
	 	self.visiblePlaces.push(place);
	 });
	 //Takes in input and handles filtering
	 self.userInput = ko.observable('');
	 self.filterMarkers = function() {
	 	var searchInput = self.userInput().toLowerCase();
	 	self.visiblePlaces.removeAll();
	 	self.allPlaces.forEach(function(place) {
	 		place.marker.setMap(null);
		if (place.name.toLowerCase().indexOf(searchInput) !== -1) {
				self.visiblePlaces.push(place);
			}
		});
		//pushes markers onto map for visible places
		self.visiblePlaces().forEach(function(place) {
		place.marker.setMap(self.googleMap);
	 	});
	};
	// model for place
	function Place(locationList) {
		this.name = locationList.name;
		this.latLng = locationList.latLng;
		this.marker = null;
	}
};
//Creates Map
function initMap() {
	return new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 40.423218239442186,
			lng: -86.90529674291611
		},
		zoom: 17
	});
}

//calls map creation when window is loaded and applys bindings
google.maps.event.addDomListener(window, 'load', function() {
	var locationList = [
	{name: 'Basil Thai', latLng: {lat: 40.422848654474635,lng: -86.90782070159912}},
	{name: 'Chipotle',latLng: {lat: 40.42362457637239,lng: -86.9071501493454}},
	{name: 'Blue Nile',latLng: {lat: 40.4245270847936,lng: -86.90841615200043}},
	{name: 'Maru',latLng: {lat: 40.42450258246246,lng: -86.90679609775543}}, 
	{name: 'Town and Gown',latLng: {lat: 40.42286090594257,lng: -86.90416753292084}}, 
	{name: 'Oishi',latLng: {lat: 40.42146014031933,lng: -86.90384566783905}}
	];

	var googleMap = initMap();
	ko.applyBindings( new koViewModel(googleMap, locationList));

	
});