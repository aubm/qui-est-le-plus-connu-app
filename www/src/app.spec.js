describe('starter', function() {

    var $mockIonicPlatform = { ready: function(call) { call(); } };
    var $mockUrlRouterProvider = { otherwise: function() {} };
    var $mockStateProvider = { state: function() {} };
    var $mockCordovaDialogs = { alert: function() {} };
    var $mockImageCacheFactory = { Cache: function() {} };
    var mockCelebritiesManager = { randomlyGetTwoCelebrities: function() {} };
    var mockImagesOrigin = 'http://github.io';
    window.StatusBar = { styleDefault: function() {} };
    window.cordova = { plugins: { Keyboard: { hideKeyboardAccessoryBar: function() {} } } };

    beforeEach(module('starter'));
    beforeEach(module('lpc.partials'));

    beforeEach(module(function($provide) {
        $provide.value('$http', { get: function() {} }); // prevent $rootScope.$digest() to trigger an actual HTTP request
    }));

    it('should hide keyboard accessory bar and apply default style to status bar', function() {
        spyOn(window.StatusBar, 'styleDefault');
        spyOn(window.cordova.plugins.Keyboard, 'hideKeyboardAccessoryBar');

        lpcStarterRun($mockIonicPlatform);

        expect(window.StatusBar.styleDefault).toHaveBeenCalled();
        expect(window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar).toHaveBeenCalledWith(true);
    });

    describe('module config', function() {

        var $q, $rootScope;
        var stateArgs;
        var mockCelebrities = [
            { id: 'alexandre_astier', image_name: 'alexandre_astier.jpg', name: 'Alexandre Astier' },
            { id: 'kendji_girac', image_name: 'kendji_girac.jpg', name: 'Kendji Girac' }
        ];

        beforeEach(inject(function(_$q_, _$rootScope_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
        }));

        beforeEach(function() {
            spyOn($mockUrlRouterProvider, 'otherwise');
            spyOn($mockStateProvider, 'state');

            lpcStarterConfig($mockStateProvider, $mockUrlRouterProvider);
            stateArgs = $mockStateProvider.state.calls.mostRecent().args;
        });

        it('should be configured properly', function() {
            var stateParams = stateArgs[1];
            expect($mockStateProvider.state).toHaveBeenCalled();
            expect($mockUrlRouterProvider.otherwise).toHaveBeenCalledWith('/');
            expect(stateArgs[0]).toBe('root');
            expect(stateParams).toBeDefined();
            expect(stateParams.url).toBe('/');
            expect(stateParams.resolve.celebrities).toEqual(jasmine.any(Function));
        });

        it('should load celebrities successfully', function() {
            spyOn(mockCelebritiesManager, 'randomlyGetTwoCelebrities').and.returnValue(resolvedPromise(mockCelebrities));
            spyOn($mockImageCacheFactory, 'Cache').and.returnValue(resolvedPromise());

            var stateParams = stateArgs[1];
            stateParams.resolve.celebrities($mockCordovaDialogs, $mockImageCacheFactory, mockCelebritiesManager, mockImagesOrigin);

            $rootScope.$digest();

            expect($mockImageCacheFactory.Cache).toHaveBeenCalledWith(
                ['http://github.io/alexandre_astier.jpg', 'http://github.io/kendji_girac.jpg']
            );
        });

        it('should fail loading celebrities', function() {
            spyOn(mockCelebritiesManager, 'randomlyGetTwoCelebrities').and.returnValue(rejectedPromise());
            spyOn($mockCordovaDialogs, 'alert');

            var stateParams = stateArgs[1];
            stateParams.resolve.celebrities($mockCordovaDialogs, $mockImageCacheFactory, mockCelebritiesManager, mockImagesOrigin);

            $rootScope.$digest();

            expect($mockCordovaDialogs.alert).toHaveBeenCalledWith("Impossible d'obtenir la liste des célébrités ... :(", "Hum ...");
        });

        function resolvedPromise(data) {
            return $q(function(r) { r(data); });
        }

        function rejectedPromise() {
            return $q(function(_, r) { r(); });
        }

    });

});
