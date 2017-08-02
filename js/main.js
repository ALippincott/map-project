var koViewModel = function(map, locationList) {
	var self = this;
	//availableLocations: locationList.names;
	self.googleMap = map;
	self.allPlaces = [];
	locationList.forEach(function(place) {
		self.allPlaces.push(new Place(place));
	});
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
	self.allPlaces.forEach(function(place) {
		ko.applyBindings({
			location: place.name
		});
	});
	self.visiblePlaces = ko.observableArray();
	self.allPlaces.forEach(function(place) {
		self.visiblePlaces.push(place);
	});
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
		self.visiblePlaces().forEach(function(place) {
			place.marker.setMap(self.googleMap);
		});
	};

	function Place(locationList) {
		this.name = locationList.name;
		this.latLng = locationList.latLng;
		this.marker = null;
	}
};

function createMap() {
	return new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 40.423218239442186,
			lng: -86.90529674291611
		},
		zoom: 17
	});
}
google.maps.event.addDomListener(window, 'load', function() {
	var locationList = [{
		name: 'Basil Thai',
		latLng: {
			lat: 40.422848654474635,
			lng: -86.90782070159912
		}
	}, {
		name: 'Chipotle',
		latLng: {
			lat: 40.42362457637239,
			lng: -86.9071501493454
		}
	}, {
		name: 'Blue Nile',
		latLng: {
			lat: 40.4245270847936,
			lng: -86.90841615200043
		}
	}, {
		name: 'Maru',
		latLng: {
			lat: 40.42450258246246,
			lng: -86.90679609775543
		}
	}, {
		name: 'Town and Gown',
		latLng: {
			lat: 40.42286090594257,
			lng: -86.90416753292084
		}
	}, {
		name: 'Nine Irish Brothers',
		latLng: {
			lat: 40.422909911791955,
			lng: -86.90318048000336
		}
	}, {
		name: 'Oishi',
		latLng: {
			lat: 40.42146014031933,
			lng: -86.90384566783905
		}
	}];
	var googleMap = createMap();
	ko.applyBindings(new koViewModel(googleMap, locationList));
});