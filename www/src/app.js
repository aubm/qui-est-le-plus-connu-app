// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ionic.ion.imageCacheFactory',
    'lpc.common.loadIndicator', 'lpc.celebrities.duet.duetController'])

.run(lpcStarterRun)
.config(lpcStarterConfig)
.constant('firebaseOrigin', 'https://le-plus-connu.firebaseio.com')
.constant('imagesOrigin', 'https://qui-est-le-plus-connu.github.io/images/celebrities')
.constant('celebritiesUrl', 'https://qui-est-le-plus-connu.github.io/db.json');

function lpcStarterRun($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}

function lpcStarterConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('root', {
        url: '/',
        resolve: {
            celebrities: function($cordovaDialogs, $ImageCacheFactory, celebritiesManager, imagesOrigin) {
                return celebritiesManager.randomlyGetTwoCelebrities()
                    .then(preloadCelebritiesImage)
                    .catch(function(err) {
                        $cordovaDialogs.alert("Impossible d'obtenir la liste des célébrités ... :(", "Hum ...");
                    });

                function preloadCelebritiesImage(celebrities) {
                    return $ImageCacheFactory.Cache(celebrities.map(function(celebrity) {
                        return imagesOrigin + '/' + celebrity.image_name;
                    })).then(function() {
                        return celebrities;
                    });
                }
            }
        },
        templateUrl: 'src/celebrities/duet/duet.tpl.html',
        controller: 'CelebritiesDuetCtrl as cdc'
    });
}
