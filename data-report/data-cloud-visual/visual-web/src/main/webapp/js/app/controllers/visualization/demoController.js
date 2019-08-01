define([ 'app','angularAMD','echarts','china','app/service/CustomService','app/filters/common/CommonFilter','table-freeze','app/directive/FontColor',
         'app/directive/EChart','app/common/EchartsOptions','app/common/MacDock'],function(app, angularAMD,echarts) {'use strict';
    return ['$scope', '$state', '$stateParams','$location', '$http','$filter','NgTableParams','CustomService','$compile','Upload',
            function ($scope, $state, $stateParams, $location, $http,$filter,ngTableParams,CustomService,$compile,Upload) {
    	
    	 document.getElementById("onmousedown").onmousedown = function(e){
             if(e.button ==2){
            	 e.preventDefault();
            	 e.stopPropagation();
            	 var d = document.getElementById('ul'),
            	 	 sl = d.style;
            	 	$(d).css("left",e.x); 
					$(d).css("top",e.y);
					sl.display = 'inline';
                 d.onclick = function(e){
                	 e.preventDefault();
                	 e.stopPropagation();
                	 this.style.display = 'none';
                 }
                 return false;
             }else if(e.button ==0){
            	 if (e.target.tagName === 'LI') {
     				return false;
     			}
             }
             return false;
         }
    	
    	$scope.conditions = [ 'vintage','Top10版本分布','Top10机型分布','Top10系统分布'];
    	$scope.ccondition = 'Top10版本分布';
    	
    	$scope.selectedIcon = "";
    	$scope.selectedIcons = ["Globe","Heart"];
    	$scope.icons = [{"value":"Gear","label":"<i class=\"fa fa-gear\"></i> Gear"},{"value":"Globe","label":"<i class=\"fa fa-globe\"></i> Globe"},{"value":"Heart","label":"<i class=\"fa fa-heart\"></i> Heart"},{"value":"Camera","label":"<i class=\"fa fa-camera\"></i> Camera"}];
    	
    	var randomData = function randomData() {
    	    return Math.round(Math.random()*1000);
    	}
    	$scope.createEcharts = function(){
	    	var myChart = echarts.init(document.getElementById('main'));
	    	var option = {
	    		    title : {
	    		        text: 'iphone销量',
	    		        subtext: '纯属虚构',
	    		        x:'center'
	    		    },
	    		    tooltip : {
	    		        trigger: 'item'
	    		    },
	    		    legend: {
	    		        orient: 'vertical',
	    		        x:'left',
	    		        data:['iphone3']
	    		    },
	    		    dataRange: {
	    		        min: 0,
	    		        max: 2500,
	    		        x: 'left',
	    		        y: 'bottom',
	    		        text:['高','低'],           // 文本，默认为数值文本
	    		        calculable : true
	    		    },
	    		    series : [
	    		        {
	    		            name: 'iphone3',
	    		            type: 'map',
	    		            mapType: 'china',
	    		            roam: false,
	    		            itemStyle:{
	    		                normal:{label:{show:true}},
	    		                emphasis:{label:{show:true}}
	    		            },
	    		            data:[
	    		                {name: '北京',value: Math.round(Math.random()*1000)},
	    		                {name: '天津',value: Math.round(Math.random()*1000)},
	    		                {name: '上海',value: Math.round(Math.random()*1000)},
	    		                {name: '重庆',value: Math.round(Math.random()*1000)},
	    		                {name: '河北',value: Math.round(Math.random()*1000)},
	    		                {name: '河南',value: Math.round(Math.random()*1000)},
	    		                {name: '云南',value: Math.round(Math.random()*1000)},
	    		                {name: '辽宁',value: Math.round(Math.random()*1000)},
	    		                {name: '黑龙江',value: Math.round(Math.random()*1000)},
	    		                {name: '湖南',value: Math.round(Math.random()*1000)},
	    		                {name: '安徽',value: Math.round(Math.random()*1000)},
	    		                {name: '山东',value: Math.round(Math.random()*1000)},
	    		                {name: '新疆',value: Math.round(Math.random()*1000)},
	    		                {name: '江苏',value: Math.round(Math.random()*1000)},
	    		                {name: '浙江',value: Math.round(Math.random()*1000)},
	    		                {name: '江西',value: Math.round(Math.random()*1000)},
	    		                {name: '湖北',value: Math.round(Math.random()*1000)},
	    		                {name: '广西',value: Math.round(Math.random()*1000)},
	    		                {name: '甘肃',value: Math.round(Math.random()*1000)},
	    		                {name: '山西',value: Math.round(Math.random()*1000)},
	    		                {name: '内蒙古',value: Math.round(Math.random()*1000)},
	    		                {name: '陕西',value: Math.round(Math.random()*1000)},
	    		                {name: '吉林',value: Math.round(Math.random()*1000)},
	    		                {name: '福建',value: Math.round(Math.random()*1000)},
	    		                {name: '贵州',value: Math.round(Math.random()*1000)},
	    		                {name: '广东',value: Math.round(Math.random()*1000)},
	    		                {name: '青海',value: Math.round(Math.random()*1000)},
	    		                {name: '西藏',value: Math.round(Math.random()*1000)},
	    		                {name: '四川',value: Math.round(Math.random()*1000)},
	    		                {name: '宁夏',value: Math.round(Math.random()*1000)},
	    		                {name: '海南',value: Math.round(Math.random()*1000)},
	    		                {name: '台湾',value: Math.round(Math.random()*1000)},
	    		                {name: '香港',value: Math.round(Math.random()*1000)},
	    		                {name: '澳门',value: Math.round(Math.random()*1000)}
	    		            ]
	    		        }
	    		    ]
	    		};
	    	$scope.option = option;
	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);
    	}
    	$scope.createEcharts();
        $scope.createDiv = function(){
        	var template = '<div td-date-condition date-range="dateRange" class="fr"></div>';
        	template = $scope.createTableHtml(['月份','用户']);
        	var con = angular.element.find('.test');
        	con = $('.test')
        	template = $compile(template)($scope);
        	con.append(template)
//    		$compile(con)($scope);
        }
        
        $scope.hello = function(){
        	alert("aa");
        }
        
    	var datas = [
    	             ['Jan',23],
    	             ['Feb',13],
    	             ['Mar',45],
    	             ['Apr',24], 
    	             ['Feb',13],
    	             ['Mar',45],
    	             ['Apr',24], 
    	             ['Feb',13],
    	             ['Mar',45],
    	             ['Apr',24], 
    	             ['Feb',13],
    	             ['Mar',45],
    	             ['Mar',45],
    	             ['Apr',24], 
    	             ['Feb',13],
    	             ['Mar',45],
    	             ['Apr',24], 
    	             ['Feb',13],
    	             ['Mar',45],
    	             ['Apr',24] 
    			];
    	    	$scope.datas =datas;
    	    	$scope.tableParams = TableOptions.defaultTableDesc({datas : datas},ngTableParams,$filter);
    			$scope.tableParams1 = TableOptions.simpleTable(datas,ngTableParams);
    			$scope.tableParams2 = TableOptions.simpleTable(datas,ngTableParams);
    			$scope.tableParams3 = TableOptions.simpleTable(datas,ngTableParams);
    			
    			
    			
	    	$scope.calNgTableBody = function(){
				if($("#tableParams").attr("freeze") == "true"){
					var $table = $("#tableParams");
					var $tbody = $table.find("tbody");
					var $ngTableBody =  $table.parent();
					var ngTableBodyHg = 150;
					var tbodyHg = $tbody.height();
					if(tbodyHg == 0){
						$ngTableBody.addClass("ng-table-body-empty");
					}else{
						$ngTableBody.removeClass("ng-table-body-empty");
					}
					$ngTableBody.css({"max-height":ngTableBodyHg+"px"});
					$table.FrozenTable(1,0,0);
					$('#oDivH_tableParams').css("top",1);
				}
			}
    			
	    	 window.setTimeout(function(){
				  	$scope.calNgTableBody(); 
			  	},50);
    			
    	var num = 1;		
    	$scope.createTableHtml = function(titles){
    		var tableTemplate = '<div loading-container="tableParams'+ num +'.settings().$loading"><table ng-table="tableParams'+num+'" class="table ng-table-responsive table-hover"><tr align="center" ng-repeat="user in $data">';
    		for (var i = 0; i < titles.length; i++) {
				var html = '<td data-title="\'' + titles[i] +  '\'"  align="center">{{user[' + i + ']}}</td>';
				tableTemplate += html;
			}
    		tableTemplate = tableTemplate + '</tr></table></div>';
    		num++;
    		return tableTemplate;
    	}
    	//上传
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
	        	$scope.uploadFile.uploadFileName = file[0].name;
	        }else{
	        	$scope.uploadFile.uploadFileName = '没有选择任何文件';
	        }
		}
		$scope.importUserProfileList = function(callback){
			var file = $scope.uploadFile.dataFile;
	        if (file && !file.$error) {
				file.upload = Upload.upload({
	                url:  'importEventServlet',
	                file: $scope.uploadFile.dataFile,
	                fields: {
                        id: 129
                    },
	            });
				
				file.upload.then(function (data) {
					$.Pop.alerts(data.data.msg);
					if(data.data.success){
						callback.call();
						$scope.query();
					}
				 });
				file.upload.progress(function (evt) {
	                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	            });
	        }
		}
    	setTimeout(function(){
    		dockEffect({
    			el: 'menu'
    		});
    	}, 500)
		
	}];
   }
);
