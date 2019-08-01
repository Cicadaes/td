define([ 'app','angularAMD',
         'app/service/CommonService',
         'app/filters/common/CommonFilter',
         'echarts','china','world',
         'app/common/EchartsOptions',
         'plugin'],function(app, angularAMD) {
	'use strict';
	    return ['$scope', '$state', '$stateParams','$location', '$http','NgTableParams','CustomService','CustomShareService','PageService','$compile',
	            function ($scope, $state, $stateParams, $location, $http,ngTableParams,CustomService,CustomShareService,PageService,$compile) {
	    	
	    	var path = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port,
				$canvas = $('#canvas'),
				$explore_graph_left_parent = $('.explore_graph_left_parent'),
				toolbarH = parseInt($('.toolbarH').css('height')),
				tdcontentheader = parseInt($('.td-content-header').css('height')),
				winHeight,winWidth;
	    	
	    	$scope.reports = [];
	    	$scope.reportDataMap = {};
	    	$scope.radio = { pageRadio : 1};
	    	
	    	$scope.initBaseStyle = function (){
	    		winHeight = document.body.clientHeight - toolbarH - tdcontentheader -40;
	    		winWidth = document.body.clientWidth - 40;
    			$explore_graph_left_parent.css({'height':winHeight,'width':winWidth});
	    	}
	    	
			$scope.getReportData = function(report,callback){
				var key = report.source.params;
				if ($scope.reportDataMap[key] != null) {
					callback(report,$scope.reportDataMap[key]);
				} else {
					PageService.getData(report).then(function(data) {
						var datas = data.result;
						$scope.reportDataMap[key] = datas;
						callback(report,datas);
					});
				}
			}
	    	
			//插件 相关方法
			$scope.pluginReportCallback = function(report){
				$scope.updateReport(report);
			}
			
			$scope.pluginPageCallback = function(params){
				PluginService.changeDataConfig(params).then(function(data) {
					$scope.page = data.data;
					$scope.initReports();
				});
			}
	    	
	    	$scope.createReportHtml = function(report){
				var id = report.id,
					style = report.style,
					left = style.left  + '%',
					width = style.width  + '%',
					top = style.top  + '%',
					height = style.height  + '%',
					index = report.index;
					
				var reportHtml = $('<div id="' + id + '" sourceId="' + report.sourceId + '" reportPropertyId="' + report.reportPropertyId + '" styleId="' + report.styleId + '" class="clrfix cursor-defalut" ></div>')[0];
				var viewHtml = '<div plugin-' + report.reportProperty.type + ' data="reports.report' + id + '" showflag="editFlag" plugin-report-callback="pluginReportCallback" plugin-page-callback="pluginPageCallback" td-change="getReportData" class="clearfix hg-p-100"></div>';
				
				$(reportHtml).css("left",left); 
				$(reportHtml).css("top",top); 
				$(reportHtml).css("height",height); 
				$(reportHtml).css("width",width);
				$(reportHtml).css("position","absolute");
				$(reportHtml).css("z-index",index);
				$(reportHtml).append(viewHtml);
				reportHtml = $compile(reportHtml)($scope);
				return reportHtml;
			}
	    	
	    	$scope.createReportView = function(report){
				var reportHtml = $scope.createReportHtml(report);
				$canvas.append(reportHtml);
			}
			
			$scope.initReports = function(){
				$scope.reports = [];
				var reports = $scope.page.reports;
				for (var i = 0; i < reports.length; i++) {
					$scope.reports['report'+reports[i].id] = reports[i];
					$scope.createReportView(reports[i]);
				}
			}
	    	
			$scope.initBackgroundStyle = function(page){
				if (page.bgColor && page.bgColor != "none") {
					$canvas.css('background',page.bgColor);
				} else if (page.bgImg && page.bgImg != "none") {
					$canvas.css({
						'background': 'url("'+ path + page.bgImg +'") no-repeat',
						'background-size' : '100% 100%'
					});
				} else {
					$canvas.css('background','');
				}
			}
			
			$scope.getMaxWinWidth = function(id){
				var maxWidth = winWidth,report;
				for (var i = 0, len = $scope.page.reports.length; i < len; i++) {
					report = $scope.page.reports[i];
					if (maxWidth < report.style.winWidth && report.id != id) {
						maxWidth = report.style.winWidth
					}
				}
				return maxWidth;
			}
			
			$scope.getMaxWinHeight = function(id){
				var maxHeight = winHeight,
					report;
				for (var i = 0, len = $scope.page.reports.length; i < len; i++) {
					report = $scope.page.reports[i];
					if (maxHeight < report.style.winHeight && report.id != id) {
						maxHeight = report.style.winHeight
					}
				}
				return maxHeight;
			}
			
			$scope.initPageStyle = function() {
				var page = $scope.page,
					height =0,
					width = 0;
				if (page.customWH) {
					height = page.height,
					width = page.width;
				} else {
					height = $scope.getMaxWinHeight();
					page.height = height;
					width = $scope.getMaxWinWidth();
					page.width = width;
				}
				$canvas.css('height', height);
				$canvas.css('width', width);
				$scope.initBackgroundStyle(page);
			}
	    	
			$scope.initPage = function(){
				$scope.removePageHtml();
				var page = $scope.page;
				$scope.initPageStyle();
				if ($scope.page && $scope.page.reports.length > 0) {
					$scope.initReports();
				}
			}
	    	
			$scope.queryPageDetail = function (pageid) {
				PageService.getById(pageid).then(function(data) {
					$scope.page = data;
					$scope.initPage();
				});
			}
	    	
			$scope.initCustom = function(id){
				CustomService.getById(id).then(function(data) {
					$scope.custom = data;
					if (data.pages.length > 0) {
						$scope.custom.pages[0].selected = true;
						$scope.custom.currentPageIndex = 0;
						$scope.queryPageDetail($scope.custom.pages[0].id);
					}
				});
			}
	    	
	    	$scope.changeDashboard = function(data){
	    		$scope.initCustom(data.customId);
	    	}
	    	
	    	$scope.initData = function() {
	    		var params = {};
	    		CustomShareService.getDashboardList(params).then(function(data) {
					$scope.dashboards = data.list;
					$scope.dashboards[0].selected = true;
					$scope.currentDashboard = $scope.dashboards[0];
					$scope.changeDashboard($scope.currentDashboard);
				});
			}
	    	
	    	$scope.initBaseStyle();

	    	$scope.initData();
	    	
			$scope.changePageIndex = function (index) {
				var pages = $scope.custom.pages;
				for (var i = 0, len = pages.length; i < len; i++) {
					pages[i].selected = false;
					if (index === i) {
						pages[i].selected = true;
						$scope.custom.currentPageIndex = i;
						$scope.page = pages[index];
					}
				}
				$scope.queryPageDetail($scope.page.id);
			}
	    	
			$scope.changePages = function(num){
				var currentPageIndex = $scope.custom.currentPageIndex;
				num = currentPageIndex + num;
				$scope.changePageIndex(num);
			}
			
			$scope.removePageHtml = function(){
				$canvas.children().remove();
			}
	    	
	    }];
	}
);
