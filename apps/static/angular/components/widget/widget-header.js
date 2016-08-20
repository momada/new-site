/**
 * Widget Header Directive
 */

angular
    .module('RDash',['ui.bootstrap'])
    .directive('rd-widget-header', rdWidgetTitle);

function rdWidgetTitle() {
    var directive = {
        requires: '^rd-widget',
        scope: {
            title: '@',
            icon: '@'
        },
        transclude: true,
        template: '<div class="widget-header"><div class="row"><div class="pull-left"><i class="fa" ng-class="icon"></i> {{title}} </div><div class="pull-right col-xs-6 col-sm-4" ng-transclude></div></div></div>',
        restrict: 'E'
    };
    return directive;
};
