/**
 * Controller: Location
 *
 * Manage the user's location and where the Map should be.
 */
tapthat.controller('LocationCtrl', ['$scope', 'LocationService', function ($scope, LocationService) {
    // Private
    // Public
    $scope.location_search = null;
    $scope.findLocation = function () {
        LocationService.setLocationByString($scope.location_search);
    };
}]);
