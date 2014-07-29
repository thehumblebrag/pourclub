/**
 * Directive: GoogleMap
 * Google Maps directive for displaying a map and managing a
 * set of markers from the parent controller's scope.
 */
pourclub.directive('googleMap', [
'PubService', 'LocationService',
function (PubService, LocationService) {
    Number.prototype.toRad = function() {
        return this * (Math.PI / 180);
    };
    var _styles = [{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-17},{"gamma":0.36}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}];
    var _markers = [];
    var addMapMarker = function (map, position, id, title, icon) {
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            icon: {
                url: '/images/pin-drop.png',
                size: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(25, 25),
                scaledSize: new google.maps.Size(50, 50)
            },
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
        var latlng = new google.maps.LatLng(pub.latitude, pub.longitude);
        var marker = addMapMarker(map, latlng, pub._id, pub.name);
        // Set current to service when clicked
        google.maps.event.addListener(marker, 'click', function () {
            $scope.$apply(function () {
                PubService.setCurrent(pub);
            });
            map.setCenter(latlng);
            map.setZoom(18);
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
        this.markers.forEach(function (marker) {
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
    var onLocationChange = function (map, trigger_distance, callback) {
        var _start = null;
        var _end = null;
        google.maps.event.addListener(map, 'dragstart', function () {
            if (!_start) {
                _start = this.getCenter();
            }
        });
        google.maps.event.addListener(map, 'dragend', function () {
            _end = this.getCenter();
            if (_start && _end && google.maps.geometry.spherical.computeDistanceBetween(_start, _end) > trigger_distance) {
                callback(_end);
                _start = null;
                _end = null;
            }
        });
    };
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            // defaults
            var google_map = new google.maps.Map(element[0], {
                center: new google.maps.LatLng(-31.9522, 115.8589),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                navigationControl: false,
                mapTypeControl: false,
                disableDefaultUI: true,
                styles: _styles
            });
            // Update boundary search when zoom changes
            google.maps.event.addListener(map, 'zoom_changed', function() {
                var bounds = map.getBounds();
                var radius = google.maps.geometry.spherical.computeDistanceBetween(bounds.getNorthEast(), map.getCenter());
                LocationService.setRadius(radius);
            });
            onLocationChange(google_map, 1000, function (position) {
                LocationService.setLocation(position.lat(), position.lng());
            });
            // When pubs are added, show them on the map
            $scope.$watch(PubService.getList, function (pubs) {
                if (pubs.length) {
                    angular.forEach(pubs, function (pub, key) {
                        pubs._id = key;
                        mapLocation($scope, google_map, pub);
                    });
                }
            });
            $scope.$watch(LocationService.getLocation, function (location) {
                if (location) {
                    google_map.panTo(new google.maps.LatLng(location.lat, location.lng));
                }
            });
        }
    };
}]);
