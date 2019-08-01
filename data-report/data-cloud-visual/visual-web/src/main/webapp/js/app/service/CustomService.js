define(['app','ngload!restangular'], function (app,Restangular) {
  'use strict';
  app.factory('CustomService', function (Restangular) {
	return {
		getByParams : function(params) {
			return Restangular.all('/custom').post(params, {}, {'Content-Type' : 'application/json'});
		},
		editCustom : function(params) {
			return Restangular.all('/editCustom').post(params, {}, {'Content-Type' : 'application/json'});
		},
		checkCustomName : function(params) {
			return Restangular.all('/checkCustomName').post(params, {}, {'Content-Type' : 'application/json'});
		},
		deleteById : function(id) {
			return Restangular.one("/custom", id).remove();
		},
		getById : function(id) {
			return Restangular.one("/custom", id).get();
		}
    };
  });
});

