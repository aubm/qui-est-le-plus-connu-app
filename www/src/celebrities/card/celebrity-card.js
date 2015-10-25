angular.module('lpc.celebrities.card', [])

.directive('celebrityCard', function() {
    return {
        restrict: 'E',
        templateUrl: 'src/celebrities/card/celebrity-card.tpl.html',
        bindToController: {
            celebrity: '=',
            isSelected: '=',
            imagesOrigin: '='
        },
        scope: true,
        controllerAs: 'celebcard',
        controller: function() {}
    };
});
