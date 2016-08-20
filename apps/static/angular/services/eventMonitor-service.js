"use strict";
angular.module('myApp.eventMonitorService', [])
  .service('eventMonitorService', function($rootScope,$http, $location,$cookieStore) {
    var eventMonitors;
    this.getEventMoniters = function() {
      var promise = $http({method: 'GET', url: '/api/eventMonitors'})
            .success(function(data) {
              console.log(data);
              eventMonitors=data;
            }).
            error(function() {
              console.log("failed to load monitor");
            });
      return promise;
    };
  });
