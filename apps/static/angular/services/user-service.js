"use strict";
angular.module('myApp.userService', ['myApp.authUtils'])
  .service('userService', function($rootScope,$http, $location,$cookieStore, Base64) {

    this.doLogin = function(username, password) {
      var promise = $http({method: 'POST', url: '/api/user/authentication',
          data: {
            'username': username,
            'password': password
          }
        })
            .success(function(data) {
              console.log(data);
              $rootScope.globals.currentUser = data;
              var authdata = Base64.encode(username + ':' + password);
              $rootScope.globals.authdata=authdata;
              $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
              $cookieStore.put('globals', $rootScope.globals);

            }).
            error(function() {
              console.log("failed to login");
            });
      return promise;
    };

    this.resetMonitor = function(userId, monitorId) {
      var promise = $http({method: 'POST', url: '/api/user/resetMonitor',
          data: {
            'userId': userId,
            'monitorId': monitorId
          }
        })
        .success(function(data) {
          console.log(data);
        }).
        error(function() {
          console.log("failed to rest monitor");
        });
      return promise;
    };

    this.refreshMonitor = function(userId, monitorId) {
      var promise = $http({method: 'POST', url: '/api/user/refreshMonitor',
          data: {
            'userId': userId,
            'monitorId': monitorId
          }
        })
        .success(function(data) {
          console.log(data);
        }).
        error(function() {
          console.log("failed to rest monitor");
        });
      return promise;
    };

    this.updateMonitorSetting = function(userId, selectedMoniterIds){
      var promise = $http({method: 'POST', url: '/api/user/monitors',
          data: {
            'selectedIds': selectedMoniterIds,
            'userId': userId
          }
        })
        .success(function(data) {
          console.log(data);
        }).
        error(function() {
          console.log("failed to change monitor settings");
        });
      return promise;
    }

  });
