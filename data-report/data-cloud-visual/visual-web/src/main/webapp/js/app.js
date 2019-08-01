define([ 'common','app/states/common/state'], function(angularAMD, state) {
	'use strict';
	
	if(window.parent && window.parent.onHashChange){
		window.addEventListener("hashchange", function(event){
			  window.parent.onHashChange(event);
		});
	}
	
	var app = angular.module('td.enterprise.dmp', [ 'ui.router','ngTable',
			'mgcrea.ngStrap', 'restangular', 'ui.tree', 'ngFileUpload', 'ui.colorpicker', "isteven-multi-select"]);
	app.config([
			'$stateProvider',
			'$urlRouterProvider',
			'RestangularProvider',
			function($stateProvider, $urlRouterProvider, RestangularProvider) {
				angular.forEach(state, function(item) {
					$stateProvider.state(item.state, angularAMD.route(item));
                });
				$urlRouterProvider.otherwise('/custom-list');

				RestangularProvider.setBaseUrl('/web');
				
				RestangularProvider.addResponseInterceptor(function(data,operation, what, url, response, deferred) {
					var extractedData = data;
					if(data.rows){
						extractedData = data.rows;
						extractedData.total = data.total;
					}
					return extractedData;
				});

			} ])
	.constant('treeConfig', {
		treeClass: 'angular-ui-tree',
		emptyTreeClass: 'angular-ui-tree-empty',
		hiddenClass: 'angular-ui-tree-hidden',
		nodesClass: 'angular-ui-tree-nodes',
		nodeClass: 'angular-ui-tree-node',
		handleClass: 'angular-ui-tree-handle',
		placeholderClass: 'angular-ui-tree-placeholder',
		dragClass: 'angular-ui-tree-drag',
		dragThreshold: 3,
		levelThreshold: 30
    });
	
	return angularAMD.bootstrap(app);
});

