/**
 * Directive: GoogleMap
 *
 * Google Maps directive for displaying a map and managing a
 * set of markers from the parent controller's scope.
 */
tapthat.directive('googleMap', ['PubService', 'LocationService', function (PubService, LocationService) {

    // Private

    var _markers = [];

    var addGoogleMapMarker = function (map, position, id, title, icon) {
        var marker = new google.maps.Marker({
                map: map,
                position: position,
                title: title,
                icon: icon,
                optimized: false
            });
        marker.id = id;
        _markers.push(marker);
        return marker;
    };

    var mapLocation = function ($scope, map, pub) {
        if (pub.latitude === null || pub.longitude === null) {
            return false;
        }
        var marker = addGoogleMapMarker(map, // directive map
                                        new google.maps.LatLng(pub.latitude, pub.longitude),
                                        pub._id, // id
                                        pub.name, // title
                                        null // icon
                                        );
        // Set current to service when clicked
        google.maps.event.addListener(marker, 'click', function () {
            $scope.$apply(function () {
                PubService.setCurrent(pub);
            });
        });
        marker.pub = pub;
    };

     var centerOnMarker = function (map, settings) {
        var search_id = settings.id || false;
        var search_title = settings.title || false;
        var zoom = settings.zoom || false;
        var popup = settings.popup || false;
        var that = this;
        // Required settings not provided, return false and do nothing
        if (!search_id && !search_title) {
            return false;
        }
        // Search for the provided marker by title and ID and center
        $.each(this.markers, function (index, marker) {
            if (marker.title === search_title || marker.id === search_id) {
                that.panTo(marker.position);
                if (zoom) {
                    that.google_map.setZoom(zoom);
                }
                if (popup) {
                    that.showMarker(marker);
                }
            }
        });
    };

    // Public

    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            // defaults
            var google_map = new google.maps.Map(element[0], {
                center: new google.maps.LatLng(-31.9522, 115.8589),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false,
                navigationControl: false,
                mapTypeControl: false
            });
            // When pubs are added, show them on the map.
            // @TODO this is super confusing it's coming from the PubCtrl.. duh
            $scope.$watch('pubs', function (pubs) {
                if (pubs.length) {
                    angular.forEach(pubs, function (pub, key) {
                        pubs._id = key;
                        mapLocation($scope, google_map, pub);
                    });
                }
            });
            $scope.$watch(function () { return LocationService.getLocation(); }, function (location) {
                if (location) {
                    google_map.panTo(new google.maps.LatLng(location.lat, location.lng));
                }
            });
        }
    };

}]);
