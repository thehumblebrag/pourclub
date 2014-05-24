/**
 * Controller: Map
 *
 * Base controller for managing consistant non-component interactions.
 *
 * Requirements:
 * - nil
 */
tapthat.controller('MapCtrl', [
'$scope', 'PubFactory', 'PubService', 'LocationService',
function ($scope, PubFactory, PubService, LocationService) {
    $scope.close = function () {
        PubService.setCurrent(null);
    };
    // Set initial location to where user currently is
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (location) {
                $scope.$apply(function () {
                    LocationService.setLocation(location.coords.latitude,
                                                location.coords.longitude);
                });
            },
            function (error) {
                console.error('error', error);
            }
        );
    }
    // Update selected pub when changed
    $scope.$watch(PubService.getCurrent, function (pub) {
        $scope.current = PubService.getCurrent;
    });
}]);
