function catchErrors() {
    alert("Errors");
}
// Getting simple Symbol to my marker from that link
var symbol = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/green.png';
// Our Model University
var university = function(uni_data) {

    var self = this;

    this.name = uni_data.name;
    this.latitude = uni_data.latitude;
    this.longitude = uni_data.longitude;
    this.country = "";
    this.county = "";
    this.label = "";
    this.region = "";
    this.region_gid = "";
    this.country_a = "";
    this.country_gid = "";


    this.visible = ko.observable(true);

    //  Make the URL for The api of the university 
    // API KEY for My API
    var API_KEY = "mapzen-QEEQwwX";
    // AJAX Request To Get JSON Data
    $.ajax({
        url: "https://search.mapzen.com/v1/search",
        method: "GET",
        dataType: "json",
        data: {
            "text": this.name,
            "api_key": "mapzen-QEEQwwX" // My API KEY from website
        },
        success: function(data, status, jqxhr) {
            console.log("data", data);
        },
        error: function(jqxhr, status, error) {
            console.log("Something went wrong!");
        }
    }).done(function(result) {
        var results = result.features[0].properties;
        //var anotherResult=result.features[2].properties;

        // Getting the Country
        self.country = results.country;
        // Getting the Governorate
        self.county = results.county;
        // Getting the Label
        self.label = results.label;
        // Getting the Region
        self.region = results.region;
        // Getting Region_gid
        self.region_gid = results.region_gid;
        // Getting Country A
        self.country_a = results.country_a;
        // Getting Country GID
        self.country_gid = results.country_gid;

    }).fail(function(err) {
      alert("Error in loading Mapzen Api. Please try again.");
    });
    // add information to window
    self.ContentOfInfoUniversityWindow = create_info_window(self);
    // create new information window
    self.infoWindow = new google.maps.InfoWindow({
        content: self.ContentOfInfoUniversityWindow
    });

    /* Create a marker for locations */
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(uni_data.latitude, uni_data.longitude),
        map: map,
        icon: symbol,
        title: uni_data.name,
    });
    //Adding Listener To The Map when  click on the marker 
    this.marker.addListener('click', function() {

        self.ContentOfInfoUniversityWindow = create_info_window(self);
        // Filling Info Window with data 
        self.infoWindow.setContent(self.ContentOfInfoUniversityWindow);
        self.infoWindow.open(map, this);

        // Adding Animation to The Marker 
        self.marker.setAnimation(google.maps.Animation.BOUNCE);

        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 1500);
    });

    this.selectMarker = function(place) {
        google.maps.event.trigger(self.marker, 'click');
    };

    // To add the marker to the map, using setMap()
    this.showMarker = ko.computed(function() {
        if (this.visible() === true) {
            this.marker.setVisible(true);
        } else {
            this.marker.setVisible(false);
        }
        return true;
    }, this);

};
// Start Creating information Window of the Marker 
function create_info_window(data) {
    // Collecting Data to open it on the infow window on the map 	
    ContentOfInfoUniversityWindow = '<div class="info-window-content" style="background-color:orange;">' +
        '<h3 class="title" style="color:blue;"><b>' + data.name + "</b></h3>" +
        '<div class="content" style="color:green;">' + data.county + " </div>" +
        '<div class="content" style="color:green;">' + data.country + "</div>" +
        '<div class="content" style="color:green;">' + data.label + "</div>" +
        '<div class="content" style="color:green;">' + data.region + "</div>" +
        '<div class="content" style="color:green;">' + data.region_gid + "</div>" +
        '<div class="content" style="color:green;">' + data.country_a + "</div>" +
        '<div class="content" style="color:green;">' + data.country_gid + "</div></div>";
    //Assigning Data to info window
    return ContentOfInfoUniversityWindow;
}
// End Creating information Window of the Marker 
function ViewModel() {

    var self = this;
    // Declaring Our Obeservable data 
    this.List_Of_Universities = ko.observableArray([]);
    this.search_University = ko.observable("");

    /* Making My Map Responsive */
    google.maps.event.addDomListener(window, "resize", function() {
        var center_loc = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center_loc);
    });

    
    // Now Store Returned List Of Data of Our Universitis
    this.List_Of_Universities = ko.observableArray(Create_Universities()());
    
    // Start Filtering the searched Word
    this.SearchUniversitiesFilter = function() {
        var filterItem = self.search_University().toLowerCase();
        for (var index = 0; index < self.List_Of_Universities().length; index++) {
            var x = self.List_Of_Universities()[index].name.toLowerCase();
            if (x.search(filterItem) >= 0) {
                self.List_Of_Universities()[index].visible(true);

            } else {
                self.List_Of_Universities()[index].visible(false);
            }
        }
    };
}
/* Create Markers of Our Universities  */
function Create_Universities() {
    List_Of_Universities = ko.observableArray([]);
    //alert(Universities.length);
    for (var index = 0; index < Universities.length; index++) {
        List_Of_Universities.push(new university(Universities[index]));
    }
    //alert(List_Of_Universities().length); should be 6
    return List_Of_Universities;
}
// Adding some styles To My Map from
// https://snazzymaps.com
var styles = [{
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#444444"
        }]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
            "color": "#56aecb"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "all",
        "stylers": [{
            "visibility": "on"
        }]
    },
    {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [{
            "visibility": "on"
        }]
    },
    {
        "featureType": "poi.medical",
        "elementType": "all",
        "stylers": [{
            "visibility": "on"
        }]
    },
    {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [{
            "visibility": "on"
        }]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{
                "saturation": "-100"
            },
            {
                "lightness": 45
            },
            {
                "visibility": "on"
            },
            {
                "color": "#a3c741"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [{
            "visibility": "simplified"
        }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{
            "visibility": "on"
        }]
    },
    {
        "featureType": "transit.line",
        "elementType": "all",
        "stylers": [{
            "visibility": "on"
        }]
    },
    {
        "featureType": "transit.station",
        "elementType": "all",
        "stylers": [{
            "visibility": "on"
        }]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
                "color": "#76d4fb"
            },
            {
                "visibility": "on"
            }
        ]
    }
];

function beginMap() {
    /* Constructor Initialize Our Map */
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 30.05,
            lng: 31.25
        },
        zoom: 13,
        styles: styles
    });

    ko.applyBindings(new ViewModel());
}
// Create some Initial Universities for using them 
var Universities = [{
        name: 'American University Cairo',
        latitude: 30.042664,
        longitude: 31.236703
    },
    {
        name: 'Cairo University',
        latitude: 30.022014692,
        longitude: 31.2071987008
    },
    {
        name: 'Helwan University',
        latitude: 30.013056,
        longitude: 31.208853
    },
    {
        name: 'Ain Shams University',
        latitude: 30.077022,
        longitude: 31.285017
    },
    {
        name: 'fayoum University',
        latitude: 30.090331,
        longitude: 31.329141
    },
    {
    	name:'Muqattam University',
    	latitude: 30.021667,
    	longitude:31.303333
    }
];