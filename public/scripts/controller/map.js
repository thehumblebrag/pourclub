/**
 * Controller: Map
 *
 * Base controller for managing consistant non-component interactions.
 *
 * Requirements:
 * - nil
 */
tapthat.controller('MapCtrl', ['$scope', 'PubFactory', function ($scope, PubFactory) {
    // Private
    // var _data = null;

    // Public

    $scope.pubs = [];
    PubFactory.query(function (data) {
        $scope.pubs = data;
    });

    $scope.user_location = null;
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (location) {
                $scope.$apply(function () {
                    $scope.user_location = {
                        "lat": location.coords.latitude,
                        "lng": location.coords.longitude
                    };
                });
                console.log($scope.user_location);
            },
            function (error) {
                console.log('error', error);
            }
        );
    }

}]);
