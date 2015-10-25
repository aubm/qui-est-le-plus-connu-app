describe('lpc.common.persistence.simpleLocalPersistence', function() {

    var localStorageService = { set: function() {}, get: function() {} };

    beforeEach(module('lpc.common.persistence.simpleLocalPersistence'));

    beforeEach(module(function($provide) {
        $provide.value('localStorageService', localStorageService);
    }));

    describe('simpleLocalPersistence', function() {

        var $rootScope;
        var simpleLocalPersistence;

        beforeEach(inject(function(_$rootScope_, _simpleLocalPersistence_) {
            $rootScope = _$rootScope_;
            simpleLocalPersistence = _simpleLocalPersistence_;
        }));

        it('should be an instance of my factory', function() {
            expect(simpleLocalPersistence).toBeDefined();
        });

        it('should call localStorageService.set function', function() {
            spyOn(localStorageService, 'set');

            simpleLocalPersistence.set('foo', 'bar');

            expect(localStorageService.set).toHaveBeenCalled();
        });

        it('should resolve the promise', function(done) {
            var returnValue = 'my return value';
            spyOn(localStorageService, 'get').and.returnValue(returnValue);
            simpleLocalPersistence.get('foo')
                .then(onResolve, onReject)
                .finally(done);

            $rootScope.$digest(); // resolve promises

            function onResolve(v) {
                expect(v).toBe(returnValue);
            }

            function onReject() {
                fail('Promise should be resolved');
            }
        });

        it('should reject the promise', function(done) {
            spyOn(localStorageService, 'get').and.returnValue(false);
            simpleLocalPersistence.get('foo')
                .then(onResolve)
                .finally(done);

            $rootScope.$digest();

            function onResolve() {
                fail('Promise should be rejected');
            }
        });

    });

});
