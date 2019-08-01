define([ 'app','angularAMD','echarts','china','world',
         'app/service/CustomService','app/service/PageService','app/service/PluginService',
         'app/common/EchartsOptions',
         'app/filters/common/CommonFilter',
         'app/directive/FontColor','app/directive/EChart','app/directive/ColorGroup','plugin',
         'app/common/MacDock','app/directive/TdDataCondition'],function(app, angularAMD, echarts) {'use strict';
    return ['$scope', '$state', '$stateParams','$location', '$http','NgTableParams','$filter','CustomService','PageService','PluginService','$compile','Upload',
            function ($scope, $state, $stateParams, $location, $http,ngTableParams,$filter,CustomService,PageService,PluginService,$compile,Upload) {

    	var id=$stateParams.id,
    		type = $stateParams.type,
    		path = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port,
    		defaultZindex = 100,
			e_main = document.getElementById('main'),
			$main = $(e_main),
			e_ul = document.getElementById('ul'),
			$e_ul = $(e_ul),
			$conbox = $('.con-box'),
			$explore_graph_right = $('.explore_graph_right'),
			$explore_graph_left_tit = $('.explore_graph_left_tit'),
			$explore_graph_left = $('.explore_graph_left'),
			$explore_graph_left_parent = $('.explore_graph_left_parent'),
			$td_content_type = $('.td-content-type'),
			$toolbarH = $('.toolbarH'),
			$tdContentHeader = $('.td-content-header'),
			$line_up = $(".line_up"),
    		$line_down = $(".line_down"),
    		$line_left = $(".line_left"),
    		$line_right = $(".line_right"),
			winHeight,winWidth;
    	
    	console.dir(type);
    	$scope.type = type;
    	
    	$scope.radio = {
    			pageRadio : 2,
    			reportRadio : 1,
    			chartTypeRadio : 'line'
    	};
    	$scope.showDataConfige = false;
    	
		$scope.reports = [];

		$scope.reportDataMap = {};
		
		$scope.charts = PLUGINS;
		
		//地图风格
    	$scope.themes = CUSTOM.THEMES;
    	
    	$scope.fontFamilys = CUSTOM.FONTFAMILYVALUES();
    	
    	//Text
    	$scope.fontSizes = [];
    	for (var i = 12; i < 50; i++) {
    		$scope.fontSizes.push( i + 'px');
		}
    	
    	$scope.opacitys = [];
    	for (var i = 100; i >= 0; i = i - 10) {
    		$scope.opacitys.push( i + '%');
    	}
    	
    	$scope.initBaseStyle = function (){
    		var toolbarHHeight = parseInt($toolbarH.css('height'));
    		var tdContentHeaderHeight = parseInt($tdContentHeader.css('height'));
    		winHeight = document.body.clientHeight - toolbarHHeight - tdContentHeaderHeight -40;
    		winWidth = document.body.clientWidth - 40;
    		$explore_graph_right.css('height',winHeight + 40);
    		if($scope.editFlag){
    			$explore_graph_left_parent.css({'height':winHeight -60,'width': winWidth - 250});
    		} else{
    			$explore_graph_left_parent.css({'height':winHeight,'width':winWidth});
    		}
    	}
    	
    	// chart背景色
		$scope.changeColor = function(color,index){
			console.info('changeColor:' + index);
			if (color && $scope.reportProperty.property[index] != color) {
				$scope.reportProperty.property[index] = color; 
				$scope.initReportChartData();
			}
		}
		
		$scope.changeChartColorGroup = function(color){
			if (color && $scope.reportProperty.property.colorGroup != color) {
				$scope.reportProperty.property.colorGroup = color; 
				$scope.initReportChartData();
			}
		}
    	
    	$scope.changeDataSource = function(params){
			params.type = $scope.reportProperty.type;
    		var dataSourceId = params.id;
			delete params.id;
    		var source = {
				dataSourceId : dataSourceId,
				params : JSON.stringify(params)
    		};
    		if ($scope.reportHtml) {
				source.id = $scope.report.source.id; 
				$scope.report.source = source;
				$scope.initReportChartData();
			} else {
				$scope.report = {source : source};
			}
    	}
    	
		$scope.initCanvas = function(){
			var Rect = { 
				//当前正在画的矩形对象 
				obj: null, 
				//画布 
				container: null,
				//初始化函数 
				init: function(containerId){
					Rect.container = document.getElementById(containerId); 
					if(Rect.container){ 
						//鼠标按下时开始画 
						Rect.container.onmousedown = null;
						Rect.container.oncontextmenu = null;
						Rect.container.onmousedown = Rect.start; 
					} 
					else{ 
						alert('You should specify a valid container!'); 
					} 
				}, 
				start: function(e){
					if (e.target.tagName === 'A' || e.target.tagName === 'INPUT' || e.target.tagName === 'LI' || e.button ==2) {
						return false;
					}
					if ('none' === $scope.radio.chartTypeRadio) {
						return false;
					}
					$scope.initReportProperty($scope.radio.chartTypeRadio);
					e_ul.style.display = "none";
					$scope.removeBorderClass();
					$scope.deleteReportGroup(true);
		            e.preventDefault();
		            e.stopPropagation();
					var o = Rect.obj = $('<div class="clrfix"></div>')[0];
					o.style.position = "absolute"; 
					// mouseBeginX，mouseBeginY是辅助变量，记录下鼠标按下时的位置
					o.mouseBeginX = Rect.getEvent(e).x;
					o.mouseBeginY = Rect.getEvent(e).y;
					var ClientRect = main.getBoundingClientRect();
					$(o).css("left",o.mouseBeginX -ClientRect.left); 
					$(o).css("top",o.mouseBeginY -ClientRect.top);
					o.style.height = 0;
					o.style.width = 0;
					o.style.border = 'solid 1px #ccc';
					o.style.cursor = 'default';
					o.style.zIndex = $scope.getZIndex(defaultZindex,true);
					$scope.createDeleteA(o);
					$scope.createMoveSpan(o);
					o.maxWidth = e_main.scrollWidth - o.mouseBeginX + ClientRect.left;
					
					//把当前画出的对象加入到画布中 
					Rect.container.appendChild(o);
					//处理onmousemove事件 
					Rect.container.onmousemove = Rect.move; 
					//处理onmouseup事件 
					Rect.container.onmouseup = Rect.end;
				},
				move: function(e){ 
					var o = Rect.obj;
					//dx，dy是鼠标移动的距离 
					var dx = Rect.getEvent(e).x - o.mouseBeginX;
					var dy = Rect.getEvent(e).y - o.mouseBeginY; 
					//如果dx，dy <0,说明鼠标朝左上角移动，需要做特别的处理 
					var ClientRect = main.getBoundingClientRect();
					if(dx<0){ 
						o.style.left = Rect.getEvent(e).x - ClientRect.left; 
					} 
					if(dy<0){ 
						o.style.top = Rect.getEvent(e).y - ClientRect.top; 
					}
					if(dx > o.maxWidth){
						dx = o.maxWidth;
					}
					$(o).height(Math.abs(dy));
					$(o).width(Math.abs(dx));
				}, 
				end: function(e){
					Rect.container.onmousemove = null; 
					Rect.container.onmouseup = null;
					var o = Rect.obj;
					if($(o).height() >5 && $(o).width() >5){ // 如果筐太小 删除
						Rect.obj = null;
						$scope.editReport(o);
					}else {
						$(o).remove();
						$scope.changeHighData('none',true);
					}
				}, 
				//辅助方法，处理IE和FF不同的事件模型 
				getEvent : function(e) {
					if (typeof e == 'undefined') {
						e = window.event;
					}
					if (typeof e.x == 'undefined') {
						e.x = e.layerX; 
					}
					if (typeof e.y == 'undefined') {
						e.y = e.layerY;
					}
					return e;
				}
			};
			Rect.init("main");
			e_main.oncontextmenu = function(e){
				return false;
			};
		}
		
		$scope.stopDraw = function(){
			e_main.onmousedown = null;
			e_main.oncontextmenu = null;
		}
		
		$scope.startDraw = function(){
			$scope.initCanvas();
		}
		
		$scope.getZIndex = function(index,max){
			var reports = $scope.page.reports,
				indexArr = [];
			for (var i = 0, len = reports.length; i < len; i++) {
				var _index = parseInt(reports[i].index);
				indexArr.push(_index)
			}
			indexArr.sort(function(a,b){return a-b});
			if (indexArr.length > 0) {
				index = max ? indexArr.pop() + 1 : indexArr[0] -1;
			}
			return index;
		}
		
		$scope.changeIndex = function(content){
			if($scope.report && $scope.page.reports.length > 1){
				var reportHtml = $scope.reportHtml,
					$reportHtml = $(reportHtml),
					index = $reportHtml.css('z-index');
				index = parseInt(index);
				if ('next' == content) {
					index = index + 1;
				} else if ('pre' == content) {
					index = index - 1;
				} else if ('max' == content) {
					index = $scope.getZIndex(index,true);
				} else if ('min' == content){
					index = $scope.getZIndex(index);
				}
				$reportHtml.css('z-index', index);
				$scope.initReportChartData();
				e_ul.style.display = "none";
			}
		}
		
		$scope.startReportGroup = function(){
			$scope.radio.chartTypeRadio = 'reportGroup';
			$scope.showDataConfige = false;
			$scope.changeCharts('reportGroup',true);
		}
		
		$scope.changeHighData = function(type,flag){
			if ($scope.radio.chartTypeRadio != type) {
				$scope.initReportProperty(type);
				$scope.showDataConfige = false;
				$scope.removeBorderClass();
				$scope.report = null;
				$scope.reportHtml = null;
				$scope.changeCharts(type,flag);
			}
		}
		
		$scope.switchEdit = function(flag){
			if ($scope.editFlag) {
				$scope.changeCharts('line');
				$explore_graph_right.show();
				$explore_graph_left_tit.addClass('wd-ca250');
				$explore_graph_left_tit.removeClass('wd-p-100');
				$explore_graph_left_parent.css({'height':winHeight -60,'width': winWidth - 250});
			} else {
				$scope.deleteReportGroup();
				$explore_graph_right.hide();
				$explore_graph_left_tit.addClass('wd-p-100');
				$explore_graph_left_tit.removeClass('wd-ca250');
				$explore_graph_left_parent.css({'height':winHeight,'width':winWidth});
			}
			$scope.initReports();
			$scope.editFlag ? $scope.startDraw() : $scope.stopDraw();
		}
		
		$scope.initReportProperty = function(type){
			var property;
			for (var i = 0,len = PLUGINS.length; i < len; i++) {
				if (type === PLUGINS[i].type) {
					property = PLUGINS[i].property;
				}
			}
			$scope.reportProperty={
				type : type,
				property : property
			}
		}
		
		$scope.initReportProperty('line');
		
		$scope.changeCharts = function(type,flag){
			$scope.reportProperty.type = type;
			$scope.radio.chartTypeRadio = type;
			angular.forEach($scope.charts,function(it){
				it.selected = false;
				if (it.type === type) {
					it.selected = true;
				}
			});
			if(flag){
				try {
				$scope.$apply();
				} catch (e) {
					console.info(e.message);
				}
			}
		}
		
		$scope.initChart = function(report,flag){
			var reportProperty = report.reportProperty,
				property = reportProperty.propertyMap;
			$scope.reportProperty={
				type : reportProperty.type,
				property : property
			}
			$scope.changeCharts(reportProperty.type,flag);
		}
		
		$scope.changeReport = function(id,flag){
			var reports = $scope.page.reports;
			for (var i = 0; i < reports.length; i++) {
				if (reports[i].id == id) {
					$scope.report = reports[i];
					$scope.reporGroup = [reports[i]]//TODO
					$scope.initChart(reports[i],flag);
				}
			}
		}
		
		$scope.addBorderClass= function(o){
			$(o).addClass("border-blue");
		}
		
		$scope.removeBorderClass= function(){
			$('.border-blue').removeClass("border-blue");
		}
		
		$scope.showReportGroup = function(id) {
			$('.reportGroups').remove();
			var reportGroups = $scope.page.reportGroups,reportIds,currentReportIds,
				html = '<div class="reportGroups">组合</div>';
			for (var i = 0, len = reportGroups.length; i < len; i++) {
				reportIds = reportGroups[i].reportIds;
				for (var j = 0, l = reportIds.length; j < l; j++) {
					if (reportIds[j] == id) {
						currentReportIds = reportIds;
					} 
				}
			}
			
			if (currentReportIds) {
				for (var i = 0, len = currentReportIds.length; i < len; i++) {
					$('#'+ currentReportIds[i]).append(html);
				}
			}
		}
    	
    	$scope.changeReportSelected = function(reportHtml,flag){
    		$('.reporGroup').remove();//TODO
    		$scope.reporGroup = [];
    		$scope.showReportGroup(reportHtml.id);
    		$scope.reportHtml = reportHtml;
			$scope.changeReport(reportHtml.id,flag);
        	$scope.removeBorderClass();
        	$scope.addBorderClass(reportHtml);
    	}
    	
    	//reportGroup
    	$scope.editReportGroup = function(type) {
    		var reporGroup = $scope.reporGroup, ids = [], params;
    		for (var i = 0, len = reporGroup.length; i < len; i++) {
    			ids.push(reporGroup[i].id + "");//TODO
			}
    		params = {
    			type : type,
    			pageId : $scope.page.id,
    			reportIds : ids
    		}
    		PageService.editReportGroup(params).then(function(data) {
    			$scope.page.reportGroups = data;
    			$scope.showReportGroup(ids[0]);
			});
    	}
    	
    	$scope.reportGroupAlign = function(align) {
    		var $reporGroup = $('.reporGroup'),
    			reporGroup = $scope.reporGroup,
    			baseReport = reporGroup[0],
    			$baseReport = null,
    			baseLeft = 0,
	    		baseTop = 0,
	    		baseWidth = 0,
	    		baseHeight = 0,
	    		elem_baseLeft = 0,
	    		elem_baseTop = 0,
	    		elem_baseWidth = 0,
	    		elem_baseHeight = 0,
    			report = null,
    			$report = null,
    			left = 0,
    			top = 0,
    			width = 0,
    			height = 0;
    		
			for (var i = 1, len = reporGroup.length; i < len; i++) {
				report = reporGroup[i];
				if (align === 'left') {
    				if (baseReport.style.left > report.style.left) {
    					baseReport = report;
					}
				} else if (align === 'right') {
					if (baseReport.style.left + baseReport.style.width < report.style.left + report.style.width) {
						baseReport = report;
					}
				} else if (align === 'upper') {
					if (baseReport.style.top > report.style.top) {
						baseReport = report;
					}
				} else if (align === 'down') {
					if (baseReport.style.top + baseReport.style.height < report.style.top + report.style.height) {
						baseReport = report;
					}
				}
			}
			
			$baseReport = $('#' + baseReport.id),
			baseLeft = baseReport.style.left,
			baseTop = baseReport.style.top,
			baseWidth = baseReport.style.width,
			baseHeight = baseReport.style.height,
			elem_baseLeft = parseInt($baseReport.css('left')),
			elem_baseTop = parseInt($baseReport.css('top')),
			elem_baseWidth = parseInt($baseReport.css('width')),
			elem_baseHeight = parseInt($baseReport.css('height'));
    		
    		for (var i = 0, len = reporGroup.length; i < len; i++) {
    			report = reporGroup[i];
    			if (baseReport.id !== report.id) {
    				$report = $('#' + report.id),
    				left = parseInt($report.css('left')),
    				top = parseInt($report.css('top')),
    				width = parseInt($report.css('width')),
    				height = parseInt($report.css('height'));
    				if (align === 'left') {
    					report.style.left = baseReport.style.left;
    					left = elem_baseLeft;
    				} else if (align === 'upper') {
    					report.style.top = baseTop;
    					top = elem_baseTop;
    				} else if (align === 'right') {
    					report.style.left = baseLeft + baseWidth - report.style.width;
    					left = elem_baseLeft + elem_baseWidth - width;
    				} else if (align === 'down') {
    					report.style.top = baseTop + baseHeight - report.style.height;
    					top = elem_baseTop + elem_baseHeight - height;
    				}
    				$('#' + report.id).css({'left' : left, 'top' : top});
    				PageService.editReport(report).then(function(data) {
    					$scope.updateReport(data);
    				});
				}
    		}
    		$reporGroup.css($scope.getReportGroupStyle(reporGroup));
    	}
    	
    	$scope.deleteReportGroup = function (flag) {
    		$('.reporGroup').remove();//TODO
    		$scope.reporGroup = [];
    		if ($scope.radio.chartTypeRadio === 'reportGroup' || $scope.radio.chartTypeRadio === 'none') {
    			$scope.changeHighData('none',flag);
			}
    	};
    	
    	// reportGroup style
    	$scope.getReportGroupStyle = function(reporGroup) {
    		var left,top, width, height, style, maxWidth, maxHeight,
	    		pageHeight = $main.height(),
				pageWidth = $main.width();
			for (var i = 0, len = reporGroup.length; i < len; i++) {
				style = reporGroup[i].style;
				if (i === 0) {
					left = style.left;
					top = style.top;
					width = style.width + left;
					height = style.height + top;
				} else {
					left = left > style.left ? style.left : left;
					top = top > style.top ? style.top : top;
					maxWidth =  style.width + (style.left > left ? style.left : left)
					width = width < maxWidth ? maxWidth : width;
					maxHeight = style.height + (style.top > top ? style.top : top);
					height = height < maxHeight ? maxHeight : height;
				}
			}
			width = width - left;
			height = height - top;
			
			left = 	parseInt(left * pageWidth / 100) + 'px',
			top = 	parseInt(top * pageHeight / 100) + 'px',
			width = parseInt(width * pageWidth / 100) + 'px',
			height = parseInt(height * pageHeight / 100) + 'px';
			
			return {left : left, top : top, width : width, height : height};
    	}
    	
    	$scope.createReportGroup = function(reportHtml){
    		var flag = true, id = reportHtml.id, reporGroup = $scope.reporGroup;
    		for (var i = reporGroup.length-1; i >= 0; i--) {
				if (reporGroup[i].id === id) {
					flag = false;
				}
			}
    		if (flag) {
    			reporGroup.push($scope.reports['report'+ id]);
    			$scope.addBorderClass(reportHtml);
			}
    		$('.reporGroup').remove();
    		if(reporGroup.length == 1){
    			return false;//TODO
    		} else {
    			$scope.startReportGroup();
    			var style = $scope.getReportGroupStyle(reporGroup),
	    			left = style.left,
	    			top = style.top,
	    			width = style.width,
	    			height = style.height;
    			
    			var template = '<div class="reporGroup" style="position: absolute;z-index: 1000;background:rgba(204,204,204,0.3);"></div>';//TODO
    			var $template = angular.element(template);
    			
    			$template.css("left", left);
    			$template.css("top", top);
    			$template.css("width", width);
    			$template.css("height", height);
    			
    			$scope.createReportGroupMoveSpan($template[0]);
    			$main.append($template);
    			
    			$($template).mousedown(function(e){
    	        	$scope.reportGroupStartdrag(e,this);
    	        });
    		}
    	}
    	
    	$scope.reportGroupStartdrag = function(e, o) {
			e.preventDefault();
            e.stopPropagation();
            var target = e.target,
            	els = null,
	            left = 0,
            	top = 0,
            	width = 0,
            	height = 0,
                pageWidth = 0,
                pageHeight = 0,
                maxMoveX = 0,
                minMoveX = 0,
                maxMoveY = 0,
                minMoveY = 0,
                x = 0,
                y = 0,
                moveX = 0,
                moveY = 0,
                moveFlag = true,
                customWH = $scope.page.customWH,
                moveReporthtmls = [],
                reports = $scope.reporGroup;
            
			if (target.className.indexOf('lower_right_corner') < 0) {
				countDom(o);
			}else {
				return false;
			}
			
            // 获取条件元素 计算当前鼠标位置
            function countDom(target) {
                els = target.style,
                left = target.offsetLeft,
                top = target.offsetTop,
                width = target.offsetWidth,//TODO offset scroll
                height = target.offsetHeight,
                pageWidth = $main[0].scrollWidth,
                pageHeight = $main[0].scrollHeight,
                minMoveX = -left,
                minMoveY = -top;
                
                if (customWH) {
                	maxMoveX = pageWidth - width;
                	maxMoveY = pageHeight - height;
				}
                
                //按下元素后，计算当前鼠标位置
                x = e.clientX,
                y = e.clientY;
                
                for (var i = 0,len = reports.length; i < len; i++) {
                	moveReporthtmls.push($('#' + reports[i].id));
    			}
                
                //IE下捕捉焦点 
                target.setCapture && target.setCapture();
                //绑定事件 
                $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp);
            }
            //移动事件 
            function mouseMove(e) {
            	moveFlag = false,
            	moveX = e.clientX - x,
				moveY = e.clientY - y,
				x= e.clientX,
				y = e.clientY;
            	
            	if (moveX < minMoveX) {
            		moveX = minMoveX;
				}
            	if (moveY < minMoveY) {
            		moveY = minMoveY;
            	}
            	if(customWH){
                	if(moveX > maxMoveX){
                		moveX = maxMoveX;
                    }
                	if (moveY >= maxMoveY) {
                		moveY = maxMoveY -2;
    				}
                }
				
            	console.info("minMoveX = " + minMoveX + ", minMoveY = " + minMoveY + ", maxMoveX = " + maxMoveX + ", maxMoveY = " + maxMoveY);
            	minMoveX = minMoveX - moveX,
            	minMoveY = minMoveY - moveY,
            	maxMoveX = maxMoveX - moveX,
            	maxMoveY = maxMoveY - moveY;
            	
				left = left + moveX,
				top = top + moveY;
				
                els.top = top + 'px',
                els.left = left + 'px';
				
                for (var i = 0, len = moveReporthtmls.length; i < len; i++) {
                	var l = parseInt(moveReporthtmls[i].css('left'));
                	var t = parseInt(moveReporthtmls[i].css('top'));
                	
                	l = l + moveX,
    				t = t + moveY;
    				moveReporthtmls[i].css('left', l),
                	moveReporthtmls[i].css('top', t);
				}
            }
            //停止事件 
            function mouseUp(e) {
            	$(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
            	if (moveFlag) {
            		$scope.deleteReportGroup(true);
					return false;
				}
            	if (!$scope.page.customWH) {
	        		var $reporGroup = $('.reporGroup'),
	            		height = $reporGroup.css('height'),
	            		top = $reporGroup.css('top'),
	            		width = $reporGroup.css('width'),
	            		left = $reporGroup.css('left'),
	            		maxHeight = $scope.getMaxWinHeight(),
	            		maxWidth = $scope.getMaxWinWidth(),
	            		currentHeight = parseInt(height) + parseInt(top),
	            		currentWidth = parseInt(left) + parseInt(width);
	        		if (currentHeight > maxHeight) {
	        			maxHeight = currentHeight
	        		}
	        		if (currentWidth > maxWidth) {
	        			maxWidth = currentWidth
	        		}
	        		$scope.page.height = maxHeight;
	        		$scope.page.width = maxWidth;
	        		$main.height(maxHeight);
	        		$main.width(maxWidth);
            	}
            	for (var i = 0, len = reports.length; i < len; i++) {
            		var style = $scope.createStyleParams(moveReporthtmls[i]);
            		reports[i].style = style;
            		PageService.editReport(reports[i]).then(function(data) {
            			$scope.updateReport(data);
        			});
				}
            }
        }
    	
    	// 放大缩小边框事件
    	$scope.reportGroupStartChange = function(el) {
    		$(el).mousedown(function(e) {
    			if (e.target.tagName === 'A') {
    				return false;
    			}
    			e.preventDefault();
    			e.stopPropagation();
    			var target = e.target,
    				className = target.className,
    				ep = target.parentNode,
	            	els = ep.style,
		            left = ep.offsetLeft,
	            	top = ep.offsetTop,
	            	width = ep.offsetWidth,
	            	height = ep.offsetHeight,
	                pageWidth = $main[0].scrollWidth,
	                pageHeight = $main[0].scrollHeight,
	                minMoveX = 0,
	                minMoveY = 0,
	                maxMoveX = 0,
	                maxMoveY = 0,
	                x = e.clientX,
	                y = e.clientY,
	                moveX = 0,
	                moveY = 0,
	                local = '',
	                moveFlag = true,
	                customWH = $scope.page.customWH,
	                moveReporthtmls = [],
	                reports = $scope.reporGroup;
    			
    			for (var i = 0,len = reports.length; i < len; i++) {
                	moveReporthtmls.push($('#' + reports[i].id));
    			}
    			
    			if (className.indexOf('gs-resize-handle-left-top') > 0) {
    				minMoveX = -left,
    				minMoveY = -top;
    				maxMoveX = width;
    				maxMoveY = height;
    				local = 'lt';
    			} else if (className.indexOf('gs-resize-handle-right-top') > 0) {
    				minMoveX = -width,
    				minMoveY = -top;
    				maxMoveX = pageWidth - left - width;
    				maxMoveY = height;
    				local = 'rt';
    			} else if (className.indexOf('gs-resize-handle-left-button') > 0) {
    				minMoveX = -left,
    				minMoveY = -height;
    				maxMoveX = width;
    				maxMoveY = pageHeight - top - height;
    				local = 'lb';
    			} else if (className.indexOf('gs-resize-handle-right-button') > 0) {
    				minMoveX = -width,
    				minMoveY = -height;
    				maxMoveX = pageWidth - left - width;;
    				maxMoveY = pageHeight - top - height;
    				local = 'rb';
    			}
    			//按下元素后，计算当前鼠标与对象计算后的坐标 
    			x = e.clientX, y = e.clientY;
    			
                //IE下捕捉焦点 
                target.setCapture && target.setCapture();
                //绑定事件 
                $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp);
                
                //移动事件 
        		function mouseMove(e){
        			moveFlag = false,
        			moveX = e.clientX - x,
        			moveY = e.clientY - y,
    				x= e.clientX,
    				y = e.clientY;
        			
        			if (local === 'lt') {
        				
        				if (moveX < minMoveX) {
                    		moveX = minMoveX;
        				}
                    	if (moveY < minMoveY) {
                    		moveY = minMoveY;
                    	}
                    	if(moveX > maxMoveX){
                    		moveX = maxMoveX;
                        }
                    	if (moveY >= maxMoveY) {
                    		moveY = maxMoveY -2;
        				}
        				
                    	left = left + moveX;
        				width = width - moveX;
        				top = top + moveY;
        				height = height - moveY;
        				
        				els.left = left + 'px';
        				els.width = width + 'px';
        				els.top = top + 'px';
        				els.height = height + 'px';
        				
        			} else if (local === 'rt') {
        				
        				if (moveX < minMoveX) {
                    		moveX = minMoveX;
        				}
                    	if (moveY < minMoveY) {
                    		moveY = minMoveY;
                    	}
                    	if (customWH) {
                    		if(moveX > maxMoveX){
                    			moveX = maxMoveX;
                    		}
    					}
                    	if (moveY >= maxMoveY) {
                    		moveY = maxMoveY -2;
        				}
        				
        				width = width + moveX;
        				top = top + moveY;
        				height = height - moveY;
        				
        				els.width = width + 'px';
        				els.top = top + 'px';
        				els.height = height + 'px';
        				
        			} else if (local === 'lb') {

        				if (moveX < minMoveX) {
                    		moveX = minMoveX;
        				}
                    	if (moveY < minMoveY) {
                    		moveY = minMoveY;
                    	}
                    	if(moveX > maxMoveX){
                    		moveX = maxMoveX;
                        }
                    	if (customWH) {
    	                	if (moveY >= maxMoveY) {
    	                		moveY = maxMoveY -2;
    	    				}
                    	}
        				
                    	left = left + moveX;
        				width = width - moveX;
        				height = height + moveY;
        				
        				els.left = left + 'px';
        				els.width = width + 'px';
        				els.height = height + 'px';
        				
        			} else if (local === 'rb') {
        				
        				if (moveX < minMoveX) {
                    		moveX = minMoveX;
        				}
                    	if (moveY < minMoveY) {
                    		moveY = minMoveY;
                    	}
                    	if (customWH) {
    	                	if(moveX > maxMoveX){
    	                		moveX = maxMoveX;
    	                    }
    	                	if (moveY >= maxMoveY) {
    	                		moveY = maxMoveY -2;
    	    				}
                    	}
        				
        				width = width + moveX;
        				height = height + moveY;
        				
        				els.width = width + 'px';
        				els.height = height + 'px';
        			}
        			
        			for (var i = 0, len = moveReporthtmls.length; i < len; i++) {
        				var l = parseInt(moveReporthtmls[i].css('left'));
                    	var w = parseInt(moveReporthtmls[i].css('width'));
                    	var t = parseInt(moveReporthtmls[i].css('top'));
                    	var h = parseInt(moveReporthtmls[i].css('height'));
                    	if (local === 'lt') {
            				l = l + moveX,
            				w = w - moveX,
            				t = t + moveY;
            				h = h - moveY;
            			} else if (local === 'rt') {
            				w = w + moveX,
            				t = t + moveY;
            				h = h - moveY;
            			} else if (local === 'lb') {
            				l = l + moveX,
            				w = w - moveX,
            				h = h + moveY;
            			} else if (local === 'rb') {
            				w = w + moveX,
            				h = h + moveY;
            			}
        				moveReporthtmls[i].css('left', l),
                    	moveReporthtmls[i].css('top', t);
        				moveReporthtmls[i].css('width', w),
        				moveReporthtmls[i].css('height', h);
    				}
        			
                	console.info("minMoveX = " + minMoveX + ", minMoveY = " + minMoveY + ", maxMoveX = " + maxMoveX + ", maxMoveY = " + maxMoveY);
                	minMoveX = minMoveX - moveX,
                	minMoveY = minMoveY - moveY,
                	maxMoveX = maxMoveX - moveX,
                	maxMoveY = maxMoveY - moveY;
        		} 
        		//停止事件 
        		function mouseUp(e){
        			//在支持 releaseCapture 做些东东 
        			el.releaseCapture ? ( 
        					//释放焦点 
        					el.releaseCapture(),
        					//移除事件 
        					el.onmousemove = el.onmouseup = null 
        			) : ( 
        					//卸载事件 
        					$(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp) 
        			)
    				if (moveFlag) {
    					$scope.deleteReportGroup(true);
    					return false;
    				}
					if (!customWH) {
		        		var $reporGroup = $('.reporGroup'),
		            		height = $reporGroup.css('height'),
		            		top = $reporGroup.css('top'),
		            		width = $reporGroup.css('width'),
		            		left = $reporGroup.css('left'),
		            		maxHeight = $scope.getMaxWinHeight(),
		            		maxWidth = $scope.getMaxWinWidth(),
		            		currentHeight = parseInt(height) + parseInt(top),
		            		currentWidth = parseInt(left) + parseInt(width);
		        		if (currentHeight > maxHeight) {
		        			maxHeight = currentHeight
		        		}
		        		if (currentWidth > maxWidth) {
		        			maxWidth = currentWidth
		        		}
		        		$scope.page.height = maxHeight;
		        		$scope.page.width = maxWidth;
		        		$main.height(maxHeight);
		        		$main.width(maxWidth);
	            	}
	            	for (var i = 0, len = reports.length; i < len; i++) {
	            		var style = $scope.createStyleParams(moveReporthtmls[i]);
	            		reports[i].style = style;
	            		PageService.editReport(reports[i]).then(function(data) {
	            			$scope.updateReport(data);
	        			});
					}
        		}
    		});
    	}
    	
    	$scope.createReportGroupMoveSpan = function(reportHtml){
    		var el_lt = $('<span class="lower_right_corner gs-resize-handle gs-resize-handle-left-top"></span>')[0];
    		var el_rt = $('<span class="lower_right_corner gs-resize-handle gs-resize-handle-right-top"></span>')[0];
    		var el_lb = $('<span class="lower_right_corner gs-resize-handle gs-resize-handle-left-button"></span>')[0];
    		var el_rb = $('<span class="lower_right_corner gs-resize-handle gs-resize-handle-right-button"></span>')[0];
    		reportHtml.appendChild(el_lt);
    		reportHtml.appendChild(el_rt);
    		reportHtml.appendChild(el_lb);
    		reportHtml.appendChild(el_rb);
    		$scope.reportGroupStartChange(el_lt);
    		$scope.reportGroupStartChange(el_rt);
    		$scope.reportGroupStartChange(el_lb);
			$scope.reportGroupStartChange(el_rb);
    	}
    	
    	$scope.lineShow = function(flag) {
    		flag ? $line_up.show() : $line_up.hide();
    		flag ? $line_down.show() : $line_down.hide();
    		flag ? $line_left.show() : $line_left.hide();
    		flag ? $line_right.show() : $line_right.hide();
    	}
    	
    	$scope.lineStyle = function(left, top, width, height){
    		$line_up.css('top', top);
			$line_down.css('top', top + height);
			$line_left.css('left', left);
			$line_right.css('left', left + width);
    	}
    	
    	$scope.initLineStyle = function(left, top, width, height, flag){
    		$scope.lineStyle(left, top, width, height);
    		$scope.lineShow(flag);
    	}
    	
    	//移动事件
    	$scope.startdrag =  function(e, reportHtml) {
    		e_ul.style.display = "none";
			if (e.target.tagName === 'A') {
				return false;
			}
			if(e.target.tagName != 'INPUT'){
				e.preventDefault();
			}
            e.stopPropagation();
            var target = e.target,
                top = 0,
                left = 0,
                els = null,
                moveFlag = true,
                width = parseInt(reportHtml.style.width),
                maxWidth = 0,
                height = parseInt(reportHtml.style.height),
                maxHeight = 0,
                x = 0,
                y = 0;
            if (e.button ==2) {
            	var ClientRect = main.getBoundingClientRect();
            	var d = e_ul,
		       	 	sl = d.style;
		       	 	$(d).css("left",e.clientX -ClientRect.left); 
					$(d).css("top",e.clientY - ClientRect.top );
					sl.display = 'inline';
					$scope.changeReportSelected(reportHtml,true);
		            return false;
			} else if (e.ctrlKey && e.button == 0) {
				$scope.createReportGroup(reportHtml);
			} else {
				if (target.className.indexOf('lower_right_corner') < 0) {
					countDom(reportHtml);
				}else {
					return false;
				}
			}
            //获取条件元素 计算当前鼠标位置
            function countDom(target) {
            	$scope.changeReportSelected(target,true);
                els = target.style;
                maxWidth = $main[0].scrollWidth -width;
                maxHeight = $main[0].scrollHeight-height;
                //按下元素后，计算当前鼠标位置
                left = target.offsetLeft,
    			top = target.offsetTop,
                x = e.clientX - target.offsetLeft;
                y = e.clientY - target.offsetTop;
                $scope.initLineStyle(left, top, width, height, true);
                //IE下捕捉焦点 
                target.setCapture && target.setCapture();
                //绑定事件 
                $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp);
            }
            //移动事件 
            function mouseMove(e) {
            	moveFlag = false;
                left = e.clientX - x;
                if(left < 0){
                	left = 0;
                }
                top = e.clientY - y;
                if (top < 0) {
                	top = 0;
				}
                if($scope.page.customWH){
                	if(left >= maxWidth){
                    	left = maxWidth;
                    }
                	if (top >= maxHeight) {
                    	top = maxHeight -2;
    				}
                }
                els.top = top + 'px';
                els.left = left + 'px';
                
    			$scope.lineStyle(left, top, width, height);
            }
            //停止事件 
            function mouseUp(e) {
            	$(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
        		$scope.lineShow(false);
            	if (moveFlag) {
					return false;
				}
            	if (!$scope.page.customWH) {
            		var $reportHtml = $($scope.reportHtml),
	            		height = $reportHtml.css('height'),
	            		top = $reportHtml.css('top'),
	            		width = $reportHtml.css('width'),
	            		left = $reportHtml.css('left'),
	            		maxHeight = $scope.getMaxWinHeight($scope.reportHtml.id),
	            		maxWidth = $scope.getMaxWinWidth($scope.reportHtml.id),
	            		currentHeight = parseInt(height) + parseInt(top),
	            		currentWidth = parseInt(left) + parseInt(width);
            		if (currentHeight > maxHeight) {
            			maxHeight = currentHeight
            		}
            		if (currentWidth > maxWidth) {
            			maxWidth = currentWidth
            		}
            		$scope.page.height = maxHeight;
            		$scope.page.width = maxWidth;
            		$main.height(maxHeight);
            		$main.width(maxWidth);
				}
            	$scope.editReport($scope.reportHtml);
            }
        }
    	
    	
    	// 放大缩小边框事件
    	$scope.startChange = function(el){
    		//初始化参数 
    		var ep = el.parentNode,
    			className = el.className,
    			els = ep.style,moveFlag,
    			left, top, width, height,
	    		maxWidth = 0,
	    		maxHeight = 0,
	    		maxHeight = 0,
	    		maxHeight = 0,
	    		maxHeight = 0,
	    		x = 0, y = 0;
			$(el).mousedown(function(e){
				moveFlag = true;
				if (e.target.tagName === 'A') {
					return false;
				}
				e.preventDefault();
				e.stopPropagation();
				$scope.changeReportSelected(e.target.parentNode,true);
    			left = ep.offsetLeft,
    			top = ep.offsetTop,
    			width = ep.offsetWidth,
    			height = ep.offsetHeight;
    			$scope.initLineStyle(left, top, width, height, true);
    			if (className.indexOf('gs-resize-handle-left-top') > 0){
	    			maxWidth = left + width;
	    			maxHeight = top + height;
				} else if (className.indexOf('gs-resize-handle-right-top') > 0){
					maxWidth = e_main.scrollWidth - left;
	    			maxHeight = top + height;
				} else if (className.indexOf('gs-resize-handle-left-button') > 0){
	    			maxWidth = left + width;
	    			maxHeight = e_main.scrollHeight - top;
				} else if (className.indexOf('gs-resize-handle-right-button') > 0) {
    				maxWidth = e_main.scrollWidth - left;
    				maxHeight = e_main.scrollHeight - top;
				}
				//按下元素后，计算当前鼠标与对象计算后的坐标 
				x = e.clientX, y = e.clientY;
				//在支持 setCapture 做些东东 
				el.setCapture ? ( 
						//捕捉焦点 
						el.setCapture(), 
						//设置事件 
						el.onmousemove = function(ev){ 
							mouseMove(ev || event) 
						}, 
						el.onmouseup = mouseUp 
				) : ( 
						//绑定事件 
						$(document).bind("mousemove",mouseMove).bind("mouseup",mouseUp) 
				) 
				
				//防止默认事件发生 
				e.preventDefault();
			});
			//移动事件 
			function mouseMove(e){
				moveFlag = false;
    			var move_x = e.clientX - x,
    				move_y = e.clientY - y;
    			
				x= e.clientX;
				y = e.clientY;
				if (className.indexOf('gs-resize-handle-left-top') > 0){
					width = width - move_x;
					left = left + move_x;
					height = height - move_y;
					top = top + move_y;
					
					if(left < 0){
	    				left = 0;
	    			}
	    			if(left >= maxWidth){
	    				left = maxWidth-2;
	    			}
	    			els.left = left + 'px';
	    			if(top < 0){
	    				top = 0;
	    			}
	    			if(top >= maxHeight){
	    				top = maxHeight-2;
	    			}
	    			els.top = top + 'px';
				} else if (className.indexOf('gs-resize-handle-right-top') > 0){
					width = width + move_x;
					height = height - move_y;
					top = top + move_y;
					if(top < 0){
	    				top = 0;
	    			}
	    			if(top >= maxHeight){
	    				top = maxHeight-2;
	    			}
	    			els.top = top + 'px';
				} else if (className.indexOf('gs-resize-handle-left-button') > 0){
					width = width - move_x;
					left = left + move_x;
					height = height + move_y;
					if(left < 0){
	    				left = 0;
	    			}
	    			if(left >= maxWidth){
	    				left = maxWidth-2;
	    			}
	    			els.left = left + 'px';
				} else if (className.indexOf('gs-resize-handle-right-button') > 0) {
					width = width + move_x;
					height = height + move_y;
				}
				if(width < 0){
					width = 1;
                }
                if($scope.page.customWH || className.indexOf('gs-resize-handle-left-top') > 0 || className.indexOf('gs-resize-handle-left-button') > 0){
                	if(width >= maxWidth){
                    	width = maxWidth;
                    }
                }
                if (height < 0) {
                	height = 1;
				}
                if($scope.page.customWH || className.indexOf('gs-resize-handle-left-top') > 0 || className.indexOf('gs-resize-handle-right-top') > 0){
                	if (height >= maxHeight) {
                		height = maxHeight -2;
    				}
                }
				els.width = width + 'px', 
				els.height = height + 'px';
				
                $scope.lineStyle(left, top, width, height);
			} 
			//停止事件 
			function mouseUp(e){
				//在支持 releaseCapture 做些东东 
				el.releaseCapture ? ( 
						//释放焦点 
						el.releaseCapture(),
						//移除事件 
						el.onmousemove = el.onmouseup = null 
				) : ( 
						//卸载事件 
						$(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp) 
				)
        		$scope.lineShow(false);
            	if (moveFlag) {
					return false;
				}
            	var reportHtml = el.parentNode;
            	if (!$scope.page.customWH) {
            		var $reportHtml = $(reportHtml),
            			height = $reportHtml.css('height'),
	            		top = $reportHtml.css('top'),
	            		width = $reportHtml.css('width'),
	            		left = $reportHtml.css('left'),
	            		maxHeight = $scope.getMaxWinHeight(reportHtml.id),
	            		maxWidth = $scope.getMaxWinWidth(reportHtml.id),
	            		currentHeight = parseInt(height) + parseInt(top),
	            		currentWidth = parseInt(left) + parseInt(width);
            		if (currentHeight > maxHeight) {
            			maxHeight = currentHeight
            		}
            		if (currentWidth > maxWidth) {
            			maxWidth = currentWidth
            		}
            		$scope.page.height = maxHeight;
            		$scope.page.width = maxWidth;
            		$main.height(maxHeight);
            		$main.width(maxWidth);
				}
				$scope.initReportChartData(reportHtml);
			}
			$(ep).mouseover(function(e){
				$(this).find('.lower_right_corner').show();
				$(this).find('.deleteLink').show();
			});
			$(ep).mouseout(function(e){
				$(this).find('.lower_right_corner').hide();
				$(this).find('.deleteLink').hide();
			});
    	}
    	
    	$scope.createMoveSpan = function(o){
    		var el_lt = $('<span class="lower_right_corner gs-resize-handle gs-resize-handle-left-top" style="display: none;"></span>')[0];
    		var el_rt = $('<span class="lower_right_corner gs-resize-handle gs-resize-handle-right-top" style="display: none;"></span>')[0];
    		var el_lb = $('<span class="lower_right_corner gs-resize-handle gs-resize-handle-left-button" style="display: none;"></span>')[0];
    		var el_rb = $('<span class="lower_right_corner gs-resize-handle gs-resize-handle-right-button" style="display: none;"></span>')[0];
    		o.appendChild(el_lt);
    		o.appendChild(el_rt);
    		o.appendChild(el_lb);
    		o.appendChild(el_rb);
    		$scope.startChange(el_lt);
    		$scope.startChange(el_rt);
    		$scope.startChange(el_lb);
			$scope.startChange(el_rb);
    	}
		
		$scope.createDeleteA = function(o){
    		var deleteLink = document.createElement('a');
			deleteLink.href="#"; 
			deleteLink.setAttribute("class", "deleteLink td-colose");
			deleteLink.style.display = 'none';
			deleteLink.onclick = function(e){
				$scope.deleteReport(this.parentNode.id);
				$(this.parentNode).remove();
			} 
			o.appendChild(deleteLink);
    	}
		
		$scope.createReportHtml = function(report){
			var id = report.id,
				style = report.style,
				left = style.left,
				width = style.width,
				top = style.top,
				height = style.height,
				index = report.index;
			if ($scope.editFlag) {
				var pageHeight =$main.height(),
					pageWidth =$main.width();
				left = 	parseInt(left * pageWidth / 100) + 'px',
				width = parseInt(width * pageWidth / 100) + 'px',
				top = 	parseInt(top * pageHeight / 100) + 'px',
				height = parseInt(height * pageHeight / 100) + 'px';
			} else {
				left = left + '%',
				width = width + '%',
				top = top + '%',
				height = height + '%';
			}
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
		
		$scope.createReportEdit = function(report,lastReport){
			var reportHtml = $scope.createReportHtml(report);
			$scope.createDeleteA(reportHtml[0]);
			$scope.createMoveSpan(reportHtml[0]);
			$scope.reportHtml = reportHtml[0];
			$main.append(reportHtml);
			if (lastReport) {
				$scope.report = report;
				$scope.changeReportSelected(reportHtml[0]);
			}
			$(reportHtml).mousedown(function(e){
	        	$scope.startdrag(e,this);
	        });
		}
		
		$scope.createReportView = function(report){
			var reportHtml = $scope.createReportHtml(report);
			$main.append(reportHtml);
		}
		
		$scope.initReports = function(){
			var reports = $scope.page.reports;
			for (var i = 0; i < reports.length; i++) {
				$('#' + reports[i].id).remove();
				$scope.reports['report'+reports[i].id] = reports[i];
				if($scope.editFlag){
					$scope.createReportEdit(reports[i], i == reports.length-1);
				}else {
					$scope.createReportView(reports[i]);
				}
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
		
		$scope.initBackgroundStyle = function(page){
			if (page.bgColor && page.bgColor != "none") {
				$main.css('background',page.bgColor);
			} else if (page.bgImg && page.bgImg != "none") {
				$main.css({
					'background': 'url("'+ path + page.bgImg +'") no-repeat',
					'background-size' : '100% 100%'
				});
			} else {
				$main.css('background','');
			}
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
			$main.css('height', height);
			$main.css('width', width);
			$scope.initBackgroundStyle(page);
		}
		
		$scope.initPage = function(){
			$scope.custom.customPageEditFlag = false;
			var page = $scope.page;
			$scope.initPageStyle();
			if ($scope.page && $scope.page.reports.length > 0) {
				$scope.initReports();
			} else {
				$scope.editFlag = true;
				$scope.switchEdit();
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
				$scope.custom.currentPageIndex = 0;
				if (data.pages.length > 0) {
					$scope.custom.pages[0].selected = true;
					$scope.queryPageDetail($scope.custom.pages[0].id);
				} else if (type == 1) {
					$scope.insertPage(data.id);
				}
			});
		}
		
		
		$scope.init = function() {
			//页面样式初始化
			$scope.initBaseStyle();
			//数据初始化
			$scope.initCustom(id);
		}
		
		//初始化入口
		$scope.init();
		
		$scope.initReportChartData = function(reportHtml){
			if(reportHtml === undefined){
				reportHtml = $scope.reportHtml;
			}
			if (!reportHtml) {
				return false;
			}
			$scope.editReport(reportHtml);
		};
		
		$scope.editReport = function(reportHtml){
			var report = $scope.createReportParams(reportHtml);
			if ('none' === report.reportProperty.type) {
				return false;
			}
			$scope.reportHtml = reportHtml;
			PageService.editReport(report).then(function(data) {
				var $reportHtml = $(reportHtml);
				$scope.reporGroup = [data];
				if($reportHtml.attr('id') == null){
					$reportHtml.remove();
					$scope.createReportEdit(data,true);
					$scope.addReport(data);
				}else{
					$scope.updateReport(data);
				}
			});
		}
		
		$scope.addReport = function(report){
			$scope.reports['report' + report.id] = report;
			$scope.page.reports.push(report);
			$scope.report = report;
		}
		
		$scope.updateReport = function(report){
			$scope.reports['report' + report.id] = report;
			var reports = $scope.page.reports;
			for (var i = 0; i < reports.length; i++) {
				if (reports[i].id == report.id) {
					reports[i] = report;
				}
			}
			$scope.report = report;
		}
		
		$scope.deleteReport = function(id){
			$scope.deleteId = id;
			PageService.deleteReport(id).then(function(data) {
				var reports = $scope.page.reports;
				for (var i = reports.length -1; i >= 0; i--) {
					if (reports[i].id == $scope.deleteId) {
						reports.splice(i,1);
					}
				}
			});
		}
		
		$scope.createReportParams = function(reportHtml){
			var $reportHtml = $(reportHtml),
				report_id = $reportHtml.attr('id'),
				index = $reportHtml.css('z-index');
			
			var source = $scope.createSourceParams();
			var reportProperty = $scope.createReportPropertyParams($reportHtml,report_id);
			var style = $scope.createStyleParams($reportHtml);
			var report = {
					id : report_id,
					index : index,
					pageId : $scope.page.id,
					sourceId: source.id,
					source: source,
					reportPropertyId : reportProperty.id,
		            reportProperty : reportProperty,
		            styleId : style.id,
		            style: style
				};
			return report;
		}
		
		$scope.createSourceParams = function(){
			var source = $scope.report.source;
			return source;
		}
		
		$scope.createReportPropertyParams = function($reportHtml){
			var id = $reportHtml.attr('reportPropertyId'),
				reportProperty = $scope.reportProperty,
				property = reportProperty.property;
			
			var reportProperty = {
					id : id,
					type : reportProperty.type,
					property : JSON.stringify(property)
			};
			return reportProperty;
		}
		
		$scope.createStyleParams = function($reportHtml){
			var id = $reportHtml.attr("styleid"),
				height = $reportHtml.css('height'),
				width = $reportHtml.css('width'),
				left = $reportHtml.css('left'),
				top = $reportHtml.css('top'),
				pageWidth = $main.width(),
				pageHeight = $main.height();
			height = parseInt(height);
			width = parseInt(width);
			left = parseInt(left);
			top = parseInt(top);
			
			left = (left * 100 / pageWidth).toFixed(2);
			width = (width * 100 / pageWidth).toFixed(2);
			top = (top * 100 / pageHeight).toFixed(2);
			height = (height * 100 / pageHeight).toFixed(2);
			var style = {
	            	id : id,
	                left: left,
	                top: top,
	                height: height,
	                width: width,
	                winHeight: pageHeight,
	                winWdith: pageWidth
			};
			return style;
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
		
		//page 相关方法
		$scope.getInitPage = function (customId) {
			var page = {index : 1, name : "第一页",bgColor : '#FFF',customId : customId};
			return page;
		}
		
		$scope.insertPage = function(customId){
			var page = $scope.getInitPage(customId);
			PageService.editPage(page).then(function(data) {
				data.selected = true;
				$scope.custom.pages.push(data);
				$scope.custom.currentPageIndex = 0;
				$scope.page = data;
				$scope.initPage();
			});
		}
		
		$scope.editPage = function(name,id){
			var customId = $scope.custom.id;
			var page = {id : id, name : name,customId : customId};
			PageService.editPage(page).then(function(data) {
				$scope.custom.pages.push(data);
				$scope.changePageIndex($scope.custom.pages.length-1);
			});
		}
		
		$scope.changePages = function(num){
			var pages = $scope.custom.pages,
				reports = $scope.page.reports;
			var currentPageIndex = $scope.custom.currentPageIndex;
			num = currentPageIndex + num;
			if (pages.length == 0 || num >= pages.length || num < 0) {
				return false;
			}
			for (var i = 0, len = reports.length; i < len; i++) {
				$('#' + reports[i].id).remove();
			}
			$scope.changePageIndex(num);
		}
		
		$scope.selectPage = function(index){
			var pages = $scope.custom.pages;
			if(index != $scope.custom.currentPageIndex){
				$scope.changePageIndex(index);
			}
		}
		
		$scope.changePageIndex = function (index) {
			var pages = $scope.custom.pages,
				reports = $scope.page.reports;
			for (var i = 0, len = pages.length; i < len; i++) {
				pages[i].selected = false;
				if (index === i) {
					pages[i].selected = true;
					$scope.custom.currentPageIndex = i;
					$scope.page = pages[index];
				}
			}
			
			for (var i = 0, len = reports.length; i < len; i++) {
				$('#' + reports[i].id).remove();
			}
			
			$scope.queryPageDetail($scope.page.id);
		}
		
		$scope.deletePage = function(index){
			var pages = $scope.custom.pages,page = pages[index];
			$.Pop.confirms('确认删除页面 \'' + page.name + '\'?',function(){
				PageService.deleteById(page.id).then(function(data) {
					$scope.page = {reports:[], customWH : false, customId : id, index : 1};
					pages = pages.splice(index,1);
					if (pages.length > 0) {
						$scope.changePageIndex(0);
					}
					$scope.initPage(true);
				});
			});
		}
		
		$scope.showCustomPageEdit = function ($event) {
			var elem = $event.target,
				client = elem.getBoundingClientRect(),
				top = client.top- toolbarHHeight - tdContentHeaderHeight -parseInt($td_content_type.css('height'));
			$('.custom-page-edit').css('top',top);
			$scope.custom.customPageEditFlag = !$scope.custom.customPageEditFlag;
		}
		
		//page 背景颜色
		$scope.changeBackgroundColor = function(color){
    		if (color && $scope.page.bgColor != color) {
    			var custom = {
    					id : $scope.page.id,
    					bgColor : color
    			};
    			PageService.editPage(custom).then(function(data) {
					$scope.page.bgColor = data.bgColor;
					$scope.page.bgImg = data.bgImg;
					$scope.initBackgroundStyle($scope.page);
    			});
			}
    	}
		
		//page 背景图片
		$scope.initImport=function(){
			$scope.f=null;
			$scope.uploadFile = {};
			$scope.uploadFile.dataFile;
			$scope.uploadFile.description = "";
			$scope.uploadFile.uploadFileName = '请选择文件上传';
		}
		$scope.selectUploadFile = function(file){
			$scope.f = file;
	        if (file && !file.$error) {
	        	if (file[0].type.indexOf('image') < 0) {
	        		$scope.uploadFile.dataFile = null;
	        		$scope.uploadFile.uploadFileName = '上传的文件不是图片格式';
	        	} else if (file[0].size > 20*1024*1024) {
	        		$scope.uploadFile.dataFile = null;
	        		$scope.uploadFile.uploadFileName = '上传的文件过大';
	        	} else {
	        		$scope.uploadFile.uploadFileName = file[0].name;
	        	}
	        }else{
	        	$scope.uploadFile.uploadFileName = '没有选择任何文件';
	        }
		}
		$scope.uploadCustomFile = function(callback){
			var file = $scope.uploadFile.dataFile;
	        if (file && !file.$error) {
				file.upload = Upload.upload({
	                url:  'uploadCustomBgImg',
	                file: $scope.uploadFile.dataFile,
	                fields: {
                        id: $scope.page.id || '',
                        customId : id
                    },
	            });
				file.upload.then(function (data) {
					if(data.data.success){
						$scope.page.bgColor = data.data.data.bgColor;
						$scope.page.bgImg = data.data.data.bgImg;
						$scope.initBackgroundStyle($scope.page);
						callback.call();
					}
				 });
				file.upload.progress(function (evt) {
	                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	            });
	        }
		}
		
    	//page 自定义长宽
		$scope.changeCustomWH = function(flag){
			if ($scope.page.customWH) {
				var _page = $scope.page
				var page = {
    					id : _page.id,
    					customWH : _page.customWH,
    					width : _page.width,
    					height : _page.height,
    			};
				PageService.editPage(page).then(function(data) {
					data.reports = $scope.page.reports;
					$scope.page = data;
					$scope.initPage();
    			});
			}
		}
		
		//切换成数据选项界面
		$scope.clickDataConfige = function() {
			if ($scope.radio.chartTypeRadio !== 'none') {
				$scope.showDataConfige = true
			}
		}
		
		window.onresize=function(){
			setTimeout(function(){
				$scope.initBaseStyle();
				$scope.initPage();
				$scope.$apply();
			},10);
        }
		
	}];
   }
);
