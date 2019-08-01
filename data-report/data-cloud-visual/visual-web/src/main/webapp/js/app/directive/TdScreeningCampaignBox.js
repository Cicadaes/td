define(['angularAMD','app/filters/DateStrSubstring'], function (angularAMD) {
    'use strict';
    angularAMD.factory('FilterCampaignBoxService', [ '$http', function($http) {
    	var filterData = undefined;
    	var isCampaignOpen = false;
		return {
        	getFilterData : function(data){
        		return  filterData;
        	},
        	setFilterData : function(data){
        		filterData = data;
        	},
        	getCampaignStatus : function(){
        		return isCampaignOpen;
        	},
        	setCampaignStatus : function(s){
        		isCampaignOpen = s;
        	}
		};
	}]);
    angularAMD.directive('tdScreeningCampaignBox',
    		['$rootScope','ConditionService','FilterCampaignBoxService','CampaignService', '$http',
		 function($rootScope,ConditionService,FilterCampaignBoxService,CampaignService,$http) {
    	 return {
    		restrict : 'EA',
    		scope:{
    			campaignList:"=",
    		},
    		templateUrl : "html/directive/td-screening-campaign-box.html",
    		link: function(scope, elem, attrs) {
    			var campaignParams = {"id" : "1"};
    			scope.$watch('campaignList', function(){
    				if(scope.campaignList){
    					scope.getCampaigns();
    				}
    			});
    			scope.campaignQuick = [];
    	      	
    	     	//获取渠道信息
    			scope.getCampaigns = function(){
    				var campaignIds = [];
    				CampaignService.getByParams(campaignParams).then(function (data){
    					angular.forEach(data,function(it){
    						angular.forEach(scope.campaignList, function(campaignId){
    	    					if(it.key == campaignId){
    	    						it.selected = true;
    	    						campaignIds.push(it.key+"")
    	    					}
    	    				})
        				});
    					scope.campaigns=data;
    				});
    				var d = {
    						campaignIds :campaignIds  
    					}
    				FilterCampaignBoxService.setFilterData(d);
    			}
    			
    			scope.getCampaigns();
    			
    			scope.initCampaigns = function(){
    				angular.forEach(scope.campaignList, function(data,index,array){
        				angular.forEach(scope.campaigns, function(it){
        					if(it.key == data){
        						it.selected = true;
        					}
        				})
            		});
    			}
    			
    			scope.initCampaigns();
   			
    			scope.seletedItem = function(data,k,v){
    				var num=0;
    				var flag=true;
    				angular.forEach(data, function(it){
    					if(it.selected == true){
    						num++;
    						if(it[k] == v){
    							flag=false;
    						}
    					}
    				})
    				if(num>5 ||(num==5 && flag) ){
    					scope.validation=true;
    					return;
    				}else{
    					scope.validation=false;
    				}
    				angular.forEach(data, function(it){
    					if(it[k] == v){
    						it.selected = !it.selected;
    					}
    				})
    				scope.clearQuickData();
    			}
    			
    			scope.quickSearch = function(val){
					angular.copy(scope.campaigns,scope.campaignQuick);
    				scope.campaignSearching=true;
    				var its = [];
    				angular.forEach(scope.campaignQuick, function(it){
    					if(it.value.indexOf(val) == 0){
    						its.push(it);
    					}
    				})
    				scope.campaignQuick = its;
    			}
    			scope.clearQuickData = function(){
    				scope.campaignSearching=false;
    				scope.quickCampaignSearchVal="";
    			}
    			
    			scope.clearAll = function(){
					angular.forEach(scope.campaigns, function(it){
    					it.selected = false;
    				})
    			}
    			//切换开关按钮状态
    			scope.onOff = function(m){
    				scope.clearAll(m);
					scope.isCampaignOpen = !scope.isCampaignOpen
    			}
    			
    			scope.selectAll = function(m){
					angular.forEach(scope.campaigns, function(it){
    					it.selected = true;
    				})
    			}
    			scope.saveFilterBox = function(callback){
    				var campaignIds = [];
    				angular.forEach(scope.campaigns,function(it){
    					if(it.selected){
    						campaignIds.push(it.key)
    					}
    				});
    				if(campaignIds.length>5){
    					scope.validation =true;
    					return ;
    				}else{
    					scope.validation =false;
    				}
    				var d = {
    					campaignIds : campaignIds
    				}
    				FilterCampaignBoxService.setFilterData(d);
    				callback();
    				$rootScope.$broadcast("td-screening-campaign-box.onChange",d);
    			}
    			scope.cancel = function(){
    				//还原到上次确认操作的数据
    				var fdata = FilterCampaignBoxService.getFilterData();
    				if(fdata){
    					angular.forEach(scope.campaigns, function(it){
							if(fdata.campaignIds && fdata.campaignIds.indexOf(it.key) != -1){
								it.selected = true;
							}else{
								it.selected = false;
							}
    					})
    				}else{
    					angular.forEach(scope.campaigns, function(it){
							it.selected = false;
    					})
    				}
    			}
		    }
    	}
    }]);
});
