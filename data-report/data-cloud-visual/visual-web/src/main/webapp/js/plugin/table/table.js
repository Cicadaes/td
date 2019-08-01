define(['app','angularAMD','app/directive/EChart'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('pluginTable',['$compile','NgTableParams','$filter',
        function($compile,ngTableParams,$filter) {
    	return {
    		require: '?ngModel',
    		restrict : 'EA',
    		transclude : true,
            scope:{
            	tdChange: "&",
            	data : "=",
    		},
            replace: false,
//            template: '<div e-chart e-data="options" loading="loading" class="hg-p-100"></div>',
            link: function(scope,elem,ngModel) {
            	
            	scope.createTableHtml = function(id,num){
            		var title='';
            		var tableTemplate = '<div loading-container="tableParams'+ id +'.settings().$loading" class="table-select-none clearfix">' +
            							'<div class="ng-table-container"><div class="ng-table-body ng-table-body-empty clearfix">' +
            							'<table ng-table="tableParams'+ id +'" class="table ng-table-responsive table-hover" freeze="true" id="tableParams' + id + '" >' +
            							'<tr align="center" ng-repeat="user in $data">';
            		for (var i = 1; i <= num; i++) {
            			title = 'tableParams' + id + '_titleArr[' + i + ']';
        				var html = '<td data-title="'+ title + '"  align="center">{{user[' + i + ']}}</td>';
        				tableTemplate += html;
        			}
            		tableTemplate = tableTemplate + '</tr></table></div></div></div>';
            		return tableTemplate;
            	}
            	
            	if (scope.data) {
            		var reportHtml = scope.createTableHtml(scope.data.id,2);
            		reportHtml = $compile(reportHtml)(scope);
            		$(elem).append(reportHtml);
				}
            	
            	scope.createReportLineChartData = function(report, datas){

        			var _table = report.reportProperty.propertyMap;
        			var id = report.id;
        			var xArray = datas.x.value;
        			var yList = datas.y,name,yValue,row,legendData=[],dataList=[];
        			var titles=[];
        			titles.push(datas.x.name);
        			titles.push(datas.x.name);
        			angular.forEach(xArray, function(x,index,array){
        				row = [];
        				row.push(x);
        				row.push(x);
        				angular.forEach(yList, function(y){
        					titles.push(y.name);
        					yValue = y.value;
        					row.push(yValue[index]);
        				});
        				dataList.push(row);
            		});
        			scope['tableParams' + id + '_titleArr']=titles;
        			var table = {datas:dataList};
        			scope['tableParams' + id] = TableOptions.defaultTableDesc(table,ngTableParams,$filter);
        	    	 window.setTimeout(function(){
        			  	scope.calNgTableBody(id,_table); 
        		  	 },50);
            	}
            	
            	scope.calNgTableBody = function(id,table){
        			if($('#tableParams' + id).attr("freeze") == "true"){
        				var $table = $('#tableParams' + id);
        				var $tbody = $table.find("tbody");
        				var $ngTableBody =  $table.parent();
        				var ngTableBodyHg = $('#'+id).height() - 48;
        				var tbodyHg = $tbody.height();
        				if(tbodyHg == 0){
        					$ngTableBody.addClass("ng-table-body-empty");
        				}else{
        					$ngTableBody.removeClass("ng-table-body-empty");
        				}
        				$ngTableBody.css({"max-height":ngTableBodyHg+"px"});
        				$table.FrozenTable(1,0,0);
        				var ths =$table.find("th"),tds=$table.find("td"),span,td;
        				for (var i = 0, len = ths.length; i < len; i++) {
        					span = $(ths[i]).find("span");
        					if (table.titleFontColor && table.titleFontColor != '') {
        						span.css("color",table.titleFontColor);
        					}
        					
        					if (table.titleFontSize && table.titleFontSize != '') {
        						span.css("font-size",table.titleFontSize);
        					}
        				}
        				for (var i = 0, len = tds.length; i < len; i++) {
        					td = $(tds[i]);
        					if (table.valueFontColor && table.valueFontColor != '') {
        						td.css("color",table.valueFontColor);
        					}
        					if (table.valueFontSize && table.valueFontSize != '') {
        						td.css("font-size",table.valueFontSize);
        					}
        				}
        				
        			}
        		}
            	
            	scope.callback = function(){
            		if(angular.isFunction(scope.tdChange)){
            			scope.optionloading = true;
	            		scope.tdChange()(scope.data,scope.createReportLineChartData);
	            	}
            	}
            	
    			scope.$watch('data', function(event, report) {
    				if (scope.data) {
    					scope.callback();
					}
                });
            }
    	}
    }]);
});
