/**
 * Service: Location
 * Track the current user's location and search focus.
 */
tapthat.service('LocationService', [
'$timeout', 'PubService',
function ($timeout, PubService) {
    var _location = null;
    var _suburb = null;
    var _radius = 2000;
    var _geocoder = new google.maps.Geocoder();
    var setLocation = function (lat, lng) {
        if (typeof lat === "object") {
            _location = lat;
        }
        else {
            _location = { lat: lat, lng: lng };
        }
        PubService.updateListByLocation(getLocation(), getRadius());
        setSuburbFromLocation(lat, lng);
    };
    var getLocation = function () {
        return _location;
    };
    var setRadius = function (radius) {
        _radius = radius;
    }
    var getRadius = function () {
        return _radius;
    }
    var getLocationSuburb = function () {
        return _suburb;
    }
    var setSuburbFromLocation = function (lat, lng) {
        var latlng = new google.maps.LatLng(lat, lng);
        _geocoder.geocode({ latLng: latlng }, function (results, status) {
            var localities;
            if (status === google.maps.GeocoderStatus.OK) {
                if (results.length) {
                    localities = results[0].address_components.filter(function (component) {
                        return component.types.indexOf('locality') >= 0;
                    });
                    if (localities.length) {
                        // Force reset to ensure $watch triggers
                        $timeout(function () {
                            _suburb = localities[0].long_name;
                        }, 0);
                    }
                }
            }
        });
    };
    var setLocationByString = function (location) {
        _geocoder.geocode({ 'address': location }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                setLocation(results[0].geometry.location.lat(),
                            results[0].geometry.location.lng());
            }
            else {
                console.error('Geocode was not successful for the following reason: ' + status);
            }
        });
    };
    return {
        setLocation: setLocation,
        setLocationByString: setLocationByString,
        getLocation: getLocation,
        getLocationSuburb: getLocationSuburb
    };
}]);
