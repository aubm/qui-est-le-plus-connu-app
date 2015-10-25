angular.module('lpc.celebrities.duet.duetChart', ['chart.js'])

.directive('duetChart', function() {
    return {
        restrict: 'E',
        templateUrl: 'src/celebrities/duet/chart/duet-chart.tpl.html',
        bindToController: { chart: '=' },
        controllerAs: 'duetchart',
        scope: true,
        controller: function() {}
    };
});
