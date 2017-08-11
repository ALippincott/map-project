

$(window).on("load", function() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 40.421704,
			lng: -86.901214
		},
		zoom: 16
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
	{name: 'La Scala', latLng: {lat:40.419343, lng: -86.893991}, tag: 'restaurant'},
	{name: 'Red Seven',latLng: {lat: 40.419306,lng:   -86.895313}, tag: 'restaurant'},
	{name: 'Blue Nile',latLng: {lat: 40.4245270847936,lng: -86.90841615200043}, tag: 'restaurant'},
	{name: 'Maru',latLng: {lat: 40.42450258246246,lng: -86.90679609775543}, tag: 'restaurant'}, 
	{name: 'Town and Gown',latLng: {lat: 40.42286090594257,lng: -86.90416753292084}, tag: 'restaurant'}, 
	{name: 'Nine Irish Brothers',latLng: {lat: 40.422915,lng: -86.903171}, tag: 'restaurant'}
	];


	var infowindow = new google.maps.InfoWindow();
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
        api(this);
        
	}

	function handlemouseover() {
		this.setIcon(highlightedIcon);
	}

	function handlemouseout() {
		this.setIcon(defaultIcon);
	}



//Creates Info Windows
function populateInfoWindow(innerHTML, marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	//if (infowindow.marker != marker) {
		
	//}
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
//API
var api = function(marker){
	var ll = "";
	var limit = "&limit=1";
	var query = "&radius=25"
	var intent = "&intent=checkin";
	var client_id = "&client_id=W2Y5VDE05JUYUKIDVVVF15ATLRTTM40SSOV5Y0HY2W3MVGRL";
	var client_secret = "&client_secret=IKGFWYKIOKYJBLAKATJZAI4OXIWZ05P5XDSX3I2RNYFA5XXN";
	var version = '&v=20170811'
	ll = "ll=" + marker.position.lat() + "%2C%20" + marker.position.lng();
    url = "https://api.foursquare.com/v2/venues/explore?v=20161016&" + ll + limit + query +  client_id + client_secret + version;
	
		//gets information from url and stores them into infobox + error checking
        $.getJSON(url, function(data) {
        	infowindow.marker = marker;
        	
			var innerHTML = '<div>';
	        if (data.response.groups[0].items[0].venue.name) {
	            innerHTML += '<strong>' + data.response.groups[0].items[0].venue.name + '</strong>';
	           
	        }
	        if (data.response.groups[0].items[0].venue.location.address) {
	            innerHTML += '<br>' + data.response.groups[0].items[0].venue.location.address;
	        }
	        if (data.response.groups[0].items[0].venue.location.city) {
	            innerHTML += '<br>' + data.response.groups[0].items[0].venue.location.city;
	        }
	        if (data.response.groups[0].items[0].venue.location.state) {
	            innerHTML += '<br>' + data.response.groups[0].items[0].venue.location.state;
	        }
	        if (data.response.groups[0].items[0].venue.location.postalCode) {
	            innerHTML += ' ' + data.response.groups[0].items[0].venue.location.postalCode;
	        }

	        innerHTML += '</div>';
	       // infowindow.setContent("yes");
	       
			infowindow.setContent(innerHTML);
			infowindow.open(map, marker);
			marker.setAnimation(google.maps.Animation.DROP);
			// Make sure the marker property is cleared if the infowindow is closed.
			infowindow.addListener('closeclick', function() {
				infowindow.setMarker = null;

			});
	      
		}).error(function(e) {
			alert("Could not request url");
		}); 
 
};
	//opens info window on button click
	this.openInfoWin = function() {	
		var btnClk = (this.name.trim());
		for (var i = 0; i < markers.length; i++) {
			if (markers[i].title === btnClk) {
				api(markers[i]);
				markers[i].setAnimation(google.maps.Animation.DROP);

			}
		}
	};
	viewModel.initLoc();
	viewModel.query.subscribe(viewModel.search);

	ko.applyBindings(viewModel);

});