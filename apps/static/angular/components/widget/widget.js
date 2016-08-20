/**
 * Widget Directive
 */

angular
    .module('RDash',['ui.bootstrap'])
    .directive('rd-widget', rdWidget);

function rdWidget() {
    var directive = {
        transclude: true,
        template: '<div class="widget" ng-transclude></div>',
        restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
        /* */
    }
};
