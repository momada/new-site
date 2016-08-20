"use strict";
angular.module('myApp',[
	'ngRoute',
	'ngCookies',
	'myApp.dashboard',
	'myApp.login',
	'chieffancypants.loadingBar'
])
  .config(function($routeProvider, cfpLoadingBarProvider) {
		var ready = true;
    $routeProvider
      .when('/',
				{ templateUrl: 'angular/views/dashboard/dashboard.html',
					controller: 'DashboardController',
					resolve:ready})
			.when('/login',
				{ templateUrl: 'angular/views/login/login.html',
					controller: 'LoginController',
					resolve:ready})
      .otherwise({redirectTo: '/'});

    cfpLoadingBarProvider.includeSpinner = true;
  })

  .run(function($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      var loggedIn = $rootScope.globals.currentUser;
      if (!loggedIn) {
				console.log("not login")
        $location.path('/login');
      }
    });
  });
