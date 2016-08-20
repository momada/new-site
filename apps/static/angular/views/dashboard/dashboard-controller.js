"use strict";
angular.module('myApp.dashboard',['ui.bootstrap','components','myApp.userService','myApp.websocket','myApp.eventMonitorService'])
  .controller('DashboardController',
    function($rootScope, $scope, $location,$cookieStore,$http,userService,websocket,eventMonitorService) {
      $scope.hasNewEvent = false;
      $scope.newEventNotificationMonitorName="";
      $scope.currentUser = $rootScope.globals.currentUser;
      $scope.avatorImg = "img/"+$rootScope.globals.currentUser.avator;
      console.log($scope.avatorImg);
      var mobileView = 992;

			$scope.getWidth = function() {
          return window.innerWidth;
      };

      $scope.toggled = function(open) {
        if(!open){
          $scope.hasNewEvent = false;
        }
      };

      $scope.$watch($scope.getWidth, function(newValue, oldValue) {
          if (newValue >= mobileView) {
              if (angular.isDefined($cookieStore.get('toggle'))) {
                  $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
              } else {
                  $scope.toggle = true;
              }
          } else {
              $scope.toggle = false;
          }

      });

      $scope.toggleSidebar = function() {
          $scope.toggle = !$scope.toggle;
          $cookieStore.put('toggle', $scope.toggle);
      };

      window.onresize = function() {
          $scope.$apply();
      };
      $scope.logout = function(){
        console.log("logout")
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
      }

      $scope.OnResetClick = function(mId){
        for(var i=0; i<$scope.currentUser.monitors.length;i++){
          if($scope.currentUser.monitors[i].monitorId==mId){
            $scope.currentUser.monitors[i].count = 0;
            userService.resetMonitor($scope.currentUser._id,$scope.currentUser.monitors[i].monitorId)
          }
        }
      }

      $scope.monitors = [];
      $scope.OnSettingClick = function(){
          eventMonitorService.getEventMoniters().then(function(result){
            $scope.monitors = new Array();
            for(var i=0; i<result.data.length; i++){
              var m = {
                "monitorId": result.data[i]._id,
                "selected": false,
                "name": result.data[i].name
              }
              $scope.monitors.push(m);

            }
            for(var i=0; i<$scope.currentUser.monitors.length; i++){
              for(var j=0; j<$scope.monitors.length;j++){
                if($scope.monitors[j].monitorId == $scope.currentUser.monitors[i].monitorId){
                  $scope.monitors[j].selected = true;
                  break;
                }
              }
            }


          });

        	$('#settingModal').modal({});
      }

      $scope.OnRefreshClick = function(mId){
        for(var i=0; i<$scope.currentUser.monitors.length;i++){
          if($scope.currentUser.monitors[i].monitorId==mId){
            userService.refreshMonitor($scope.currentUser._id,$scope.currentUser.monitors[i].monitorId)
            .then(function(result){
              for(var i=0;i<$scope.currentUser.monitors.length;i++){
                if($scope.currentUser.monitors[i].monitorId==result.data.monitorId){
          			     $scope.currentUser.monitors[i].count = result.data.newCount;
                }
              }
        		});
          }
        }
      }

      $scope.OnSaveSettingClick = function(){

        var selectedMoniterIds = [];
        for(var j=0; j<$scope.monitors.length;j++){
          if($scope.monitors[j].selected){
            selectedMoniterIds.push($scope.monitors[j].monitorId);
          }
        }
        userService.updateMonitorSetting($scope.currentUser._id,selectedMoniterIds).then(
          function(result){
            $scope.currentUser.monitors = result.data.monitors;
            $rootScope.globals.currentUser = $scope.currentUser;
            $('#settingModal').modal('hide');
          }
        )
      }

			websocket.socket.on('Moniter need refresh', function(data){
				if(data.accountId == $scope.currentUser.accountId){
        for(var i=0; i<$scope.currentUser.monitors.length;i++){
          if($scope.currentUser.monitors[i].monitorId==data.monitorId){
            userService.refreshMonitor($scope.currentUser._id,$scope.currentUser.monitors[i].monitorId)
            .then(function(result){
              for(var i=0;i<$scope.currentUser.monitors.length;i++){
                if($scope.currentUser.monitors[i].monitorId==result.data.monitorId){
          			     $scope.currentUser.monitors[i].count = result.data.newCount;
                     $scope.hasNewEvent = true;
                     $scope.newEventNotificationMonitorName =  $scope.currentUser.monitors[i].name;
                }
              }
        		});
          }
        }
				}

			});

    }

  );
