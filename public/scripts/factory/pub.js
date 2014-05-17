/**
 * Factory: Example
 *
 * Return a list of Example objects.
 *
 * Requirements:
 * - ngResource
 */
tapthat.factory('PubFactory', ['$resource', function ($resource) {
    return $resource('/api/pub', {}, {
        'query': { 'method': 'GET', 'isArray': true }
    });
}]);
