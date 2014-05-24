/**
 * Service: Example
 *
 * Example service for providing data and controls to multiple scopes
 * throughout the application.
 *
 * Requirements
 * - nil
 */
tapthat.service('PubService', [
function () {
    var _current = null;
    return {
        'setCurrent': function (current) {
            _current = current;
        },
        'getCurrent': function () {
            return _current;
        }
    };
}]);
