define(['app/states/visualization/visualizationState','app/states/tenant/TenantState'], function (TagState) {
  'use strict';
	var state = [];
	for(var i=0;i<arguments.length;i++) {
		state = state.concat(arguments[i]);
	}
	return state;
});

