angular.module('lpc.common.persistence.simpleLocalPersistence', ['LocalStorageModule'])

.factory('simpleLocalPersistence', function($q, localStorageService) {
    var service = { set: set, get: get };

    function set(key, val) {
        return $q(function(resolve) {
            localStorageService.set(key, val);
            resolve();
        });
    }

    function get(key) {
        return $q(function(resolve, reject) {
            var v = localStorageService.get(key);
            if (v) {
                resolve(v);
            } else {
                reject();
            }
        });
    }

    return service;
})

.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('quiEstLePlusConnu');
});
