/**
 * Factory: Example
 *
 * Return a list of Example objects.
 *
 * Requirements:
 * - ngResource
 */
tapthat.factory('PubFactory', ['$resource', function ($resource) {
    return $resource('/pubs.json', {}, {
        'query': { 'method': 'GET', 'isArray': true }
    });
}]);
