/**
 * Created by Mitaka on 19-Apr-17.
 */
angular.module('starter.services', ['ngResource'])

    .constant('baseUrl', 'http://waytrack.mybluemix.net/')

    .service('mapFactory', ['$filter', function ($filter) {

        this.getMap = function (locations, mapContainer) {

            var mapElement = document.getElementById(mapContainer);

            var center = new google.maps.LatLng(locations[0].lat, locations[0].long);

            var mapOptions = {
                center : center,
                zoom : 17,
                zoomControl : false, //+- buttons
                streetViewControl : false //Pegman icon
            };

            var map = new google.maps.Map(mapElement, mapOptions);

            // if this is only the very last location from the DB
            if (locations.length === 1) {

                var marker = new google.maps.Marker({
                    position : new google.maps.LatLng(locations[0].lat, locations[0].long),
                    title : 'Last know position'
                });

                var time = $filter('date')(locations[0].createdAt, 'EEEE, MMM d yyyy, HH:mm:ss');

                var infoContent = '<span>Last known location recorded at:</span><br><span>' + time +'</span>';

                var infoWindow = new google.maps.InfoWindow({
                    content : infoContent
                });

                marker.addListener('click', function () {
                    infoWindow.open(map, marker);
                });

                marker.setMap(map);
            }
            else {



                var lastLocation = null;



                var markerLocations = [];


                for (var x = 0; x < locations.length; x++) {

                    var lat = locations[x].lat;
                    var long = locations[x].long;


                    // offset schema for markers that point to exact same location
                    var offset = [
                        {x : 0.00015, y : 0.00015},     // 1
                        {x : 0.0001, y : 0},            // 2
                        {x : 0.0001, y : -0.0001},      // 3
                        {x : 0, y : -0.0001},           // 4
                        {x : -0.0001, y : -0.0001},     // 5
                        {x : -0.0001, y : 0},           // 6
                        {x : -0.0001, y : 0.0001},      // 7
                        {x : 0, y : 0.0001},            // 8
                        {x : 0.0001, y : 0.0001},       // 9
                        {x : 0.00015, y : 0},           // 10
                        {x : -0.00015, y : -0.00015},   // 11
                        {x : 0, y : -0.00015},          // 12
                        {x : -0.00015, y : -0.00015},   // 13
                        {x : -0.00015, y : 0},          // 14
                        {x : -0.00015, y : 0.00015},    // 15
                        {x : 0, y : 0.00015},           // 16
                        {x : 0.00018, y : 0.00018}      // 17
                    ];

                    var index = 0;
                    var finalLat = lat;
                    var finalLong = long;

                    if (lastLocation) { // if another marker already have been created

                        // defines minimum deviation of the location that is considered enough for creating new marker
                        var minLat = lat - 0.0002;
                        var maxLat = lat + 0.0002;
                        var minLong = long - 0.0002;
                        var maxLong = long + 0.0002;

                        // check if the new location is not the same like the last defined marker
                        if (((lastLocation.lat < minLat) || (lastLocation.lat > maxLat)) ||
                            ((lastLocation.long < minLong) || (lastLocation.long > maxLong))) {

                            // loop through the previously defined markers
                            for (var y = 0; y < markerLocations.length; y++) {

                                // if the new location is not the same like the last defined marker but equals some of the previous markers
                                if ((markerLocations[y].lat === finalLat) && (markerLocations[y].lng === finalLong)) {

                                    finalLat = lat + offset[index].x;
                                    finalLong = long + offset[index].y;

                                    index++;
                                }
                            }

                            markerLocations.push({
                                lat : finalLat,
                                lng : finalLong
                            });

                            lastLocation = locations[x];
                        }

                    } else { //if no previous markers

                        markerLocations.push({
                            lat : lat,
                            lng : long
                        });

                        lastLocation = locations[x];
                    }
                }

                // marker labels are presented with numbers - 1 is the start location
                var i = 0;

                var markers = markerLocations.map(function (location) {

                    i++;

                    return new google.maps.Marker({
                        position : location,
                        label : i.toString()
                    });

                });

                // shows marker cluster
                var markerCluster = new MarkerClusterer(map, markers,
                    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
                );

                // center map so all the markers remain visible
                var bounds = new google.maps.LatLngBounds();

                for(var count = 0; count < markers.length; count++) {
                    bounds.extend(markers[count].getPosition());
                }

                map.setCenter(bounds.getCenter());

                map.fitBounds(bounds);




            }
        };
    }])

    .factory('userService', ['$resource', 'baseUrl', function ($resource, baseUrl) {

        return $resource(baseUrl + 'users/:userId');

    }])

    .factory('locationFactory', ['$resource', 'baseUrl', function ($resource, baseUrl) {

        var fac = {};

        fac.location = function (period) {

            if (period) {
                return $resource(baseUrl + 'locations/' + period);
            } else {
                return $resource(baseUrl + 'locations/:locationId');
            }

        };

        return fac;

    }])

    .filter('removeHyphens', [function () {
        return function (str) {
            return str.replace(/-/g, ' ');
        }
    }])
;