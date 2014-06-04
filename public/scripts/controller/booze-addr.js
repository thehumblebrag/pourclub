/**
 * Controller: BoozeAddrCtrl
 *
 * Manage searching and adding Booze to a pub.
 *
 * Requirements:
 * - nilpmap
 */
pourclub.controller('BoozeAddrCtrl', [
'$scope', 'PubFactory', 'PubService', 'BoozeFactory',
function ($scope, PubFactory, PubService, BoozeFactory) {
    $scope.booze_search = null;
    $scope.booze_recommendations = [];
    // Search for beers by user provided string
    $scope.searchBoozes = function () {
        $scope.booze_recommendations = [];
        BoozeFactory.query({ search: $scope.booze_search }, function (boozes) {
            $scope.booze_recommendations = boozes;
        });
    };
    // Add select beer to current pub
    $scope.saveBeerToPub = function (booze) {
        var pub = PubService.getCurrent();
        pub.boozes.push(booze);
        pub.$update(function (resp) {
            if (resp.err) {
                console.log('Error', resp.err);
            }
        });
    };
}]);
