angular.module('lpc.common.loadIndicator', ['angular-spinkit'])

.directive('loadIndicator', function() {
    return {
        restrict: 'E',
        templateUrl: 'src/common/load-indicator/load-indicator.tpl.html',
        scope: true,
        bindToController: { show: '=' },
        controllerAs: 'loadind',
        controller: function() {}
    };
});
