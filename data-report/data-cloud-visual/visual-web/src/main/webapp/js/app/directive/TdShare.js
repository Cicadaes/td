define(['app','angularAMD','app/service/CustomService','app/service/CustomShareService'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('tdShare',['$timeout','$state','CustomShareService', function($timeout,$state,CustomShareService) {
    	return {
    		restrict : 'EA',
    		scope:{
    			custom : "="
    		},
    		templateUrl : "js/app/directive/template/tdShare/td-share.html",
    		link: function(scope, elem, attrs) {
    			scope.checkedbox = {
					shareLink : false,
					sharePool : false,
					dashboard : false
				};
    			scope.content = false;
    			scope.customShare = {customId : scope.custom.id};
    			scope.shareLink = {};
    			scope.sharePools = [];
    			scope.dashboard = {};
    			
    			scope.getTenantUsers = function() {
    				CustomShareService.getTenantUsers({}).then(function(data) {
    					scope.users = data;
    					scope.reset();
    				});
    			}
    			
    			scope.selectAll = function(selectedAll){
    				var data= scope.users;
    				angular.forEach(data, function(it){
						it.selected = selectedAll;
    				})
    			}
    			
    			scope.reset = function(){
    				var users= scope.users,
    					sharePools = scope.sharePools;
    				angular.forEach(users, function(it){
						it.selected = false;
						angular.forEach(sharePools, function(sharePool){
							if (it.umid === sharePool.umid) {
								it.selected = true;
							}
	    				})
    				})
    				console.dir([users]);
    			}
    			
    			scope.initCustomShare= function(){
    				scope.getTenantUsers();
    				if (scope.custom && scope.custom.status == 1) {
    					CustomShareService.getById(scope.custom.id).then(function(data) {
    						scope.customShare = data;
    		    			scope.sharePools = data.sharePools;
    		    			if (data.shareLink) {
    		    				scope.shareLink = data.shareLink;
    		    				scope.checkedbox.shareLink = true;
							}
    		    			if (data.dashboard) {
    		    				scope.dashboard = data.dashboard;
    		    				scope.checkedbox.dashboard = true;
							}
    		    			if (scope.sharePools && scope.sharePools.length > 0) {
    		    				scope.checkedbox.sharePool = true;
    		    			}
    		    			scope.reset();
    					});
    				}
    			}
    			
    			scope.checkedChange = function(type) {
    				if ('shareLink' === type && !scope.shareLink.url) {
    					scope.shareLink.url = 'www.baidu.com';//TODO
					}
    				scope.checkedbox[type] = !scope.checkedbox[type]
    			}
    			
    			scope.shareCustom = function(callback) {
    				var customShare = angular.copy(scope.customShare),
    					shareLink = angular.copy(scope.shareLink),
    					sharePools = angular.copy(scope.sharePools),
    					dashboard = angular.copy(scope.dashboard);
    				
    				if (scope.checkedbox.shareLink) {
    					shareLink.selected = true;
    					customShare.shareLink = shareLink;
					} else if (customShare.shareLink){
						customShare.shareLink.selected = false;
					}
    				
    				if (scope.checkedbox.dashboard) {
    					dashboard.selected = true;
    					customShare.dashboard = dashboard;
    				} else if (customShare.dashboard){
    					customShare.dashboard.selected = false;
    				}
    				
    				var arr = [], sharePool, users= scope.users,newSharePools = [],isnewSharePools;
    				angular.forEach(users, function(it){
    					if (it.selected) {
    						sharePool = { umid : it.umid};
    						arr.push(sharePool);
						}
    				})
    				
    				angular.forEach(sharePools, function(it){
    					it.selected = false;
    				})
    				if (scope.checkedbox.sharePool) {
    					angular.forEach(arr, function(it){
    						isnewSharePools = true;
    						angular.forEach(sharePools, function(sharePool){
								if (it.umid === sharePool.umid) {
									sharePool.selected = true;
									isnewSharePools = false;
								}
							})
							if (isnewSharePools) {
								newSharePools.push(it);
							}
    					})
					}
    				if (newSharePools.length > 0) {
    					sharePools = sharePools.concat(newSharePools);
					}
    				customShare.sharePools = sharePools;
    				console.dir([sharePools]);
    				scope.editCustomShare(customShare,callback);
    			}
    			
    			scope.editCustomShare = function(customShare,callback) {
    				CustomShareService.editCustomShare(customShare).then(function(data) {
    					console.dir([data]);
    					scope.hideAll(callback);
    				});
    			}
    			
    			scope.cancelCustomShare = function(callback) {
    				$.Pop.confirms('确认取消分享吗?',function(){
    					var id = scope.dashboard.id;
    					CustomShareService.deleteById(id).then(function(data) {
	    					callback.call();
	    				});
    				})
    			}
    			
    			scope.hideAll = function(callback) {
    				callback.call();
    				if (scope.parentHideCallback) {
						scope.parentHideCallback.call();
					}
    			}
    			
    			scope.parentCancel = function(callback) {
    				scope.parentHideCallback = callback;
    			}
    		}
    	}
    }]);
});
