define(['app','angularAMD','echarts','china','dark','infographic','macarons','roma','shine','vintage'], function (app,angularAMD,echarts) {
    'use strict';
    angularAMD.directive('eChart',[
        function() {
    	return {
    		restrict : 'EA',
    		transclude : true,
            scope:{
            	eData : '=',
            	eTheme : '=',
            	loading : "="
    		},
            link: function($scope, element, attrs) {
                var myChart = echarts.init(element[0]);
                $scope.$watch('eData', function() {
                    var option = $scope.eData;
                    if (angular.isObject(option)) {
                        myChart.setOption(option);
                    }
                }, true);
                $scope.$watch('eTheme', function() {
                	if ($scope.eTheme) {
                		myChart = echarts.init(element[0],$scope.eTheme);
                		var option = $scope.eData;
                		if (angular.isObject(option)) {
                			myChart.setOption(option);
                		}
					}
                }, true);
                $scope.getDom = function() {
                    return {
                        'height': element[0].offsetHeight,
                        'width': element[0].offsetWidth
                    };
                };
                
                $scope.$watch($scope.getDom, function() {
                    myChart.resize();
                }, true);
                
                $scope.$watch('loading',function() {
    				if($scope.loading){
    					myChart.showLoading({
    	                    text: '读取数据中...', //loading，是在读取数据的时候显示
    	                    maskColor: 'rgba(255, 255, 255, 0)',
    	                    color : "#8ec8fd"
    	                });
    				}else{
    					myChart.hideLoading();
    				}
    			},true);
            }
    	}
    }]);
});
