"use strict";
angular.module('myApp.login',['myApp.userService'])
  .controller('LoginController', function($rootScope,$scope,$location,userService) {
    $scope.login = function(){
      userService.doLogin($('#username').val(), $('#password').val())
      .then(function(result){
        if(result.status==200){
          $location.path('/');
        }
  		});
    }
  });
