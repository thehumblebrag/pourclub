/**
 * Controller: PlaceDrinkCtrl
 * Manage searching and adding Drink to a place.
 */
pourclub.controller('PlaceDrinkCtrl', [
'$scope', 'PubFactory', 'PubService', 'DrinkFactory',
function ($scope, PubFactory, PubService, DrinkFactory) {
    var _show = false;
    $scope.toggle = function (state) {
        _show = typeof state !== "undefined" ? state : !_show;
        return _show;
    };
    $scope.isVisible = function () {
        return _show;
    };
    $scope.drink_search = null;
    $scope.drink_recommendations = [];
    // Search for beers by user provided string
    $scope.searchDrinks = function () {
        $scope.drink_recommendations = [];
        DrinkFactory.query({ search: $scope.drink_search }, function (drinks) {
            $scope.drink_recommendations = drinks;
        });
    };
    // Add select beer to current pub
    $scope.saveBeerToPub = function (drink) {
        var pub = PubService.getCurrent();
        pub.drinks.push(drink);
        pub.$update(function (resp) {
            if (resp.err) {
                console.error(resp.err);
            }
            $scope.drink_recommendations = [];
        });
    };
    // Delete beer from pub
    $scope.deleteBeerFromPub = function (drink, pub) {
        pub.drinks = pub.drinks.filter(function (_drink) {
            return drink.id !== _drink.id;
        });
        pub.$update(function (resp) {
            if (resp.err) {
                console.error(resp.err);
            }
        });
    };
}]);
