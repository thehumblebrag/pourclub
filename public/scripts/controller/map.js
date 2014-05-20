/**
 * Controller: Map
 *
 * Base controller for managing consistant non-component interactions.
 *
 * Requirements:
 * - nil
 */
tapthat.controller('MapCtrl', ['$scope', 'PubFactory', 'PubService', function ($scope, PubFactory, PubService) {
    // Private
    // Public
    $scope.pubs = [];
    PubFactory.query(function (data) {
        $scope.pubs = data;
    });
    $scope.close = function () {
        PubService.setCurrent(null);
    };
    $scope.user_location = null;
    $scope.$watch(PubService.getCurrent, function (new_value, old_value) {
        $scope.current = new_value;
    });
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (location) {
                $scope.$apply(function () {
                    $scope.user_location = {
                        "lat": location.coords.latitude,
                        "lng": location.coords.longitude
                    };
                });
            },
            function (error) {
                console.log('error', error);
            }
        );
    }

}]);
