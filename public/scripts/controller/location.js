/**
 * Controller: Location
 *
 * Manage the user's location and where the Map should be.
 */
tapthat.controller('LocationCtrl', ['$scope', 'LocationService', function ($scope, LocationService) {
    $scope.location_search = null;
    $scope.findLocation = function () {
        LocationService.setLocationByString($scope.location_search);
    };
    // Default location is Northbridge
    LocationService.setLocation(-31.94914, 115.85891459999993);
}]);
