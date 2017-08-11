function Place(locationList) {
	this.name = locationList.name;
	this.latLng = locationList.latLng;
	this.tag = locationList.tag;
	this.marker = null;
}

var googleMap;
var locations = [];
var markers = [];
var locationList = [
	{name: 'Basil Thai', latLng: {lat: 40.422848654474635,lng: -86.90782070159912}, tag: 'restaurant'},
	{name: 'Chipotle',latLng: {lat: 40.42362457637239,lng: -86.9071501493454}, tag: 'restaurant'},
	{name: 'Blue Nile',latLng: {lat: 40.4245270847936,lng: -86.90841615200043}, tag: 'restaurant'},
	{name: 'Maru',latLng: {lat: 40.42450258246246,lng: -86.90679609775543}, tag: 'restaurant'}, 
	{name: 'Town and Gown',latLng: {lat: 40.42286090594257,lng: -86.90416753292084}, tag: 'restaurant'}, 
	{name: 'Oishi',latLng: {lat: 40.42146014031933,lng: -86.90384566783905}, tag: 'restaurant'}
	];

locationList.forEach(function(place) {
	locations.push(new Place(place));
});
//Wikipedia API
var HTMLinfoWindow = '<div>%data%</div>';
var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + locations.tag + '&format=json&callback=wikiCallback';
$.ajax({
	url: wikiUrl,
	dataType: "jsonp",
	success: function(response) {
		// console.log(locations);
		var articleList = response[1];

		for(var i = 0; i < locations.length; i++) {
			var url = 'http://en.wikipedia.org/wiki/' + locations[i].tag;
			HTMLinfoWindow = HTMLinfoWindow.replace('%data%', url);
		}
	}
});
//Creates Info Windows
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent(HTMLinfoWindow);
		infowindow.open(map, marker);

		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
			infowindow.setMarker = null;
		});
	}
}
//Creates and stores markers
	
	for (var i = 0; i < locations.length; i++) {
		var marker = new google.maps.Marker({
			map: googleMap,
			position: locations[i].latLng,
			name: locations[i].name,
			animation: google.maps.Animation.DROP
			
		});
		 marker.addListener('click', handleclick);
        markers.push(marker);
	function handleclick() {
        populateInfoWindow(this, largeInfowindow);
	}

	

		//View Model
var koViewModel = function(map, locationList) {
	var self = this;
	self.allPlaces = ko.observableArray();
	query: ko.observable('')
	for(i=0; i < 7; i++){
		self.allPlaces[i] = locations[i];
		// console.log(self.allPlaces[i]);
	}
	
	var markerOptions;
	var infowindow = [];
	var largeInfowindow = new google.maps.InfoWindow();
	//Creates marker and pushes it to the markers array
	self.allPlaces().forEach(function(place) {
		markerOptions = {
			map: googleMap,
			position: place.latLng,
			animation: google.maps.Animation.DROP
		};
		place.marker = new google.maps.Marker(markerOptions);
		markers.push(place.marker);


	});



		markers.push(marker);
		marker.addListener('click', populateInfoWindow(this, largeInfowindow));
	}
		

	//Takes in input and handles filtering

};
var viewModel = {
		//observable array of locations
		locations: ko.observableArray(locationList),

		//search query
		query: ko.observable(''),

		//filter based on search query
		search: function(value) {
			viewModel.locations.removeAll();
			for(var x in locationList) {
	  			if(locationList[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
	    			viewModel.locations.push(locationList[x]);
	  			}
			}

			//remove all markers
			for (i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
			}

			//only show filtered markers
			for (i = 0; i < viewModel.locations().length; i++) {
				for (var k = 0; k < markers.length; k++) {
					if (viewModel.locations()[i].name === markers[k].title) {
						markers[k].setMap(map);
					}
				}
			}
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

	googleMap = initMap();
	ko.applyBindings(new koViewModel(googleMap, locationList));


});