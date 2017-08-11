$(window).on("load", function() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 40.423218239442186,
			lng: -86.90529674291611
		},
		zoom: 17
	});

    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34));
        return markerImage;
    }


    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    var defaultIcon = makeMarkerIcon('FE7569');


	//array with all the information
	var locationList = [
	{name: 'Basil Thai', latLng: {lat: 40.422848654474635,lng: -86.90782070159912}, tag: 'restaurant'},
	{name: 'Chipotle',latLng: {lat: 40.42362457637239,lng: -86.9071501493454}, tag: 'restaurant'},
	{name: 'Blue Nile',latLng: {lat: 40.4245270847936,lng: -86.90841615200043}, tag: 'restaurant'},
	{name: 'Maru',latLng: {lat: 40.42450258246246,lng: -86.90679609775543}, tag: 'restaurant'}, 
	{name: 'Town and Gown',latLng: {lat: 40.42286090594257,lng: -86.90416753292084}, tag: 'restaurant'}, 
	{name: 'Oishi',latLng: {lat: 40.42146014031933,lng: -86.90384566783905}, tag: 'restaurant'}
	];


	var largeInfowindow = new google.maps.InfoWindow();
    //var bounds = new google.maps.LatLngBounds();


    //stores all markers
	var markers = [];
	for (var i = 0; i < locationList.length; i++) {
		var marker = new google.maps.Marker({
            position: locationList[i].latLng,
            map: map,
            title: locationList[i].name,
            animation: google.maps.Animation.DROP,
            id: i,
            icon: defaultIcon
        });

		//marker listeners and effects
        marker.addListener('click', handleclick);
        marker.addListener('mouseover', handlemouseover);
        marker.addListener('mouseout', handlemouseout);
        markers.push(marker);
	}

	function handleclick() {
		//this.setAnimation(google.maps.Animation.BOUNCE);
        populateInfoWindow(this, largeInfowindow);
	}

	function handlemouseover() {
		this.setIcon(highlightedIcon);
	}

	function handlemouseout() {
		this.setIcon(defaultIcon);
	}


//Wikipedia API
var HTMLinfoWindow = '<div>%data%</div>';
var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + locationList.tag + '&format=json&callback=wikiCallback';
$.ajax({
	url: wikiUrl,
	dataType: "jsonp",
	success: function(response) {
		// console.log(locations);
		var articleList = response[1];

		for(var i = 0; i < locationList.length; i++) {
			var url = 'http://en.wikipedia.org/wiki/' + locationList[i].tag;
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
	var map;
	//filterList display
	var viewModel = {
		//observable array of locations
		locations: ko.observableArray(),
		initLoc: function(){
			for(var i =0;i <locationList.length;i++){
				this.locations().push(locationList[i]);
			}
			
		},
		//search query
		query: ko.observable(""),

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
				console.log(i);
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

	//opens info window on button click
	this.openInfoWin = function() {	
		var btnClk = (this.name.trim());
		for (var i = 0; i < markers.length; i++) {
			if (markers[i].title === btnClk) {
				//markers[i].setAnimation(google.maps.Animation.BOUNCE);
				populateInfoWindow(markers[i], largeInfowindow);
			}
		}
	};
	viewModel.initLoc();
	viewModel.query.subscribe(viewModel.search);

	ko.applyBindings(viewModel);

});