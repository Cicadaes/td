define(['app','ngload!restangular'], function (app,Restangular) {
  'use strict';
  app.factory('CustomShareService', function (Restangular) {
	return {
		getDashboardList : function(params) {
			return Restangular.all('/dashboard').post(params, {}, {'Content-Type' : 'application/json'});
		},
		getSharePoolList : function(params) {
			return Restangular.all('/sharePool').post(params, {}, {'Content-Type' : 'application/json'});
		},
		getTenantUsers : function(params) {
			return Restangular.all('/getTenantUsers').post(params, {}, {'Content-Type' : 'application/json'});
		},
		editCustomShare : function(params) {
			return Restangular.all('/editCustomShare').post(params, {}, {'Content-Type' : 'application/json'});
		},
		deleteById : function(id) {
			return Restangular.one("/customShare", id).remove();
		},
		getById : function(id) {
			return Restangular.one("/customShare", id).get();
		},
    };
  });
});

