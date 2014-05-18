/**
 * Factory: Pub
 *
 * CRUD operations for Pub objects
 *
 * Requirements:
 * - ngResource
 */
tapthat.factory('PubFactory', ['$resource', function ($resource) {
    return $resource('/api/pub/:pub_id', { pub_id: '@_id' }, {
        'query': { method: 'GET', isArray: true },
        'update': { method: 'PUT' }
    });
}]);
