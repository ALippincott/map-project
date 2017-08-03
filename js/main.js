function Place(locationList) {
		this.name = locationList.name;
		this.latLng = locationList.latLng;
		this.marker = null;
	}
var googleMap;
var locations = [];
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
var marker = new google.maps.Marker({
            map: map,
            position: place.latLng,
            name: place.name ,
            animation: google.maps.Animation.DROP,
            id: i
          });
function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.name + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
          });
      }
  }
//View Model
var koViewModel = function(map, locationList) {
	var self = this;
	self.allPlaces = locations;	
	//Creates seperate visible array for list
	 self.visiblePlaces = ko.observableArray();
	 self.allPlaces.forEach(function(place) {
	 	self.visiblePlaces.push(place);
	 });
	 var markerOptions;
	 var infowindow = [];
	 var markers = [];
	 var largeInfowindow = new google.maps.InfoWindow();
	 self.visiblePlaces().forEach(function(place){
	 	markerOptions = {
			map: googleMap,
			position: place.latLng,
			animation: google.maps.Animation.DROP
			};
			place.marker = new google.maps.Marker(markerOptions);
			markers.push(place.marker);
			infowindow = new google.maps.InfoWindow({
				content: place.name

			});
			place.marker.addListener('click', function() {
				populateInfoWindow(this, largeInfowindow);
			});
			console.log(place.name);
		});
		
	

	 //Takes in input and handles filtering
	 // self.userInput = ko.observable('');
	 // self.filterMarkers = function() {
	 // 	var searchInput = self.userInput().toLowerCase();
	 // 	self.visiblePlaces.removeAll();
	 // 	self.allPlaces.forEach(function(place) {
	 // 		place.marker.setMap();
		// if (place.name.toLowerCase().indexOf(searchInput) !== -1) {
		// 		self.visiblePlaces.push(place);
		// 	}
		// });
		
		
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
	ko.applyBindings( new koViewModel(googleMap, locationList));

	
});