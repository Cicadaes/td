define([ 'app','angularAMD','app/service/EventfunnelService','app/filters/common/CommonFilter'],function(app, angularAMD) {'use strict';
    return ['$scope', '$state', '$stateParams','$location', '$http','NgTableParams','EventfunnelService',
            function ($scope, $state, $stateParams, $location, $http,ngTableParams,EventfunnelService) {
    		var Rect;	
    		$scope.initData = function(){
					Rect = { 
						//当前正在画的矩形对象 
						obj: null, 
						//画布 
						container: null, 
						//初始化函数 
						init: function(containerId){ 
							Rect.container = document.getElementById(containerId); 
							if(Rect.container){ 
								//鼠标按下时开始画 
								Rect.container.onmousedown = Rect.start; 
							} 
							else{ 
								alert('You should specify a valid container!'); 
							} 
						}, 
						start: function(e){ 
							if (e.target.tagName === 'A') {
								return false;
							}
//							var o = Rect.obj = $(".highchartc").clone().removeAttr("hidden")[0];
							var o = Rect.obj = $('<div class="clrfix"></div>')[0];
							var hg = $('<div class="highCharData"></div>')[0];
//							var o = Rect.obj = document.createElement('div');
							o.style.position = "absolute"; 
							// mouseBeginX，mouseBeginY是辅助变量，记录下鼠标按下时的位置
							$(o).css("left",o.mouseBeginX = Rect.getEvent(e).x); 
							$(o).css("top",o.mouseBeginY = Rect.getEvent(e).y); 
							o.style.height = 0; 
							o.style.width = 0; 
							o.style.border = "solid black 1px"; 
							//向o添加一个叉叉，点击叉叉可以删除这个矩形 
							var deleteLink = document.createElement('a'); 
							deleteLink.href="#"; 
							deleteLink.onclick = function(e){ 
//								$scope.initHighChartData();
								Rect.container.removeChild(this.parentNode); 
								//this.parentNode.style.display = "none"; 
								//alert(this.tagName); 
							} 
							deleteLink.innerText = "x"; 
							var el = $('<span id="test1" class="gs-resize-handle gs-resize-handle-both" style="display: none;"></span>')[0];
							o.appendChild(hg);
							o.appendChild(deleteLink);
							o.appendChild(el);
							
							//初始化参数 
							var ep = el.parentNode;
							var els = ep.style;
							//鼠标的 X 和 Y 轴坐标 
							var x =0, y = 0; 
							$(el).mousedown(function(e){
								//按下元素后，计算当前鼠标与对象计算后的坐标 
								x = e.clientX - ep.offsetWidth, 
								y = e.clientY - ep.offsetHeight; 
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
								e.preventDefault() 
							}); 
							//移动事件 
							function mouseMove(e){ 
								//宇宙超级无敌运算中... 
								els.width = e.clientX - x + 'px', 
								els.height = e.clientY - y + 'px' 
								$scope.initHighChartData(); 
							} 
							//停止事件 
							function mouseUp(){ 
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
								$scope.stopDraw();
							}
							
							$(o).mouseover(function(){
							     $("#test1").show();
							  });
							  $(o).mouseout(function(){
							    $("#test1").hide();
							  });
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
							if(dx<0){ 
								o.style.left = Rect.getEvent(e).x; 
							} 
							if(dy<0){ 
								o.style.top = Rect.getEvent(e).y; 
							} 
							$(o).height(Math.abs(dy));
							$(o).width(Math.abs(dx));
						}, 
						end: function(e){
							var o = Rect.obj;
							$(o).children(".highCharData").height($(o).height() - 40);
							//onmouseup时释放onmousemove，onmouseup事件句柄 
							Rect.container.onmousemove = null; 
							Rect.container.onmouseup = null; 
							Rect.obj = null;
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
			}
			$scope.initData();
			
			$scope.stopDraw = function(){
				Rect.container.onmousedown = null;
			}
			$scope.startDraw = function(){
				$scope.initData();
			}
			
			$scope.radio={};
			$scope.radio.dataSourceRadio = 1;
			$scope.radio.chartTypeRadio = 1;
			
			$scope.initHighChartData = function(e){
				console.debug("dataSourceRadio=" + $scope.radio.dataSourceRadio);
				console.debug("chartTypeRadio=" + $scope.radio.chartTypeRadio);
				var type = $scope.radio.chartTypeRadio;
				var par = { 
						type : type,
						categories:[1,2,3,4],
						tickInterval :1,
						series: [{
	 					name : "demo",
	 					data : [23,13,45,24], 
	 					xAxis: 0
	 				}]
				};
				$('.highCharData').highcharts(HighchartsOptions.line(par));
	    		
	    		$('.clrfix').mousedown(function(e){
		        	$scope.startdrag(e);
		        });
			}
			
			$scope.startdrag =  function(e) {
	            e.preventDefault();
	            e.stopPropagation();
	            var target = e.target,
	                startarTop = 0,
	                startarLeft = 0,
	                els = null,
	                x = 0,
	                y = 0;
	            //三层判断 原生js处理
	            if (target.tagName === $('.highCharData').find('rect')[1].tagName) {
	                countDom($('.clrfix')[1]);
	            }else {
	                //点击其他区域 拖拽
	            }
	            //获取条件元素 计算当前鼠标位置
	            function countDom(target) {
	                els = target.style;
	                //按下元素后，计算当前鼠标位置
	                startarTop = els.top;
	                startarLeft = els.left;
	                x = e.clientX - target.offsetLeft;
	                y = e.clientY - target.offsetTop;
	                //IE下捕捉焦点 
	                target.setCapture && target.setCapture();
	                //绑定事件 
	                $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp);
	            }
	            //移动事件 
	            function mouseMove(e) {
	                els.top = e.clientY - y + 'px';
	                els.left = e.clientX - x + 'px';
	            }
	            //停止事件 
	            function mouseUp() {
	            	$(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
	            }
	        }
			
			
			
			$scope.resize = function(){
				function bindResize(el){ 
					//初始化参数 
					var ep = el.parentNode;
					var els = ep.style;
					//鼠标的 X 和 Y 轴坐标 
					var x =0, y = 0; 
					//邪恶的食指 
					$(el).mousedown(function(e){
						//按下元素后，计算当前鼠标与对象计算后的坐标 
						x = e.clientX - ep.offsetWidth, 
						y = e.clientY - ep.offsetHeight; 
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
						e.preventDefault() 
					}); 
					//移动事件 
					function mouseMove(e){ 
						//宇宙超级无敌运算中... 
						els.width = e.clientX - x + 'px', 
						els.height = e.clientY - y + 'px' 
					} 
					//停止事件 
					function mouseUp(){ 
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
					} 
				}
				bindResize(document.getElementById('test1'));
				  $("#test").mouseover(function(){
				     $("#test1").show();
				  });
				  $("#test").mouseout(function(){
				    $("#test1").hide();
				  });
			}
			$scope.resize();
		
		}];
	}
);
