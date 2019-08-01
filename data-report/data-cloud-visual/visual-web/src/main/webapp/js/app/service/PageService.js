define(['app','ngload!restangular'], function (app,Restangular) {
  'use strict';
  app.factory('PageService', function (Restangular) {
	return {
		getById : function(id) {
			return Restangular.one("/page", id).get();
		},
		getByParams : function(params) {
			return Restangular.all('/page').post(params, {}, {'Content-Type' : 'application/json'});
		},
		editPage : function(params) {
			return Restangular.all('/editPage').post(params, {}, {'Content-Type' : 'application/json'});
		},
		editReport : function(params) {
			return Restangular.all('/editReport').post(params, {}, {'Content-Type' : 'application/json'});
		},
		editReportGroup : function(params) {
			return Restangular.all('/editReportGroup').post(params, {}, {'Content-Type' : 'application/json'});
		},
		getDataSource : function(params) {
			return Restangular.all('/getDataSource').post(params, {}, {'Content-Type' : 'application/json'});
		},
		getDataSourceConfigure : function(params) {
			return Restangular.all('/getDataSourceConfigure').post(params, {}, {'Content-Type' : 'application/json'});
		},
		getData : function(params) {
			return Restangular.all('/data').post(params, {}, {'Content-Type' : 'application/json'});
		},
		getSearchSelectData : function(params) {
			return Restangular.all('/searchSelectData').post(params, {}, {'Content-Type' : 'application/json'});
		},
		deleteById : function(id) {
			return Restangular.one("/page", id).remove();
		},
		deleteReportGroupById : function(id) {
			return Restangular.one("/reportGroup", id).remove();
		},
		deleteReport : function(id) {
			return Restangular.one("/deleteReport", id).remove();
		},
    };
  });
});

