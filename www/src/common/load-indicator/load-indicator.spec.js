describe('lpc.common.loadIndicator', function() {

    beforeEach(module('lpc.common.loadIndicator'));
    beforeEach(module('lpc.partials'));

    describe('loadIndicator', function() {

        var loading = true;
        var $scope, element;

        beforeEach(inject(function($rootScope, $compile) {
            $scope = $rootScope.$new();
            $scope.loading = loading;

            element = angular.element('<load-indicator show="loading"></load-indicator>');
            $compile(element)($scope);

            $rootScope.$digest();
            element.controller();

            $scope = element.isolateScope() || element.scope();
        }));

        it('should have an isolated scope with loadind as controllerAs', function() {
            expect($scope.loadind).toBeDefined();
            expect($scope.loadind.show).toBe(loading);
        });

    });

});
