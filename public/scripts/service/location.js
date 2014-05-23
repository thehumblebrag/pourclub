/**
 * Service: Location
 * Track the current user's location and search focus.
 */
tapthat.service('LocationService', [function () {
    // Private
    var _location = null;
    // Public
    var setLocation = function (lat, lng) {
        if (typeof lat === "object") {
            _location = lat;
        }
        else {
            _location = { lat: lat, lng: lng };
        }
    };
    var getLocation = function () {
        return _location;
    };
    var setLocationByString = function (location) {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': location }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                setLocation(results[0].geometry.location.lat(),
                            results[0].geometry.location.lng());
            }
            else {
                window.console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
    };
    return {
        setLocation: setLocation,
        setLocationByString: setLocationByString,
        getLocation: getLocation
    };
}]);
