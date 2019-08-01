define(['app','angularAMD','app/service/PageService','app/directive/TdSelect','app/directive/TdDateConditionSimple'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('tdDataCondition',['$compile','$http','PageService',function($compile,$http,PageService) {
    	return {
    		restrict : 'EA',
    		scope:{
    			report : "=",
    			syndata : "&"
    		},
    		templateUrl : "html/directive/td-data-condition.html",
    		link: function(scope, elem, attrs) {
    			var dataHtml = $('.explore_graph_data');
    			scope.dataSources = [];
    			scope.createParams = function(){
    				var _params = angular.copy(scope.params);
    				var params = {id : scope.dataSource.id};
    				for(var key in _params){
    					if (typeof _params[key] === 'object') {
    						params[key] = scope.searchKey[key] ? _params[key] :_params[key].key ;
						} else {
							params[key] = _params[key];
						}
    				}
    				return params;
    			}
    			
    			scope.changeParam = function(key){
    				if (key) {
    					var _params = angular.copy(scope.params);
    					var params = JSON.parse(scope.report.source.params);
    					var v;
    					if (typeof _params[key] === 'object') {
    						v = scope.searchKey[key] ? _params[key] : _params[key].key ;
						} else {
							v = _params[key];
						}
    					params[key] = v;
    					scope.createConfigureHtml(params);
					}
    				var params = scope.createParams();
	            	if(angular.isFunction(scope.syndata)){
	            		scope.syndata()(params);
	            	}
    			}
    			
    			scope.createHtml = function(html, data, _source, params){
    				if (!data) {
						return html
					}
    				html = html + '<li><label>'+data.display+'： </label>';
    				var key = data.key,
    					cascade = data.cascade,
    					value = data.value,
    					type = data.type,
    					split,cascadeData;
    				if ('select' === type) {
    					scope[key + 'Values'] = value;
    					if (params[key] != null) {
    						for (var i = 0, len = value.length,v = params[key]; i < len; i++) {
								if (v == value[i].key) {
									scope.params[key] = value[i];
								}
							}
						}
    					if (scope.params[key] == null) {
							scope.params[key] = value[0];
						}
    					
    					html  = html + '<select class="bs1 ml-5 mt--4" ng-model="params.' + key + '" ng-options="v.value for v in ' + key + 'Values' + '" ng-change="changeParam(\''+key+'\');"></select>';
    					html = html + '</li>';
    					if (cascade !=null) {
    						split = cascade.split(",");
    						for (var i = 0,len = split.length; i < len; i++) {
    							cascadeData = _source[split[i]][scope.params[key].key];
    							html = scope.createHtml(html,cascadeData,_source,params);
    						}
    					}
    				} else if ('selectSearch' === type) {
    					if (params[key] != null) {
    						scope.params[key] = params[key];
    					} else {
    						if (value) {
    							scope.params[key] = value[0];
    						}
						}
    					scope.searchKey[key] = true;
    					scope['selectSearchParams_' + key] = scope.createParams();
    					scope['selectSearchParams_' + key].call = data.call;
    					html  = html + '<div class="fl" td-select params="selectSearchParams_'+key+'" condition="\''+key+'\'"  ng-model="params.' + key + '" td-change="changeSelectSearch"></div>';
    					html = html + '</li>';
    					if (cascade !=null) {
    						split = cascade.split(",");
    						for (var i = 0,len = split.length; i < len; i++) {
    							cascadeData = _source[split[i]][scope.params[key].key];
    							html = scope.createHtml(html,cascadeData,_source,params);
    						}
    					}
    				} else if ('date'  === type) {
    					if (params[key] != null) {
    						scope.params[key] = params[key];
    					} else {
    						scope.params[key] = value[0].key;
    					}
    					html  = html + '<div td-date-condition-simple date-range="params.' + key + '" syndata="changeDate" condition="\''+key+'\'"></div>';
    					html = html + '</li>';
    				} else if ('input'  === type){
    					scope.params[key] = value[0].key;
    					html  = html + '<input  class="bs1 ml-5 fl wd120" ng-model="params.' + key + '"/>';
    					html = html + '</li>';
    				}
    				return html;
    			}
    			
    			scope.createConfigureHtml = function(params){
    				dataHtml.children("#dataSource~ dl").remove();
    				scope.params={};
    				scope.searchKey = {};
    				var html = '',data = '',datas = scope.configures;
        			for (var i = 0, len = datas.length; i < len; i++) {
        				data = datas[i];
        				html = html + '<dl><dd class="clearfix" style="overflow: visible;"><ul class="allw">'
        				html = scope.createHtml(html,data,data,params);
        				html = html+ '</ul></dd></dl>';
    				}
        			html = $compile(html)(scope);
        			dataHtml.append(html);
        			if (!scope.report) {
        				scope.changeParam();
					}
    			}
    			
    			scope.initConfigureHtml = function(){
    				var params = {};
    				if (scope.report) {
    					params = JSON.parse(scope.report.source.params);
					}
    				scope.createConfigureHtml(params);
    			}
    			
    			scope.initDataSourceConfig = function(){
    				if (!scope.configures) {
    					var dataSource = angular.copy(scope.dataSource);
    					PageService.getDataSourceConfigure(dataSource).then(function(data) {
    						if (data.success) {
    							scope.configures = data.data;
    							scope.initConfigureHtml();
    						}
    					});
					} else {
						scope.initConfigureHtml();
					}
    			}
    			
    			scope.selectDataSource = function(){
    				if (scope.dataSources.length > 0) {
						if (scope.report) {
							var dataSourceId = scope.report.source.dataSourceId
							angular.forEach(scope.dataSources,function(it){
								if (it.id == dataSourceId) {
									scope.dataSource = it;
								}
							});
						} else {
							scope.dataSource = scope.dataSources[0];
						}
						scope.initDataSourceConfig();
					}
    			}
    			
    			scope.getDataSource = function () {
    				var params = {};
    				PageService.getDataSource(params).then(function(data) {
    					scope.dataSources = data;
    					scope.selectDataSource();
    				});
    			}
    			
    			scope.initData = function(){
    				scope.getDataSource();
    			}
    			
    			scope.initData();
    			
    			scope.$watch('report', function(event, report) {
//    				if (scope.report) {
    					scope.selectDataSource();
//					}
                });
    			// select 回掉
    			scope.changeSelectSearch = function(key,obj){
    				scope.params[key] = obj;
    				scope.changeParam();
    			}
    			// 时间组件回掉
    			scope.changeDate = function(key,obj){
    				scope.params[key] = obj;
    				scope.changeParam();
    			}
		    }
    	}
    }]);
});
