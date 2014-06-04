/**
 * Controller: Location
 * Manage the user's location and where the Map should be.
 */
pourclub.controller('LocationCtrl', [
'$scope', 'LocationService',
function ($scope, LocationService) {
    $scope.location_search = null;
    $scope.findLocation = function () {
        LocationService.setLocationByString($scope.location_search);
    };
    // Anytime the location changes, update the current suburb if not manual
    $scope.$watch(LocationService.getLocationSuburb, function (suburb) {
        $scope.location_search = suburb;
    });
}]);
