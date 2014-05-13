/**
 * Controller: BoozeAddrCtrl
 *
 * Manage searching and adding Booze to a pub.
 *
 * Requirements:
 * - nil
 */
tapthat.controller('BoozeAddrCtrl', ['$scope', 'PubFactory', 'PubService', 'BoozeFactory', function ($scope, PubFactory, PubService, BoozeFactory) {
    // Private

    // Public
    $scope.booze = 'boozer';
    $scope.booze_recommendations = [];

    $scope.$watch(PubService.getCurrent, function (new_value, old_value) {
        $scope.pub = new_value;
    });

    $scope.searchBoozes = function () {
        $scope.booze_recommendations = [];
        BoozeFactory.query({ search: $scope.booze }, function (boozes) {
            $scope.booze_recommendations = boozes;
        });
    };

    $scope.saveBeerToPub = function (beer) {
        console.log('Save the beer', beer.name, 'to the pub', $scope.pub.name, 'Kendrick');
    };

}]);
