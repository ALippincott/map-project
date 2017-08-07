function Place(locationList) {
	this.name = locationList.name;
	this.latLng = locationList.latLng;
	this.marker = null;
}
var googleMap;
var locations = [];
var markers = [];
var locationList = [
	{name: 'Basil Thai', latLng: {lat: 40.422848654474635,lng: -86.90782070159912}},
	{name: 'Chipotle',latLng: {lat: 40.42362457637239,lng: -86.9071501493454}},
	{name: 'Blue Nile',latLng: {lat: 40.4245270847936,lng: -86.90841615200043}},
	{name: 'Maru',latLng: {lat: 40.42450258246246,lng: -86.90679609775543}}, 
	{name: 'Town and Gown',latLng: {lat: 40.42286090594257,lng: -86.90416753292084}}, 
	{name: 'Oishi',latLng: {lat: 40.42146014031933,lng: -86.90384566783905}}
	];

locationList.forEach(function(place) {
	locations.push(new Place(place));
});

function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.name + '</div>');
		infowindow.open(map, marker);
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
			infowindow.setMarker = null;
		});
	}
}

//View Model
var koViewModel = function(map, locationList) {
	var self = this;
	self.allPlaces = ko.observableArray();
	
	for(i=0; i < 7; i++){
		self.allPlaces[i] = locations[i];
		// console.log(self.allPlaces[i]);
	}
	var filter;
	//Creates seperate visible array for list
	self.visiblePlaces = ko.observableArray();
	for(i=0;i<locations.length;i++){
		self.visiblePlaces.push(locations[i]);
	}
	var markerOptions;
	var infowindow = [];
	var largeInfowindow = new google.maps.InfoWindow();
	self.visiblePlaces().forEach(function(place) {
		markerOptions = {
			map: googleMap,
			position: place.latLng,
			animation: google.maps.Animation.DROP
		};
		place.marker = new google.maps.Marker(markerOptions);
		markers.push(place.marker);


	});


	for (var i = 0; i < locations.length; i++) {
		var marker = new google.maps.Marker({
			map: googleMap,
			position: locations[i].latLng,
			name: locations[i].name,
			animation: google.maps.Animation.DROP
		});
		// console.log(i);


		markers.push(marker);
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
	}

	//Takes in input and handles filtering
	self.valueFake = ko.observable("");
	self.filter = ko.pureComputed({
		read: self.valueFake,
		write: function(value) {
			for(i = 0; i < self.allPlaces.length; i++){
				if(!self.allPlaces[i].name.includes(filter)) {
					self.visiblePlaces.pop(self.allPlaces[i]);
				}
			};
		}

	});
	
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

	googleMap = initMap();
	ko.applyBindings(new koViewModel(googleMap, locationList));


});