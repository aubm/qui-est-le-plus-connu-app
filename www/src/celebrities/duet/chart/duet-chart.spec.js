describe('lpc.celebrities.duet.duetChart', function() {

    beforeEach(module('lpc.celebrities.duet.duetChart'));
    beforeEach(module('lpc.partials'));

    describe('duetChart', function() {

        var chartData = {};
        var $scope, element;

        beforeEach(inject(function($rootScope, $compile) {
            $scope = $rootScope.$new();
            $scope.chartData = chartData;

            element = angular.element('<duet-chart chart="chartData"></duet-chart>');
            $compile(element)($scope);

            $rootScope.$digest();
            element.controller();

            $scope = element.isolateScope() || element.scope();
        }));

        it('should have an isolated scope with duetchart as controllerAs', function() {
            expect($scope.duetchart).toBeDefined();
            expect($scope.duetchart.chart).toBe(chartData);
        });

    });

});
