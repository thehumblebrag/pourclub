/**
 * Factory: Booze
 *
 * CRUD operations for Booze objects
 *
 * Requirements:
 * - ngResource
 */
tapthat.factory('BoozeFactory', [
'$resource',
function ($resource) {
    return $resource('/api/booze/:booze_id', {}, {
        'query': { method: 'GET', isArray: true },
        'update': { method: 'PUT' }
    });
}]);
