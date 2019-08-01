define(['app','ngload!restangular'], function (app,Restangular) {
  'use strict';
  app.factory('PluginService', function (Restangular) {
	return {
		changeProperty : function(params) {
			return Restangular.all('/plugin/changeProperty').post(params, {}, {'Content-Type' : 'application/json'});
		},
		changeDataConfig : function(params) {
			return Restangular.all('/plugin/changeDataConfig').post(params, {}, {'Content-Type' : 'application/json'});
		},
    };
  });
});