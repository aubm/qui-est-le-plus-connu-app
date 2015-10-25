// Karma configuration
// Generated on Thu Oct 22 2015 19:05:30 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'www/lib/angular/angular.js',
      'www/lib/angular-local-storage/dist/angular-local-storage.js',
      'www/lib/angular-spinkit/build/angular-spinkit.min.js',
      'www/lib/Chart.js/Chart.min.js',
      'www/lib/angular-chart.js/dist/angular-chart.js',
      'www/lib/firebase/firebase.js',
      'www/lib/angularfire/dist/angularfire.min.js',
      'www/lib/angular-mocks/angular-mocks.js',
      'www/src/**/*.tpl.html',
      'www/src/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'www/src/**/!(*spec).js': ['coverage'],
        'www/src/**/*.tpl.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
        stripPrefix: 'www/',
        moduleName: 'lpc.partials'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
