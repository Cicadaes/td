define([], function() {
	'use strict';
	return [{ //报表列表
		state : 'custom-list',
		url : '/custom-list',
		templateUrl : 'html/visualization/customList.html',
		controllerUrl : 'app/controllers/visualization/customListController'
	},{ //共享池
		state : 'sharePool',
		url : '/sharePool',
		templateUrl : 'html/visualization/sharePool.html',
		controllerUrl : 'app/controllers/visualization/sharePoolController'
	},  { //仪表盘
		state : 'dashboard',
		url : '/dashboard',
		templateUrl : 'html/visualization/dashboard.html',
		controllerUrl : 'app/controllers/visualization/dashboardController'
	}, { 
		state : 'custom',
		url : '/custom/:id&:type',
		templateUrl : 'html/visualization/custom.html',
		controllerUrl : 'app/controllers/visualization/customController'
	}, { 
		state : 'demo',
		url : '/demo',
		templateUrl : 'html/visualization/demo.html',
		controllerUrl : 'app/controllers/visualization/demoController'
	}];
	
});
