/**
 * Controller: Map
 * Base controller for managing consistant non-component interactions.
 */
tapthat.controller('MapCtrl', [
'$scope', 'PubFactory', 'PubService', 'LocationService',
function ($scope, PubFactory, PubService, LocationService) {
    // Set current from service and update as it changes
    $scope.current = null;
    $scope.$watch(function () { return PubService.getCurrent(); }, function (new_pub, old_pub) {
        $scope.current = new_pub;
    });
    // Remove current pub
    $scope.close = function () {
        PubService.setCurrent(null);
    };
    // Set initial location to where user currently is
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (location) {
            $scope.$apply(function () {
                LocationService.setLocation(location.coords.latitude, location.coords.longitude);
            });
        },
        function (error) {
            LocationService.setLocation(-31.94914, 115.85891);
        });
    }
    else {
        LocationService.setLocation(-31.94914, 115.85891);
    }
    // Update selected pub on screen if changed anywhere
    $scope.$watch(PubService.getCurrent, function (pub) {
        $scope.current = PubService.getCurrent();
    });
}]);
