/**
 * Factory: Drink
 *
 * CRUD operations for Drink objects
 *
 * Requirements:
 * - ngResource
 */
pourclub.factory('DrinkFactory', [
'$resource',
function ($resource) {
    return $resource('/api/drink/:drink_id', {}, {
        'query': { method: 'GET', isArray: true },
        'update': { method: 'PUT' }
    });
}]);
