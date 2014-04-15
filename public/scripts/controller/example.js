/**
 * Controller: Example
 *
 * Base controller for managing consistant non-component interactions.
 *
 * Requirements:
 * - nil
 */
tapthat.controller('MapCtrl', ['$scope', 'PubFactory' function ($scope, PubFactory) {
    // Private
    // var _data = null;
    // Public
    $scope.yeah [];
    PubFactory.query(function (data) {
        $scope.yeah = data;
    });
    // $scope.setData = function (data) { _data = data; }
}]);
