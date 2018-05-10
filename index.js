
var map;

var rawLocations;
var locations = [];

const URLGeoJSON = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson"
const URLDistsInfo = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";

function initMap() {
        var customCenter = {lat:40.702649, lng:-73.993746}//Aestethic location
        //map
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10.9, //Map's zoom
          center: customCenter,//
          mapTypeId: 'terrain'
        });
        //marker
        var nyu_coordinates = {lat:40.7290549,lng:-73.9965233};
        var ny_marker = new google.maps.Marker({//New marker instance
          position: nyu_coordinates,
          map: map
        });

        //Districts
        map.data.loadGeoJson(URLGeoJSON);//Show me the districts.

        //Districs' display style
        map.data.setStyle(function(feature) {//Copy-Paste of Example Google's "Data Layer: Dynamic Styling"
          var color = '#2A7F62';
          if (feature.getProperty('isColorful')) {
            color = feature.getProperty('color');
          }
          return /** @type {google.maps.Data.StyleOptions} */({
            fillColor: color,
            fillOpacity: 0.01,
            strokeColor: color,
            strokeWeight: 2
          });
        });

        // When the user clicks, set 'isColorful', changing the color of the letters.
        map.data.addListener('click', function(event) {
          event.feature.setProperty('isColorful', true);
        });

        // When the user hovers, tempt them to click by outlining the letters.
        // Call revertStyle() to remove all overrides. This will use the style rules
        // defined in the function passed to setStyle()
        map.data.addListener('mouseover', function(event) {
          map.data.revertStyle();
          map.data.overrideStyle(event.feature, {strokeWeight: 8});
        });

        map.data.addListener('mouseout', function(event) {
          map.data.revertStyle();
        });

        //For future markers
        getDataFromURL(URLDistsInfo);
      }

      function getDataFromURL(URL){
        var data = $.get(URL, function(array){
      		console.log(URL)
      	})
      		.done( function(){//Make me a new Locations Array
      			//Success
      			//console.log(data);

            for (var i = 0; i < data.responseJSON.data.length; i++) {//making through raw latlng rawLocations and making positions
              rawLocations = data.responseJSON.data[i][9];
              locations[i] = {lat: parseFloat(rawLocations.toString().substring(7,rawLocations.toString().lastIndexOf(" "))), lng:parseFloat(rawLocations.toString().substring(rawLocations.toString().lastIndexOf(" ")))};
            }
        });
      }