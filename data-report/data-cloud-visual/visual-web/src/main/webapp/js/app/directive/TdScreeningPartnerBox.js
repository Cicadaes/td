define(['angularAMD','app/filters/DateStrSubstring'], function (angularAMD) {
    'use strict';
    angularAMD.factory('FilterPartnerBoxService', [ '$http', function($http) {
    	var filterData = undefined;
    	var isPartnerOpen = false;
		return {
        	
        	getFilterData : function(data){
        		return  filterData;
        	},
        	setFilterData : function(data){
        		filterData = data;
        	},
        	getPartnerStatus : function(){
        		return isPartnerOpen;
        	},
        	setPartnerStatus : function(s){
        		isPartnerOpen = s;
        	}
		};
	}]);
    angularAMD.directive('tdScreeningPartnerBox',['$rootScope','ConditionService','FilterPartnerBoxService','SecuritiesService', '$http',
                                                  function($rootScope,ConditionService,FilterPartnerBoxService,SecuritiesService,$http) {
    	return {
    		restrict : 'EA',
    		scope:{
    			partnerList:"=",
    			index : "@"                  // 当一张页面上有多个渠道组件时候的区分标志
    		},
    		templateUrl : "html/directive/td-screening-partner-box.html",
    		link: function(scope, elem, attrs) {
    			
    			scope.$watch('partnerList', function(){
    				if(scope.partnerList){
    					scope.getPartners();
    				}
    			});
    			
    			scope.partnerQuick = [];
    			
    			
    			var filterdata = FilterPartnerBoxService.getFilterData();
    			
    	      	
    	     	//获取渠道信息
    			scope.getPartners = function(params){
    				var partnerIds = [];
    				$http.post('channel/getList',{}).success(function(data){
    					angular.forEach(data,function(it){
    						angular.forEach(scope.partnerList, function(partnername){
    	    					if(it.key == partnername){
    	    						it.selected = true;
    	    						partnerIds.push(it.key+"")
    	    					}
    	    				})
        				});
    					scope.partners=data;
    					
    				})
    				
    				var d = {
						partnerIds :partnerIds ,
						index : scope.index     
					
					}
					FilterPartnerBoxService.setFilterData(d);
    					
    			}
    			
    			scope.getPartners();
    			
    			scope.initPatners = function(){
    				
    				angular.forEach(scope.partnerList, function(data,index,array){
        				angular.forEach(scope.partners, function(it){
        					if(it.key == data){
        						it.selected = true;
        						
        					}
        				})
            		});

    				
    			}
    			
    			scope.initPatners();
   			
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
    				}/*else if(num == 0 || (num == 1 && !flag)){
    					scope.validation2=true;
    					return;
    				}*/else{
    				//	scope.validation2=false;
    					scope.validation=false;
    				}
    				angular.forEach(data, function(it){
    					if(it[k] == v){
    						it.selected = !it.selected;
    					}
    				})
    				scope.clearQuickData();
    			}
    			scope.quickSearch = function(val,m){
    			
    				if(m == 'partner'){
    					angular.copy(scope.partners,scope.partnerQuick);
        				scope.partnerSearching=true;
        				var its = [];
        				angular.forEach(scope.partnerQuick, function(it){
        					if(it.value.indexOf(val) == 0){
        						its.push(it);
        					}
        				})
        				scope.partnerQuick = its;
    				}
    				
    				
    			}
    			scope.clearQuickData = function(){
    				scope.partnerSearching=false;
    				scope.quickVersionSearchVal="";
    				
    			}
    			
    			scope.clearAll = function(m){
    				if(m == "partner"){
    					angular.forEach(scope.partners, function(it){
        					it.selected = false;
        				})
    				}
    			}
    			//切换开关按钮状态
    			scope.onOff = function(m){
    				scope.clearAll(m);
    				
    					scope.isVersionOpen = !scope.isVersionOpen
        				//FilterBoxService.setVersionStatus(scope.isVersionOpen);
    				
    			}
    			scope.selectAll = function(m){
    				if(m == "partner"){
    					angular.forEach(scope.partners, function(it){
	    					it.selected = true;
	    				})
    				}
    			}
    			scope.sortByType = function(){
    				//TODO  发起后端请求进行排序
    			}
    			scope.saveFilterBox = function(callback){
    				
    				var partnerIds = [];
    				
    				
    				angular.forEach(scope.partners,function(it){
    					if(it.selected){
    						partnerIds.push(it.key+"")
    					}
    				});
    				if(partnerIds.length>5){
    					scope.validation = true;
    					return ;
    				}/*else if(partnerIds.length == 0){
    					scope.validation2 =true;
    					return ;
    				}*/else{
    					scope.validation =false;
    				}
    				var d = {
    						partnerIds :partnerIds ,
    						index : scope.index     
    				
    				}
    				FilterPartnerBoxService.setFilterData(d);
    				callback();
    				$rootScope.$broadcast("td-screening-partner-box.onChange",d);
    			}
    			scope.cancel = function(){
    				//还原到上次确认操作的数据
    				var fdata = FilterPartnerBoxService.getFilterData();
    				if(fdata){
    					
    					angular.forEach(scope.partners, function(it){
							if(fdata.partnerIds && fdata.partnerIds.indexOf(it.key+"")!=-1){
								it.selected = true;
							}else{
								it.selected = false;
							}
    					})
    					
    					
    					
//    					angular.forEach(scope.partners, function(it){
//							angular.forEach(fdata.partnerIds, function(partnerId){
//								if(it.key == partnerId){
//									it.selected = true;
//								}else{
//									it.selected = false;
//								}
//							})
//    					})
    				
    				}else{
    					angular.forEach(scope.partners, function(it){
									it.selected = false;
    					})
    				}
    			}
		    }
    	}
    }]);
});
