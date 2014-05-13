/**
 * Factory: BoozeFactory
 *
 * Return a list of Example objects.
 *
 * Requirements:
 * - ngResource
 */
tapthat.factory('BoozeFactory', ['$resource', function ($resource) {
    return $resource('/boozes.json', {}, {
        get: { 'method': 'GET', 'isArray': true }
    });
}]);
