/**
 * Service: Example
 *
 * Example service for providing data and controls to multiple scopes
 * throughout the application.
 *
 * Requirements
 * - nil
 */
pourclub.service('PubService', [
'PubFactory',
function (PubFactory) {
    var _current = null;
    var _list = [];
    var setCurrent = function (current) {
        _current = current;
    };
    var getCurrent = function () {
        return _current;
    };
    var updateListByLocation = function (location, radius) {
        PubFactory.query({
            ll: [location.lat, location.lng].join(','),
            r: radius
        }, function (data) {
            _list = data;
        });
    };
    var getList = function () {
        return _list;
    };
    return {
        'setCurrent': setCurrent,
        'getCurrent': getCurrent,
        'getList': getList,
        'updateListByLocation': updateListByLocation
    };
}]);
