describe('lpc.celebrities.card', function() {

    beforeEach(module('lpc.celebrities.card'));
    beforeEach(module('lpc.partials'));

    describe('loadIndicator', function() {

        var celebrity = {}, isSelected = false, imagesOrigin = 'http://google.com';
        var $scope, element;

        beforeEach(inject(function($rootScope, $compile) {
            $scope = $rootScope.$new();
            $scope.celebrity = celebrity;
            $scope.isSelected = isSelected;
            $scope.imagesOrigin = imagesOrigin;

            element = angular.element('<celebrity-card celebrity="celebrity" is-selected="isSelected" images-origin="imagesOrigin"></celebrity-card>');
            $compile(element)($scope);

            $rootScope.$digest();
            element.controller();

            $scope = element.isolateScope() || element.scope();
        }));

        it('should have an isolated scope with celebcard as controllerAs', function() {
            expect($scope.celebcard).toBeDefined();
            expect($scope.celebcard.celebrity).toBe(celebrity);
            expect($scope.celebcard.isSelected).toBe(isSelected);
            expect($scope.celebcard.imagesOrigin).toBe(imagesOrigin);
        });

    });

});
