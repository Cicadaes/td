define([], function () {
  'use strict';
  return [{
	    state : 'admins_ep',
		url : '/tenant/ep',
		templateUrl : 'html/tenant/tenant.html',
		controllerUrl : 'app/controllers/tenant/TenantController',
		ncyBreadcrumb: {
		    label: '权限管理',
		    parent: 'admin'
		}
	}];
});

