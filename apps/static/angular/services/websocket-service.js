"use strict";
angular.module('myApp.websocket', [])
  .service('websocket', function($location) {

    this.socket = io.connect('http://' + document.domain + ':' + location.port + "/ws");
		

  });
