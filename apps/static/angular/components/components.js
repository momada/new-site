
angular
    .module('components',[])
    .directive('widget', function(){
			return{
				restrict: 'E',
				transclude: true,
				scope: {},
				template: '<div class="widget" myprop="abc" ng-transclude></div>',
				replace: true
			};
		}
		)

		.directive('widgetheader', function() {
			return {
				require: '^widget',
				restrict: 'E',
				transclude: true,
				scope: { title: '@', icon: '@' },
				template: '<div class="widget-header"><div class="row" style="height:25px"><div class="pull-left"><i class="fa" ng-class="icon"></i> {{title}} </div><div class="pull-right col-xs-6 col-sm-4" ng-transclude></div></div></div>',
				replace: true
			};
		})

		.directive('widgetbody', function() {
			return {
				require: '^widget',
				restrict: 'E',
				transclude: true,
				scope: {},
				template: '<div class="widget-body"><div class="widget-content" ng-transclude></div></div>',
				replace: true
			};
		})
