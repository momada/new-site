/**
 * Widget Footer Directive
 */

angular
    .module('RDash',['ui.bootstrap'])
    .directive('rd-widget-footer', rdWidgetFooter);

function rdWidgetFooter() {
    var directive = {
        requires: '^rd-widget',
        transclude: true,
        template: '<div class="widget-footer" ng-transclude></div>',
        restrict: 'E'
    };
    return directive;
};
